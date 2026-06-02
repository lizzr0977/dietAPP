import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

function safeJson(text: string) {
  const cleaned = text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const first = cleaned.indexOf('{');
  const last = cleaned.lastIndexOf('}');
  if (first >= 0 && last > first) {
    return JSON.parse(cleaned.slice(first, last + 1));
  }
  return JSON.parse(cleaned);
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Falta GEMINI_API_KEY en Vercel Environment Variables.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { lang = 'es', profile, dish, baseRecipe, instruction } = body;

    const prompt = `
Eres chef mexicano y asistente de meal prep para bajar de peso.
Responde SOLO JSON válido. Sin markdown.

Idioma de respuesta: ${lang === 'en' ? 'English' : 'Español'}.

Perfil:
${JSON.stringify(profile || {}, null, 2)}

Platillo:
${JSON.stringify(dish || {}, null, 2)}

Receta base actual:
${JSON.stringify(baseRecipe || {}, null, 2)}

Instrucción:
${instruction || ''}

Reglas obligatorias:
- Que sea receta mexicana o estilo mexicano cuando tenga sentido.
- No digas “caldo comprado” si puede prepararse con agua, carne/hueso, sal y cocción.
- Pasos reales, claros y específicos. No uses frases genéricas como “cocina hasta listo”.
- Incluye tiempos aproximados por paso.
- Incluye tips para llevar al trabajo, tupper, enfriar, recalentar y avanzar rápido mientras algo se cocina.
- Respeta el tipo de dieta y restricciones del perfil.
- No agregues ingredientes que contradigan la dieta.
- Si agregas ingredientes opcionales, márcalos como opcionales.

Devuelve exactamente este JSON:
{
  "ingredients": ["..."],
  "utensils": ["..."],
  "steps": ["..."],
  "tips": ["..."],
  "notes": "..."
}
`;

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
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
          maxOutputTokens: 2200,
          responseMimeType: 'application/json',
        },
      }),
    });

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      return NextResponse.json(
        { error: data?.error?.message || 'Error llamando Gemini.' },
        { status: 500 }
      );
    }

    const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('\n') || '';
    const recipe = safeJson(text);

    if (!Array.isArray(recipe.ingredients) || !Array.isArray(recipe.steps)) {
      throw new Error('Gemini respondió sin formato de receta válido.');
    }

    return NextResponse.json({ recipe });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Error inesperado generando receta con IA.' },
      { status: 500 }
    );
  }
}
