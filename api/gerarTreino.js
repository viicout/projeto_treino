// api/gerarTreino.js
import express from 'express';
import fetch from 'node-fetch'; // caso precise
const router = express.Router();

// Endpoint POST /api/gerarTreino
router.post('/', async (req, res) => {
  try {
    const { diasTreino = 3, objetivo, nivel, tipoTreino, nome, foco = [], tempo = 45, limitacoes } = req.body;

    // Transformar foco em string, separando por vírgula
    const focoStr = Array.isArray(foco) ? foco.join(', ') : foco;

    // Prompt detalhado para IA
    const prompt = `
Gere um plano de treino para ${diasTreino} dias baseado nos dados abaixo:
- Objetivo: ${objetivo}
- Tipo de treino: ${tipoTreino}
- Nível: ${nivel}
- Tempo por sessão: ${tempo} minutos
- Foco: ${focoStr}
- Limitações: ${limitacoes || 'Nenhuma'}

Cada dia deve ter um nome (Dia 1, Dia 2, ...) e incluir:
- mobilidade: 2 a 3 exercícios
- aquecimento: 2 a 3 exercícios
- treino principal: 4 a 6 exercícios com séries e repetições
- alongamento: 2 a 3 exercícios

Retorne apenas **JSON estruturado** no seguinte formato:

[
  {
    "dayName": "Dia 1",
    "mobility": ["ex1", "ex2"],
    "warmup": ["ex1", "ex2"],
    "main": [{"name":"ex1","sets":"3","reps":"10"}, ...],
    "stretch": ["ex1","ex2"]
  },
  ...
]

Não inclua nenhum texto fora do JSON.
`;

    // Import dinâmico do Gemini
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    // Chamada para gerar o texto
    const response = await model.generateText({ prompt });
    const text = response.output?.[0]?.content?.[0]?.text;

    if (!text) return res.status(500).json({ erro: true, mensagem: 'IA não retornou conteúdo' });

    // Parse JSON retornado pela IA
    let program;
    try {
      program = JSON.parse(text);
    } catch (e) {
      console.error('Erro ao parsear JSON da IA:', text, e);
      return res.status(500).json({ erro: true, mensagem: 'Erro ao parsear resposta da IA' });
    }

    res.json({ program });
  } catch (err) {
    console.error('Erro gerarTreino:', err);
    res.status(500).json({ erro: true, mensagem: 'API retornou status 500' });
  }
});

export default router;
