// -------- GERADOR DE CALISTENIA --------
// Arquivo: js/geradorCalistenia.js

function gerarTreinoCalistenia(objetivo, nivel, dias) {
    const treinos = [];

    const calistenia = {
        upper: ["Flexões", "Flexão diamante", "Flexão arqueiro", "Dips paralelas"],
        pull: ["Barra fixa pronada", "Barra fixa supinada", "Australiana", "Isometria na barra"],
        legs: ["Agachamento", "Agachamento pistol assistido", "Afundos", "Salto vertical"],
        core: ["Prancha", "Prancha lateral", "L-Sit", "Elevação de pernas"]
    };

    const intensidade = {
        iniciante: "3 séries de 8-12 repetições",
        intermediario: "4 séries de 12-15 repetições",
        avancado: "5 séries com variações avançadas"
    };

    const calisDias = [
        ["upper", "core"],
        ["pull", "core"],
        ["legs", "core"],
        ["upper", "pull"],
        ["legs", "upper"],
        ["pull", "core"]
    ];

    for (let i = 0; i < dias; i++) {
        const treinoDia = calisDias[i].flatMap(grupo =>
            calistenia[grupo].map(ex => `${ex} — ${intensidade[nivel]}`)
        );

        treinos.push(treinoDia);
    }

    return treinos;
}
