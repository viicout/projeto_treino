// server.js — backend local para gerar treinos

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getExercises } = require('./exerciseDB.js');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor rodando!');
});

// Rota para gerar treino
app.post('/api/gerarTreino', (req, res) => {
  try {
    const payload = req.body;

    const {
      diasTreino = 3,
      objetivo = 'hipertrofia',
      nivel = 'auto',
      tipoTreino = 'musculacao',
      foco = [],
      tempo = 45,
      nome = 'Usuário',
      limitacoes = ''
    } = payload;

    const exDB = getExercises();
    const treino = [];

    for (let i = 0; i < diasTreino; i++) {
      const dayName = `Dia ${i + 1}`;
      const main = [];

      // Escolher exercícios aleatórios de cada foco
      foco.forEach(musculo => {
        const grupo = exDB[tipoTreino]?.[musculo] || [];
        if (grupo.length > 0) {
          const ex = grupo[Math.floor(Math.random() * grupo.length)];
          main.push({ name: ex.name, sets: 3, reps: 10 });
        }
      });

      treino.push({
        dayName,
        mobility: exDB.mobility.slice(0, 2),
        warmup: exDB.warmups.slice(0, 2),
        main,
        stretch: exDB.stretching.slice(0, 2)
      });
    }

    res.json({ program: treino });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: true, mensagem: 'Erro ao gerar treino local' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
