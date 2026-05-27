import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS })
  }

  const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY")
  if (!GROQ_API_KEY) {
    return new Response(JSON.stringify({ error: "GROQ_API_KEY no configurada" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...CORS },
    })
  }

  const m = await req.json()

  const lines = [
    `Material: ${m.name}`,
    `Categoría: ${m.category}`,
    m.origin ? `Origen: ${m.origin}` : null,
    m.tactile?.length ? `Propiedades táctiles: ${m.tactile.join(", ")}` : null,
    `Comportamiento térmico: ${m.thermal}`,
    m.emotions?.length ? `Emociones que evoca: ${m.emotions.join(", ")}` : null,
    `Durabilidad: ${m.durability}`,
    m.spatial?.length ? `Usos espaciales: ${m.spatial.join(", ")}` : null,
    m.composicionPrincipal ? `Composición: ${m.composicionPrincipal}` : null,
    m.texturaVisual ? `Textura visual: ${m.texturaVisual}` : null,
    m.comportamientoLuz ? `Comportamiento con la luz: ${m.comportamientoLuz}` : null,
    m.keywords?.length ? `Vocabulario clave: ${m.keywords.join(", ")}` : null,
  ].filter(Boolean).join("\n")

  const prompt = `Eres un redactor editorial especializado en materiales para arquitectura y diseño de interiores. Tu escritura es precisa, poética y arquitectónica, con un tono curatorial y reflexivo.

Escribe una descripción editorial de 80 a 120 palabras sobre el siguiente material. Usa un lenguaje sensorial y espacial. No menciones precios, marcas comerciales ni datos de contacto.

${lines}`

  const groqRes = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.72,
      max_tokens: 280,
    }),
  })

  if (!groqRes.ok) {
    const err = await groqRes.text()
    return new Response(JSON.stringify({ error: err }), {
      status: 502,
      headers: { "Content-Type": "application/json", ...CORS },
    })
  }

  const data = await groqRes.json()
  const description = data.choices?.[0]?.message?.content?.trim() ?? ""

  return new Response(JSON.stringify({ description }), {
    headers: { "Content-Type": "application/json", ...CORS },
  })
})
