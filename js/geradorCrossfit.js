// -------- GERADOR DE CROSSFIT --------
// Arquivo: js/geradorCrossfit.js

function gerarTreinoCrossfit(objetivo, nivel, dias) {
    const treinos = [];

    const cross = {
        força: ["Deadlift", "Front squat", "Push press", "Clean"],
        cardio: ["Burpees", "Mountain climber", "Corrida 400m", "Corda naval"],
        ginastico: ["Pull-ups", "Toes to bar", "Box jump", "Handstand hold"]
    };

    const intensidade = {
        iniciante: "AMRAP 8-10 min — reps moderadas",
        intermediario: "AMRAP 12 min — ritmo constante",
        avancado: "For time / EMOM — alta intensidade"
    };

    const crossDias = [
        ["força", "ginastico"],
        ["cardio", "força"],
        ["ginastico", "cardio"],
        ["força"],
        ["ginastico"],
        ["cardio"]
    ];

    for (let i = 0; i < dias; i++) {
        const treinoDia = crossDias[i].flatMap(grupo =>
            cross[grupo].map(ex => `${ex} — ${intensidade[nivel]}`)
        );

        treinos.push(treinoDia);
    }

    return treinos;
}
