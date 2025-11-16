import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = client.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: true, mensagem: 'Método não permitido' });
  }

  try {
    const payload = req.body;
    console.log('Payload recebido:', payload);

    // Criar prompt detalhado para a IA
    const prompt = `
      Gere um plano de treino para ${payload.diasTreino} dias
      Objetivo: ${payload.objetivo}
      Tipo de treino: ${payload.tipoTreino}
      Nível: ${payload.nivel}
      Tempo por sessão: ${payload.tempo} minutos
      Foco: ${payload.foco.join(', ')}
      Limitações: ${payload.limitacoes || 'Nenhuma'}
      
      Retorne um JSON estruturado com:
      [
        { "dayName": "Dia 1", "mobility": [], "warmup": [], "main": [], "stretch": [] },
        ...
      ]
      Não retorne texto adicional fora do JSON.
    `;
    console.log('Prompt enviado à IA:', prompt);

    const response = await model.generateText({ 
      prompt,
      temperature: 0.7,
      maxOutputTokens: 800
    });

    console.log('Resposta bruta da IA:', response);

    // Tentar extrair JSON do texto da IA
    let json;
    try {
      json = JSON.parse(response.outputText || response.text || '{}');
    } catch (e) {
      console.error('Erro ao parsear JSON:', e, response);
      return res.status(500).json({ erro: true, mensagem: 'Resposta da IA não pôde ser parseada como JSON', response });
    }

    return res.status(200).json({ program: json });
  } catch (err) {
    console.error('Erro interno no handler:', err);
    return res.status(500).json({ erro: true, mensagem: 'Erro interno no servidor', detalhe: String(err) });
  }
}
