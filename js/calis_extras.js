// Arquivo: js/calis_extras.js
// Mobilidade / aquecimento / alongamento para calistenia

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
    "Punhos - rotações 30s",
    "Torácica - mobilidade 10x",
    "Quadril - abertura 10x por lado",
    "Ombro - círculos 15x",
    "Coluna - gato-vaca 12x"
  ];

  const AQUECIMENTOS = [
    "Hollow body hold - 20s",
    "Scapular pull-ups - 8-10 reps",
    "Push-up progressional - 2x8",
    "Australian rows leve - 12 reps",
    "Saltos curtos - 30s"
  ];

  const ALONGAMENTOS = [
    "Peito/ombro - 30s",
    "Isquios - 30s por perna",
    "Quadríceps - 30s por perna",
    "Flexores de punho - 20s",
    "Core stretch - 30s"
  ];

  window.getCalisExtras = function (nivel) {
    return {
      mobilidade: pickRandom(MOBILIDADES, 3),
      aquecimento: pickRandom(AQUECIMENTOS, 3),
      alongamento: pickRandom(ALONGAMENTOS, 3)
    };
  };
})();
