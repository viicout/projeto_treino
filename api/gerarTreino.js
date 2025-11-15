// /api/gerarTreino.js (Next.js API Route ou Express)
export default async function handler(req, res) {
  console.log('--- /api/gerarTreino chamado ---');
  console.log('Método:', req.method);
  console.log('Body recebido:', req.body);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const dadosTreino = req.body;

  // Validação simples dos dados recebidos
  if (!dadosTreino || Object.keys(dadosTreino).length === 0) {
    console.warn('Body vazio ou inválido');
    return res.status(400).json({ error: 'Body inválido ou vazio' });
  }

  try {
    console.log('Enviando dados para a IA:', JSON.stringify(dadosTreino));

    // Aqui você chama sua função que interage com a IA
    const respostaAI = await runAI(dadosTreino);

    console.log('Resposta da IA recebida:', respostaAI);

    return res.status(200).json(respostaAI);
  } catch (error) {
    console.error('Erro ao gerar treino:', error);
    console.error('Stack trace:', error.stack);

    return res.status(500).json({
      erro: 'Falha ao gerar treino',
      detalhe: error.message,
    });
  }
}
