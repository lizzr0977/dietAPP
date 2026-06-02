import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function cleanText(text: string) {
  return String(text || '')
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();
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
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.55,
        topP: 0.9,
        maxOutputTokens: 2200,
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

  return {
    ok: response.ok,
    status: response.status,
    raw,
    data,
    text: data ? getGeminiText(data) : '',
    model,
  };
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          result:
            'Falta GEMINI_API_KEY en Vercel. Ve a Settings > Environment Variables, agrega GEMINI_API_KEY y haz redeploy.',
          error: 'missing_api_key',
        },
        { status: 200 }
      );
    }

    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        {
          result: 'No se recibió información de la receta.',
          error: 'missing_body',
        },
        { status: 200 }
      );
    }

    const lang = body.lang === 'en' ? 'en' : 'es';
    const profile = body.profile || {};
    const dish = body.dish || {};
    const recipe = body.recipe || {};

    const prompt =
      lang === 'es'
        ? `
Eres un chef mexicano experto en meal prep para una app llamada DietApp.

OBJETIVO:
Convierte el platillo en una receta mexicana real, clara, práctica y paso a paso.

REGLAS:
- Responde SOLO en español.
- Devuelve TEXTO PLANO, no JSON y no markdown.
- No uses frases genéricas como "cocina hasta que esté listo".
- Da tiempos aproximados, nivel de fuego, orden de preparación y tips de tupper/trabajo.
- Si aparece "caldo", NO digas que compre caldo. Explica cómo hacerlo simple con agua, sal, carne/hueso/verduras si aplica.
- Respeta la dieta del perfil.
- Respeta alimentos omitidos y preferidos.
- Si la dieta es carnívora, evita tortillas, arroz, frijoles o verduras salvo que el perfil lo permita.
- Si la dieta es vegetariana o vegana, no uses carne.
- La receta debe sonar como comida casera mexicana para alguien en USA.
- Si es para trabajo, incluye cómo enfriar, guardar, recalentar o comer frío.

FORMATO EXACTO:
Título:
Ingredientes:
Utensilios:
Paso a paso:
Tips para trabajo/meal prep:
Notas de dieta:

PERFIL:
${JSON.stringify(profile, null, 2)}

PLATILLO:
${JSON.stringify(dish, null, 2)}

RECETA ACTUAL:
${JSON.stringify(recipe, null, 2)}
`
        : `
You are a Mexican meal-prep chef for an app called DietApp.

GOAL:
Turn this dish into a real, clear, practical, step-by-step Mexican-style recipe.

RULES:
- Respond ONLY in English.
- Return PLAIN TEXT, no JSON and no markdown.
- Do not use generic phrases like "cook until done".
- Give approximate times, heat level, preparation order and work/container tips.
- If "broth" appears, do NOT say to buy broth. Explain a simple homemade version with water, salt, meat/bone/vegetables if applicable.
- Respect the profile diet.
- Respect avoided and preferred foods.
- If carnivore, avoid tortillas, rice, beans or vegetables unless the profile allows it.
- If vegetarian or vegan, do not use meat.
- The recipe should feel like homemade Mexican food for someone in the USA.
- If for work, include cooling, packing, reheating or cold-eating tips.

EXACT FORMAT:
Title:
Ingredients:
Utensils:
Step by step:
Work/meal-prep tips:
Diet notes:

PROFILE:
${JSON.stringify(profile, null, 2)}

DISH:
${JSON.stringify(dish, null, 2)}

CURRENT RECIPE:
${JSON.stringify(recipe, null, 2)}
`;

    // Modelo principal actual en docs de Gemini. Si falla por disponibilidad,
    // probamos gemini-2.0-flash como fallback.
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash'];

    const attempts = [];
    for (const model of modelsToTry) {
      const attempt = await callGemini(apiKey, prompt, model);
      attempts.push({
        model: attempt.model,
        ok: attempt.ok,
        status: attempt.status,
        error: attempt.data?.error || null,
        rawPreview: attempt.raw?.slice(0, 800) || '',
      });

      if (attempt.ok && attempt.text) {
        return NextResponse.json({
          result: cleanText(attempt.text),
          model,
        });
      }
    }

    const last = attempts[attempts.length - 1];

    return NextResponse.json(
      {
        result:
          'Gemini respondió con error. Revisa que tu GEMINI_API_KEY esté bien copiada en Vercel y que la API key esté activa en Google AI Studio. Detalle técnico: ' +
          JSON.stringify(last?.error || last?.rawPreview || attempts),
        error: 'gemini_error',
        attempts,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        result:
          'Error interno generando receta con IA: ' +
          (error?.message || String(error)),
        error: 'internal_error',
      },
      { status: 200 }
    );
  }
}
