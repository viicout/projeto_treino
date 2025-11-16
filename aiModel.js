// aiModel.js — Mock local atualizado para gerar treinos
import { getExercises } from './exerciseDB.js';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function runAI(payload) {
  try {
    const { tipoTreino, foco, diasTreino } = payload;
    const db = getExercises();
    const tipo = tipoTreino === 'calistenia' ? 'calistenia' : 'musculacao';

    const program = [];

    for (let d = 0; d < diasTreino; d++) {
      // se não houver foco marcado, usar todos os grupos musculares disponíveis
      const dayExercises = (foco && foco.length > 0) ? foco : Object.keys(db[tipo]);

      const main = [];

      dayExercises.forEach(muscle => {
        const exList = db[tipo][muscle] || [];
        if (!exList.length) return;
        // pegar 1 ou 2 exercícios aleatórios
        const count = Math.min(2, exList.length);
        for (let i = 0; i < count; i++) {
          const ex = exList[randomInt(0, exList.length - 1)];
          main.push({
            name: ex.name,
            sets: randomInt(2, 4),
            reps: `${randomInt(8, 15)}`
          });
        }
      });

      // se main ficou vazio, pega 1 exercício qualquer
      if (!main.length) {
        const allGroups = Object.keys(db[tipo]);
        const group = allGroups[randomInt(0, allGroups.length - 1)];
        const exList = db[tipo][group];
        const ex = exList[randomInt(0, exList.length - 1)];
        main.push({ name: ex.name, sets: 3, reps: '10' });
      }

      program.push({
        dayName: `Dia ${d + 1}`,
        mobility: db.mobility.slice(0, 2),
        warmup: db.warmups.slice(0, 2),
        main,
        stretch: db.stretching.slice(0, 2)
      });
    }

    await new Promise(r => setTimeout(r, 500)); // simula delay IA

    return { program };

  } catch (err) {
    return { erro: true, mensagem: String(err) };
  }
}
