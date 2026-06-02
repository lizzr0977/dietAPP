import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function imagePartFromDataUrl(dataUrl: string) {
  const match = String(dataUrl || '').match(/^data:(.+?);base64,(.+)$/);
  if (!match) return null;

  return {
    inlineData: {
      mimeType: match[1],
      data: match[2],
    },
  };
}

function getText(data: any) {
  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((p: any) => (typeof p?.text === 'string' ? p.text : ''))
      .filter(Boolean)
      .join('\n')
      .trim() || ''
  );
}

async function callGemini(apiKey: string, payload: any, model: string) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=` +
    encodeURIComponent(apiKey);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const raw = await res.text();
  let data: any = null;

  try {
    data = JSON.parse(raw);
  } catch {
    data = null;
  }

  return { ok: res.ok, status: res.status, raw, data, text: data ? getText(data) : '', model };
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        result:
          'Falta GEMINI_API_KEY en Vercel. Agrega la variable y haz redeploy.',
        error: 'missing_api_key',
      });
    }

    const body = await request.json().catch(() => null);

    if (!body?.images?.length) {
      return NextResponse.json({
        result: 'No se recibió ninguna imagen del producto.',
        error: 'missing_images',
      });
    }

    const lang = body.lang === 'en' ? 'en' : 'es';
    const profile = body.profile || {};
    const imageParts = body.images
      .slice(0, 3)
      .map((img: string) => imagePartFromDataUrl(img))
      .filter(Boolean);

    if (!imageParts.length) {
      return NextResponse.json({
        result: 'No se pudo leer la imagen. Intenta tomar otra foto.',
        error: 'invalid_images',
      });
    }

    const prompt =
      lang === 'es'
        ? `
Eres un asesor de nutrición práctica para DietApp. Analiza las fotos del producto.

Responde SOLO en español, texto claro, sin JSON.

Toma en cuenta:
- Perfil/dieta/meta del usuario.
- Si el producto conviene o no para su dieta.
- Señales de alerta: azúcar, aceites, harinas, ingredientes ultraprocesados, sodio alto, calorías altas.
- Si es carnívora, vegetariana o vegana.
- Recomienda frecuencia: diario, ocasional, evitar, o solo emergencia.
- Da una calificación de 1 a 10.
- Si no puedes leer la etiqueta, dilo y pide foto más clara.

Formato:
Resultado rápido:
Calificación:
Por qué:
Ingredientes o datos que observé:
¿Se ajusta a tu dieta?:
Frecuencia recomendada:
Mejor alternativa:
Nota práctica:

PERFIL:
${JSON.stringify(profile, null, 2)}
`
        : `
You are a practical nutrition advisor for DietApp. Analyze the product photos.

Respond ONLY in English, clear plain text, no JSON.

Consider:
- User profile/diet/goal.
- Whether the product fits the diet.
- Red flags: sugar, oils, flours, ultra-processed ingredients, high sodium, high calories.
- Carnivore, vegetarian or vegan rules.
- Recommended frequency: daily, occasional, avoid, or emergency only.
- Give a 1 to 10 rating.
- If the label is not readable, say so and ask for a clearer photo.

Format:
Quick result:
Rating:
Why:
Ingredients or facts I noticed:
Does it fit your diet?:
Recommended frequency:
Better alternative:
Practical note:

PROFILE:
${JSON.stringify(profile, null, 2)}
`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }, ...imageParts],
        },
      ],
      generationConfig: {
        temperature: 0.35,
        topP: 0.85,
        maxOutputTokens: 1400,
      },
    };

    const models = ['gemini-2.5-flash', 'gemini-2.0-flash'];
    const attempts = [];

    for (const model of models) {
      const result = await callGemini(apiKey, payload, model);
      attempts.push({
        model,
        ok: result.ok,
        status: result.status,
        error: result.data?.error || null,
        rawPreview: result.raw.slice(0, 700),
      });

      if (result.ok && result.text) {
        return NextResponse.json({ result: result.text, model });
      }
    }

    return NextResponse.json({
      result:
        'Gemini no pudo analizar el producto. Revisa tu API key, cuota o intenta con una foto más clara. Detalle: ' +
        JSON.stringify(attempts[attempts.length - 1]?.error || attempts[attempts.length - 1]?.rawPreview),
      error: 'gemini_error',
      attempts,
    });
  } catch (error: any) {
    return NextResponse.json({
      result: 'Error interno analizando producto: ' + (error?.message || String(error)),
      error: 'internal_error',
    });
  }
}
