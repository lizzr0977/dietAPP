import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

function slugify(value: string) {
  return String(value || 'dish')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return null;

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

function publicUrlFor(path: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  if (!url) return '';
  return `${url}/storage/v1/object/public/dish-images/${path}`;
}

async function objectExists(path: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;

  const folder = path.split('/').slice(0, -1).join('/');
  const name = path.split('/').pop();

  const { data, error } = await supabase.storage.from('dish-images').list(folder, {
    search: name,
    limit: 1,
  });

  if (error) return false;
  return !!data?.some((item) => item.name === name);
}

async function generateImage(apiKey: string, prompt: string) {
  const models = ['imagen-4.0-fast-generate-001', 'imagen-4.0-generate-001', 'imagen-3.0-generate-002'];
  const attempts: any[] = [];

  for (const model of models) {
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=` +
      encodeURIComponent(apiKey);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: '1:1',
          outputMimeType: 'image/png',
        },
      }),
    });

    const raw = await response.text();
    let data: any = null;

    try {
      data = JSON.parse(raw);
    } catch {
      data = null;
    }

    const b64 =
      data?.predictions?.[0]?.bytesBase64Encoded ||
      data?.predictions?.[0]?.image?.bytesBase64Encoded ||
      '';

    attempts.push({
      model,
      ok: response.ok,
      status: response.status,
      error: data?.error || null,
      rawPreview: raw.slice(0, 600),
    });

    if (response.ok && b64) {
      return { base64: b64, model, attempts };
    }
  }

  return { base64: '', model: '', attempts };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const dishId = slugify(url.searchParams.get('dishId') || '');

  if (!dishId) {
    return NextResponse.json({ imageUrl: '' });
  }

  const path = `dishes/${dishId}.png`;
  const exists = await objectExists(path);

  return NextResponse.json({
    imageUrl: exists ? publicUrlFor(path) : '',
    exists,
  });
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        error: 'Falta GEMINI_API_KEY en Vercel.',
      });
    }

    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json({
        error:
          'Falta SUPABASE_SERVICE_ROLE_KEY o NEXT_PUBLIC_SUPABASE_URL en Vercel. Esto se necesita para guardar imágenes en Supabase Storage.',
      });
    }

    const body = await request.json().catch(() => null);
    const lang = body?.lang === 'en' ? 'en' : 'es';
    const dish = body?.dish || {};
    const profile = body?.profile || {};
    const dishId = slugify(dish.id || dish.name_es || dish.name_en || 'dish');
    const path = `dishes/${dishId}.png`;

    const alreadyExists = await objectExists(path);
    if (alreadyExists && !body?.force) {
      return NextResponse.json({
        imageUrl: publicUrlFor(path),
        cached: true,
      });
    }

    const diet = profile?.diet_type || '';
    const ingredients = [
      ...(dish.ingredients_es || []),
      ...(dish.ingredients_en || []),
    ].join(', ');

    const prompt =
      lang === 'es'
        ? `Foto realista cuadrada de comida mexicana casera para una app de dietas. Platillo: ${dish.name_es || dish.name_en}. Ingredientes visibles: ${ingredients}. Dieta: ${diet}. Estilo: plato en fondo blanco limpio, luz natural, presentación simple de meal prep, sin texto, sin manos, sin personas, sin marcas, sin empaques. Debe verse apetitoso, realista y claro.`
        : `Realistic square photo of homemade Mexican-style food for a diet app. Dish: ${dish.name_en || dish.name_es}. Visible ingredients: ${ingredients}. Diet: ${diet}. Style: clean white background, natural light, simple meal-prep presentation, no text, no hands, no people, no brands, no packaging. It should look appetizing, realistic and clear.`;

    const generated = await generateImage(apiKey, prompt);

    if (!generated.base64) {
      return NextResponse.json({
        error:
          'No se pudo generar la imagen con Gemini/Imagen. Revisa si tu API key tiene acceso a generación de imágenes.',
        attempts: generated.attempts,
      });
    }

    const buffer = Buffer.from(generated.base64, 'base64');

    const { error: uploadError } = await supabase.storage
      .from('dish-images')
      .upload(path, buffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({
        error: 'La imagen se generó pero no se pudo guardar en Supabase Storage.',
        details: uploadError.message,
      });
    }

    return NextResponse.json({
      imageUrl: publicUrlFor(path),
      cached: false,
      model: generated.model,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Error interno generando imagen.',
      details: error?.message || String(error),
    });
  }
}
