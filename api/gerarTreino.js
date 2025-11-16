// api/gerarTreino.js
import express from 'express';
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express.Router();

app.post('/api/gerarTreino', async (req, res) => {
  try {
    const payload = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ erro: true, mensagem: 'Chave da API não configurada.' });
    }

    const client = new GoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const model = client.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // Cria prompt detalhado
    const prompt = `
Gere um treino personalizado em formato JSON. 
O usuário enviou: ${JSON.stringify(payload)}.
O JSON deve ter a estrutura:

{
  "program": [
    {
      "dayName": "Dia 1",
      "mobility": ["..."],
      "warmup": ["..."],
      "main": [
        { "name": "...", "sets": "...", "reps": "..." }
      ],
      "stretch": ["..."]
    }
  ]
}
Sem texto extra, apenas JSON válido.
`;

    const response = await model.chat({
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    // O retorno do Gemini vem em response.output[0].content[0].text
    let outputText = '';
    if (response?.output?.length > 0 && response.output[0]?.content?.length > 0) {
      outputText = response.output[0].content[0].text;
    }

    // Tenta parsear JSON
    let treinoJson;
    try {
      treinoJson = JSON.parse(outputText);
    } catch (err) {
      return res.status(500).json({ erro: true, mensagem: 'Falha ao parsear JSON da IA', detalhe: err.message, raw: outputText });
    }

    res.json(treinoJson);

  } catch (err) {
    console.error('Erro gerarTreino:', err);
    res.status(500).json({ erro: true, mensagem: err.message || err.toString() });
  }
});

// Exporta o router
app.use(app);
