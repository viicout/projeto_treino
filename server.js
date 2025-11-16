// server.js
import express from 'express';
import fetch from 'node-fetch'; // npm install node-fetch

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // variável de ambiente

app.post('/api/gerarTreino', async (req, res) => {
  const payload = req.body;

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1:generateText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        prompt: `Gere um treino baseado nesses dados: ${JSON.stringify(payload)}`,
        temperature: 0.7,
        maxOutputTokens: 500
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: true, mensagem: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
