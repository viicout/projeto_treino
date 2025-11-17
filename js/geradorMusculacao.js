// -------- GERADOR DE MUSCULAÇÃO --------
// Arquivo: js/geradorMusculacao.js

function gerarTreinoMusculacao(objetivo, nivel, dias) {
    const treinos = [];

    const musculacao = {
        peito: ["Supino reto", "Supino inclinado", "Crucifixo", "Cross-over"],
        costas: ["Puxada frente", "Remada curvada", "Remada baixa", "Barra fixa"],
        pernas: ["Agachamento livre", "Leg press", "Cadeira extensora", "Mesa flexora"],
        ombro: ["Desenvolvimento", "Elevação lateral", "Elevação frontal"],
        biceps: ["Rosca direta", "Rosca alternada", "Rosca martelo"],
        triceps: ["Tríceps testa", "Tríceps corda", "Mergulho no banco"]
    };

    const intensidade = {
        iniciante: "3 séries de 10 repetições",
        intermediario: "4 séries de 10-12 repetições",
        avancado: "5 séries de 8-10 repetições com carga alta"
    };

    const muscDias = [
        ["peito", "triceps"],
        ["costas", "biceps"],
        ["pernas"],
        ["ombro", "triceps"],
        ["peito", "biceps"],
        ["costas", "ombro"]
    ];

    for (let i = 0; i < dias; i++) {
        const treinoDia = muscDias[i].flatMap(grupo =>
            musculacao[grupo].map(ex => `${ex} — ${intensidade[nivel]}`)
        );

        treinos.push(treinoDia);
    }

    return treinos;
}
