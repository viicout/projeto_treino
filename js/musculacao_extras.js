// Arquivo: js/musculacao_extras.js
// Fornece mobilidade / aquecimento / alongamento específicos e variados para musculação

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
    "Torácica 10x",
    "Quadril - círculos 10x por lado",
    "Tibial/tornozelo 10 rep por perna",
    "Ombro - rotações 15x",
    "Escápula slides 12x"
  ];

  const AQUECIMENTOS = [
    "Polichinelo - 60s",
    "Agachamento corporal - 15 reps",
    "Deadlift leve (mobilidade) - 10 reps",
    "Remada leve com banda - 12 reps",
    "Passadas curtas - 10 por perna"
  ];

  const ALONGAMENTOS = [
    "Isquiotibiais - 30s por perna",
    "Quadríceps - 30s por perna",
    "Peitoral na parede - 30s",
    "Trapézio - 30s cada lado",
    "Flexores de quadril - 30s"
  ];

  window.getMusculacaoExtras = function (nivel) {
    // nível pode ser usado depois para ajustar intensidade; por ora só variação
    return {
      mobilidade: pickRandom(MOBILIDADES, 3),
      aquecimento: pickRandom(AQUECIMENTOS, 3),
      alongamento: pickRandom(ALONGAMENTOS, 3)
    };
  };
})();
