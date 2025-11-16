// server.js
import express from 'express';
import fetch from 'node-fetch'; // ou built-in fetch no Node 18+
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 3000;

// substitua com sua chave de API do Google Generative AI
const API_KEY = 'SUA_CHAVE_DE_API';

app.post('/api/gerarTreino', async (req, res) => {
  try {
    const payload = req.body;

    // montar prompt para IA
    const prompt = `
      Gere um plano de treino de ${payload.diasTreino} dias
      para ${payload.nome || 'usuário'}.
      Objetivo: ${payload.objetivo}
      Tipo de treino: ${payload.tipoTreino}
      Nível: ${payload.nivel}
      Foco: ${payload.foco.join(', ') || 'geral'}
      Tempo por sessão: ${payload.tempo} minutos
      Limitações: ${payload.limitacoes || 'nenhuma'}
      Retorne em JSON no formato:
      {
        "program": [
          {
            "dayName": "Dia 1",
            "mobility": ["..."],
            "warmup": ["..."],
            "main": [{"name":"...", "sets":3, "reps":"10"}],
            "stretch": ["..."]
          }
        ]
      }
    `;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1:generateText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        temperature: 0.7,
        maxOutputTokens: 1000
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send({ erro: true, mensagem: text });
    }

    const data = await response.json();
    // A IA geralmente retorna texto em data.candidates[0].output
    let treinoJson;
    try {
      treinoJson = JSON.parse(data.candidates[0].output);
    } catch {
      return res.status(500).send({ erro: true, mensagem: 'Erro ao interpretar JSON da IA' });
    }

    res.json(treinoJson);

  } catch (err) {
    console.error(err);
    res.status(500).send({ erro: true, mensagem: String(err) });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
