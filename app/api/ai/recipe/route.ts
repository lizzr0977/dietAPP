import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function cleanGeminiText(text: string) {
  return String(text || '')
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();
}

function extractJsonObject(text: string) {
  const cleaned = cleanGeminiText(text);

  try {
    return JSON.parse(cleaned);
  } catch {
    // Sigue abajo: a veces Gemini devuelve texto antes/después del JSON.
  }

  const first = cleaned.indexOf('{');
  const last = cleaned.lastIndexOf('}');
  if (first !== -1 && last !== -1 && last > first) {
    const possibleJson = cleaned.slice(first, last + 1);
    try {
      return JSON.parse(possibleJson);
    } catch {
      // Si el JSON viene mal cerrado o con comillas raras, no rompemos la app.
    }
  }

  return null;
}

function safeText(value: unknown) {
  return typeof value === 'string' ? value : '';
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'Falta GEMINI_API_KEY en Vercel. Agrega la variable en Settings > Environment Variables y redeploy.',
        },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: 'No se recibió información de la receta.' },
        { status: 400 }
      );
    }

    const lang = body.lang === 'en' ? 'en' : 'es';
    const profile = body.profile || {};
    const dish = body.dish || {};
    const recipe = body.recipe || {};

    const prompt =
      lang === 'es'
        ? `
Eres un chef mexicano y asesor de meal prep para una app llamada DietApp.

Tu tarea: mejorar esta receta para que sea REAL, clara, práctica y mexicana cuando sea posible.

REGLAS IMPORTANTES:
- Responde SOLO en español.
- No devuelvas markdown.
- No devuelvas JSON si no puedes cerrarlo perfectamente.
- La receta debe ser paso a paso, específica y útil.
- No uses frases genéricas como "cocina hasta que esté listo".
- Explica tiempos aproximados, fuego, orden de preparación y tips de tupper/trabajo.
- Si algo dice "caldo", NO digas que compre caldo. Explica cómo hacerlo simple con agua, sal, carne/hueso/verduras si aplica.
- Respeta la dieta del perfil.
- Respeta alimentos omitidos o preferidos si existen.
- Mantén la receta realista para una persona en Estados Unidos con comida mexicana.
- Si es carnívora, evita meter tortillas, arroz, frijoles o verduras salvo que el perfil/dieta lo permita.
- Si es vegetariana/vegana, no uses carne.
- Si es para llevar al trabajo, agrega tips de enfriar, tupper, recalentar o comer frío.

Devuelve tu respuesta en este formato de texto, sin JSON:
Título:
Ingredientes:
Utensilios:
Paso a paso:
Tips para trabajo/meal prep:
Notas de dieta:

DATOS DEL PERFIL:
${JSON.stringify(profile, null, 2)}

PLATILLO:
${JSON.stringify(dish, null, 2)}

RECETA ACTUAL:
${JSON.stringify(recipe, null, 2)}
`
        : `
You are a Mexican food chef and meal-prep advisor for an app called DietApp.

Task: improve this recipe so it is REAL, clear, practical, and Mexican-style when possible.

IMPORTANT RULES:
- Respond ONLY in English.
- Do not return markdown.
- Do not return JSON unless perfectly valid.
- The recipe must be step-by-step, specific and useful.
- Do not use generic phrases like "cook until done".
- Explain approximate timing, heat level, prep order, and work/meal-prep container tips.
- If something says "broth", do NOT say to buy broth. Explain a simple homemade version using water, salt, meat/bone/vegetables if applicable.
- Respect the profile's diet.
- Respect avoided or preferred foods if present.
- Keep the recipe realistic for someone in the US making Mexican-style food.
- If carnivore, avoid tortillas, rice, beans or vegetables unless allowed by the profile/diet.
- If vegetarian/vegan, do not use meat.
- If taking to work, add cooling, container, reheating or cold-eating tips.

Return plain text in this format, no JSON:
Title:
Ingredients:
Utensils:
Step by step:
Work/meal-prep tips:
Diet notes:

PROFILE DATA:
${JSON.stringify(profile, null, 2)}

DISH:
${JSON.stringify(dish, null, 2)}

CURRENT RECIPE:
${JSON.stringify(recipe, null, 2)}
`;

    const geminiUrl =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' +
      encodeURIComponent(apiKey);

    const geminiResponse = await fetch(geminiUrl, {
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
          temperature: 0.65,
          topP: 0.9,
          maxOutputTokens: 1800,
        },
      }),
    });

    const raw = await geminiResponse.text();

    if (!geminiResponse.ok) {
      return NextResponse.json(
        {
          error: 'Gemini respondió con error.',
          details: raw.slice(0, 1000),
        },
        { status: 500 }
      );
    }

    let parsedGemini: any = null;
    try {
      parsedGemini = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        {
          error: 'Gemini respondió algo que no fue JSON válido.',
          result:
            'No se pudo leer la respuesta de Gemini. Intenta otra vez en unos segundos.',
          raw: raw.slice(0, 1000),
        },
        { status: 200 }
      );
    }

    const text =
      parsedGemini?.candidates?.[0]?.content?.parts
        ?.map((part: any) => safeText(part?.text))
        .filter(Boolean)
        .join('\n')
        .trim() || '';

    if (!text) {
      return NextResponse.json(
        {
          error: 'Gemini no devolvió texto.',
          result:
            'Gemini no devolvió una receta. Intenta otra vez o revisa tu API key.',
        },
        { status: 200 }
      );
    }

    // Por si en el futuro Gemini devuelve JSON, lo aceptamos.
    // Pero si viene mal cerrado, no tronamos: usamos texto plano.
    const maybeJson = extractJsonObject(text);

    if (maybeJson && typeof maybeJson === 'object') {
      const result =
        maybeJson.result ||
        maybeJson.recipe ||
        maybeJson.text ||
        maybeJson.content ||
        text;

      return NextResponse.json({
        result: String(result || text),
        parsed: true,
      });
    }

    return NextResponse.json({
      result: cleanGeminiText(text),
      parsed: false,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Error interno generando receta con IA.',
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
