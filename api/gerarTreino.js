// api/gerarTreino.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint POST para gerar treino
app.post('/api/gerarTreino', async (req, res) => {
  try {
    const data = req.body;
    const { diasTreino, objetivo, nivel, tipoTreino, nome, foco, tempo, limitacoes } = data;

    // Cria cliente Gemini
    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    // Cria prompt detalhado para IA gerar JSON
    const prompt = `
Você é um assistente de treino. Gere um JSON estruturado com ${diasTreino} dias de treino distintos.
O usuário se chama "${nome}", objetivo: "${objetivo}", nível: "${nivel}", tipo: "${tipoTreino}", tempo: ${tempo} min por treino, foco: ${foco.join(', ')}, limitações: "${limitacoes}".
JSON deve ter estrutura:
{
  "program": [
    { "dia": 1, "treinos": [ { "musculo": "", "exercicio": "", "tipo": "", "series": "", "repeticoes": "" }, ... ] },
    { "dia": 2, "treinos": [ ... ] },
    ...
  ]
}
Não inclua explicações, apenas o JSON válido.
    `;

    const response = await model.generateText({
      prompt,
      temperature: 0.7,
      maxOutputTokens: 1000
    });

    let aiOutput = response?.content?.[0]?.text || '';
    
    // Tenta parsear JSON
    let program = [];
    try {
      program = JSON.parse(aiOutput).program;
    } catch (e) {
      console.error('Erro parseando JSON da IA:', e);
      return res.json({ erro: true, mensagem: 'Erro ao interpretar resposta da IA.' });
    }

    return res.json({ program });

  } catch (err) {
    console.error('Erro gerarTreino:', err);
    res.json({ erro: true, mensagem: err.message || 'Erro desconhecido.' });
  }
});

// Se estiver rodando localmente
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
