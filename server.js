// server.js — backend simples Node.js + Express para gerar treinos
import express from "express";
import cors from "cors";
import { getExercises } from "./exerciseDB.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// rota teste
app.get("/", (req, res) => res.send("Servidor funcionando"));

// rota para gerar treino
app.post("/api/gerarTreino", (req, res) => {
  try {
    const { diasTreino = 3, objetivo = "hipertrofia", tipoTreino = "musculacao", foco = [], tempo = 45 } = req.body;
    const exercisesDB = getExercises();

    const program = [];

    for (let i = 0; i < diasTreino; i++) {
      const day = {
        dayName: `Dia ${i + 1}`,
        mobility: exercisesDB.mobility,
        warmup: exercisesDB.warmups,
        main: [],
        stretch: exercisesDB.stretching
      };

      // adicionar exercícios principais conforme tipo e foco
      foco.forEach(f => {
        const list = exercisesDB[tipoTreino]?.[f] || [];
        if (list.length) {
          // pegar 2-3 exercícios randomicamente
          const shuffled = list.sort(() => 0.5 - Math.random()).slice(0, 2);
          day.main.push(...shuffled);
        }
      });

      program.push(day);
    }

    res.json({ program });
  } catch (err) {
    console.error("Erro API /gerarTreino:", err);
    res.status(500).json({ erro: true, mensagem: "Falha ao gerar treino" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
