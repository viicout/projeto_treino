// js/aiModel.js
export async function runAI(payload) {
  try {
    const resp = await fetch("/api/gerarTreino", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`API erro ${resp.status}: ${text}`);
    }

    const json = await resp.json();
    return json;
  } catch (err) {
    console.error("runAI error:", err);
    return { erro: true, mensagem: String(err.message || err) };
  }
}
