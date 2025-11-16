// api/gerarTreino.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function gerarTreino(req, res) {
  try {
    // Cria o client usando a chave do Vercel (ou do .env)
    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Seleciona o modelo
    const model = client.getGenerativeModel({
      model: "gemini-1.5-flash-latest"
    });

    // Prompt baseado nos dados do front-end
    const prompt = `
      Gere um programa de treino em JSON para um usuário com as seguintes informações:
      Nome: ${req.body.nome}
      Idade: ${req.body.idade || '-'}
      Peso: ${req.body.peso || '-'}
      Objetivo: ${req.body.objetivo}
      Tipo de treino: ${req.body.tipoTreino}
      Dias de treino: ${req.body.diasTreino}
      Foco: ${req.body.foco || []}
      Tempo por sessão: ${req.body.tempo || 45} minutos
      Limitações: ${req.body.limitacoes || 'nenhuma'}
      Retorne um JSON estruturado com "program": [ { dayName, mobility, warmup, main, stretch } ].
    `;

    // Chama a IA para gerar o treino
    const result = await model.generateText({ prompt });

    // Retorna o JSON
    res.json(JSON.parse(result.text));
  } catch (err) {
    console.error("Erro gerarTreino:", err);
    res.status(500).json({ erro: true, mensagem: err.message || String(err) });
  }
}
