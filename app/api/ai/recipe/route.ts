import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function cleanText(text: string) {
  return String(text || '')
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();
}

function extractJson(text: string) {
  const cleaned = cleanText(text);
  try {
    return JSON.parse(cleaned);
  } catch {}

  const first = cleaned.indexOf('{');
  const last = cleaned.lastIndexOf('}');
  if (first >= 0 && last > first) {
    try {
      return JSON.parse(cleaned.slice(first, last + 1));
    } catch {}
  }

  return null;
}

function getGeminiText(data: any) {
  const parts = data?.candidates?.[0]?.content?.parts || [];
  return parts
    .map((part: any) => (typeof part?.text === 'string' ? part.text : ''))
    .filter(Boolean)
    .join('\n')
    .trim();
}

async function callGemini(apiKey: string, prompt: string, model: string) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=` +
    encodeURIComponent(apiKey);

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.75,
        topP: 0.9,
        maxOutputTokens: 3000,
      },
    }),
  });

  const raw = await response.text();
  let data: any = null;

  try {
    data = JSON.parse(raw);
  } catch {}

  return {
    ok: response.ok,
    status: response.status,
    raw,
    data,
    text: data ? getGeminiText(data) : '',
    model,
  };
}

function fallbackRecipeFromText(text: string, lang: 'es' | 'en') {
  const clean = cleanText(text);
  return {
    title: lang === 'es' ? 'Receta mejorada con IA' : 'AI improved recipe',
    ingredients: [],
    utensils: [],
    steps: clean ? clean.split('\n').filter(Boolean) : [],
    tips: [],
    diet_notes: '',
    shopping_items: [],
    raw_text: clean,
  };
}

function normalizeRecipe(obj: any, text: string, lang: 'es' | 'en') {
  if (!obj || typeof obj !== 'object') return fallbackRecipeFromText(text, lang);

  const recipe = {
    title: typeof obj.title === 'string' ? obj.title : (lang === 'es' ? 'Receta mejorada con IA' : 'AI improved recipe'),
    ingredients: Array.isArray(obj.ingredients) ? obj.ingredients.map(String).filter(Boolean) : [],
    utensils: Array.isArray(obj.utensils) ? obj.utensils.map(String).filter(Boolean) : [],
    steps: Array.isArray(obj.steps) ? obj.steps.map(String).filter(Boolean) : [],
    tips: Array.isArray(obj.tips) ? obj.tips.map(String).filter(Boolean) : [],
    diet_notes: typeof obj.diet_notes === 'string' ? obj.diet_notes : '',
    shopping_items: Array.isArray(obj.shopping_items)
      ? obj.shopping_items
          .map((x: any) => ({
            name: String(x?.name || '').trim(),
            amount: Number(x?.amount || 1),
            unit: String(x?.unit || 'pieza').trim(),
          }))
          .filter((x: any) => x.name)
      : [],
    raw_text: cleanText(text),
  };

  if (!recipe.steps.length && recipe.raw_text) {
    recipe.steps = recipe.raw_text.split('\n').filter(Boolean);
  }

  return recipe;
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        ok: false,
        error: 'missing_api_key',
        result: 'Falta GEMINI_API_KEY en Vercel. Agrega la variable y haz redeploy.',
      });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({
        ok: false,
        error: 'missing_body',
        result: 'No se recibió información de la receta.',
      });
    }

    const lang: 'es' | 'en' = body.lang === 'en' ? 'en' : 'es';
    const profile = body.profile || {};
    const dish = body.dish || {};
    const recipe = body.recipe || {};

    const prompt =
      lang === 'es'
        ? `
Eres un chef mexicano experto en meal prep y nutrición práctica para una app llamada DietApp.

QUIERO UNA RECETA COMPLETA, NO SOLO INGREDIENTES.

Devuelve EXCLUSIVAMENTE un JSON válido. No uses markdown. No uses texto fuera del JSON.

La receta debe:
- Ser mexicana o estilo mexicano cuando sea posible.
- Ser real, clara y paso a paso.
- Respetar la dieta del perfil.
- Respetar alimentos omitidos y alimentos preferidos.
- Si el perfil es carnívoro, no metas tortillas, arroz, frijoles, azúcar ni verduras salvo que el perfil lo permita.
- Si el perfil es vegetariano o vegano, no uses carne.
- Si aparece "caldo", NO pongas "comprar caldo". Pon ingredientes reales como agua, sal, carne/hueso opcional o verduras permitidas.
- Dar tiempos aproximados y nivel de fuego.
- Incluir tips para tupper, trabajo, recalentar o comer frío.
- Incluir shopping_items coherentes con los ingredientes nuevos para que la app pueda actualizar el mandado.
- No agregues ingredientes caros o raros si no hacen falta.

Formato JSON obligatorio:
{
  "title": "Nombre de la receta",
  "ingredients": ["ingrediente con cantidad clara", "..."],
  "utensils": ["utensilio", "..."],
  "steps": ["paso 1 claro con tiempo/fuego", "paso 2", "..."],
  "tips": ["tip práctico", "..."],
  "diet_notes": "nota breve de dieta",
  "shopping_items": [
    { "name": "Huevos", "amount": 2, "unit": "piezas" },
    { "name": "Carne molida", "amount": 200, "unit": "g" }
  ]
}

PERFIL:
${JSON.stringify(profile, null, 2)}

PLATILLO ORIGINAL:
${JSON.stringify(dish, null, 2)}

RECETA ACTUAL:
${JSON.stringify(recipe, null, 2)}
`
        : `
You are a Mexican meal-prep chef and practical nutrition advisor for an app called DietApp.

I NEED A FULL RECIPE, NOT JUST INGREDIENTS.

Return ONLY valid JSON. No markdown. No text outside JSON.

The recipe must:
- Be Mexican or Mexican-style when possible.
- Be real, clear and step-by-step.
- Respect the profile diet.
- Respect avoided foods and preferred foods.
- If carnivore, do not add tortillas, rice, beans, sugar or vegetables unless the profile allows it.
- If vegetarian or vegan, do not use meat.
- If "broth" appears, do NOT write "buy broth". Use real ingredients like water, salt, meat/bone optional or allowed vegetables.
- Give approximate times and heat level.
- Include container, work, reheating or cold-eating tips.
- Include shopping_items matching the new ingredients so the grocery list can update.
- Avoid expensive or weird ingredients unless necessary.

Required JSON format:
{
  "title": "Recipe name",
  "ingredients": ["ingredient with clear amount", "..."],
  "utensils": ["utensil", "..."],
  "steps": ["clear step 1 with time/heat", "step 2", "..."],
  "tips": ["practical tip", "..."],
  "diet_notes": "short diet note",
  "shopping_items": [
    { "name": "Eggs", "amount": 2, "unit": "pieces" },
    { "name": "Ground beef", "amount": 200, "unit": "g" }
  ]
}

PROFILE:
${JSON.stringify(profile, null, 2)}

ORIGINAL DISH:
${JSON.stringify(dish, null, 2)}

CURRENT RECIPE:
${JSON.stringify(recipe, null, 2)}
`;

    const models = ['gemini-2.5-flash', 'gemini-2.0-flash'];
    const attempts: any[] = [];

    for (const model of models) {
      const attempt = await callGemini(apiKey, prompt, model);
      attempts.push({
        model: attempt.model,
        ok: attempt.ok,
        status: attempt.status,
        error: attempt.data?.error || null,
        rawPreview: attempt.raw?.slice(0, 800) || '',
      });

      if (attempt.ok && attempt.text) {
        const parsed = extractJson(attempt.text);
        const normalized = normalizeRecipe(parsed, attempt.text, lang);

        return NextResponse.json({
          ok: true,
          model,
          recipe: normalized,
          result: normalized.raw_text,
        });
      }
    }

    return NextResponse.json({
      ok: false,
      error: 'gemini_error',
      result:
        'Gemini respondió con error. Revisa que GEMINI_API_KEY esté activa y que el deploy ya tomó la variable.',
      attempts,
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: 'internal_error',
      result: 'Error interno generando receta con IA: ' + (error?.message || String(error)),
    });
  }
}
