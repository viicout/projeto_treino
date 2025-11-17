// Arquivo: js/cross_extras.js
// Mobilidade / aquecimento / alongamento para CrossFit

(function () {
  function pickRandom(arr, n) {
    const out = [];
    const copy = [...arr];
    while (out.length < n && copy.length) {
      const i = Math.floor(Math.random() * copy.length);
      out.push(copy.splice(i, 1)[0]);
    }
    return out;
  }

  const MOBILIDADES = [
    "Torácica dinâmica - 10x",
    "Quadril - 10x por lado",
    "Tornozelo - círculos 10x",
    "Ombro - banda 12x",
    "Escápula - 12x"
  ];

  const AQUECIMENTOS = [
    "Jumping jacks - 60s",
    "Corrida leve - 2 min",
    "Air squat - 20 reps",
    "Burpee leve - 8 reps",
    "Kettlebell swing leve (ou swing corporal) - 12 reps"
  ];

  const ALONGAMENTOS = [
    "Lombar - 30s",
    "Posterior de coxa - 30s por perna",
    "Peito - 30s",
    "Ombro - 30s cada lado",
    "Quadríceps - 30s por perna"
  ];

  window.getCrossExtras = function (nivel) {
    return {
      mobilidade: pickRandom(MOBILIDADES, 3),
      aquecimento: pickRandom(AQUECIMENTOS, 3),
      alongamento: pickRandom(ALONGAMENTOS, 3)
    };
  };
})();
