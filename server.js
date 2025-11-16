// server.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint que recebe os dados do front-end e chama a IA
app.post('/api/gerarTreino', async (req, res) => {
  const payload = req.body;

  // Monta a prompt detalhada para a IA
  const prompt = `
Você é um treinador de fitness. Gere um plano de treino em JSON
com base nos seguintes dados:
Nome: ${payload.nome}
Idade: ${payload.age}
Peso: ${payload.weight}
Objetivo: ${payload.objetivo} 
Nível: ${payload.nivel} 
Tipo de treino: ${payload.tipoTreino} 
Foco: ${payload.foco?.join(', ')} 
Dias de treino: ${payload.diasTreino} 
Tempo de treino (minutos por sessão): ${payload.tempo}
Limitações: ${payload.limitacoes}

O JSON deve ter o formato:
{
  "program": [
    {
      "dayName": "Dia 1",
      "mobility": ["..."],
      "warmup": ["..."],
      "main": [{"name":"exercicio","sets":3,"reps":"12"}],
      "stretch": ["..."]
    }
  ]
}
Não envie texto fora do JSON.
`;

  try {
    const aiResp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1:generateText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        prompt: prompt,
        temperature: 0.7,
        maxOutputTokens: 800
      })
    });

    if (!aiResp.ok) {
      const text = await aiResp.text();
      return res.status(aiResp.status).send({ erro: true, mensagem: text });
    }

    const json = await aiResp.json();
    // Retorna para o front-end
    res.json(json);

  } catch (err) {
    console.error('Erro ao chamar IA:', err);
    res.status(500).json({ erro: true, mensagem: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
