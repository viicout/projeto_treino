// api/gerarTreino.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Endpoint para gerar treino
export default async function gerarTreino(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ erro: true, mensagem: "Método não permitido" });
    }

    const body = req.body || {};
    console.log("Payload recebido:", body);

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ erro: true, mensagem: "GEMINI_API_KEY não definida" });
    }

    const client = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // Monta prompt detalhado
    const prompt = `
Gere um treino personalizado em JSON, considerando:
- Dias de treino: ${body.diasTreino || 3}
- Objetivo: ${body.objetivo || "hipertrofia"}
- Tipo de treino: ${body.tipoTreino || "musculacao"}
- Foco: ${body.foco || []}
- Tempo de treino: ${body.tempo || 45} minutos
- Limitações: ${body.limitacoes || ""}
Formato JSON:
{
  "program": [
    {
      "dayName": "Dia 1",
      "mobility": [],
      "warmup": [],
      "main": [],
      "stretch": []
    }
  ]
}
Não escreva texto fora do JSON.
`;

    console.log("Prompt enviado à IA:", prompt);

    // Chamada à IA
    const response = await model.generateText({
      prompt,
      maxOutputTokens: 1000
    });

    console.log("Retorno bruto da IA:", response);

    // Retorna texto bruto para debug (não faz parse JSON ainda)
    res.status(200).json({ textoBruto: response.outputText || response.text || "" });

  } catch (err) {
    console.error("Erro gerando treino:", err);
    res.status(500).json({ erro: true, mensagem: String(err) });
  }
}
