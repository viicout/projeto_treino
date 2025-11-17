// -------- MAIN CONTROLLER --------
// Arquivo: js/main.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-treino");
    const resultBox = document.getElementById("resultado");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const tipo = document.getElementById("tipoTreino").value;
        const objetivo = document.getElementById("objetivo").value;
        const nivel = document.getElementById("nivel").value;
        const dias = Number(document.getElementById("dias").value);

        let treinoGerado = [];

        // 🔥 Seleciona qual gerador usar
        switch (tipo) {
            case "musculacao":
                treinoGerado = gerarTreinoMusculacao(objetivo, nivel, dias);
                break;

            case "calistenia":
                treinoGerado = gerarTreinoCalistenia(objetivo, nivel, dias);
                break;

            case "crossfit":
                treinoGerado = gerarTreinoCrossfit(objetivo, nivel, dias);
                break;

            default:
                treinoGerado = [];
        }

        mostrarTreino(treinoGerado);
    });

    // Exibe na tela
    function mostrarTreino(treino) {
        resultBox.innerHTML = "";

        if (!treino || treino.length === 0) {
            resultBox.classList.remove("d-none");
            resultBox.innerHTML = `<p class="text-danger">Erro ao gerar treino.</p>`;
            return;
        }

        treino.forEach((dia, index) => {
            const dayDiv = document.createElement("div");
            dayDiv.className = "mb-4 p-3 workout-day";

            dayDiv.innerHTML = `
                <h4>Dia ${index + 1}</h4>
                ${dia.map(ex => `<div class="exercise-item">${ex}</div>`).join("")}
            `;

            resultBox.appendChild(dayDiv);
        });

        resultBox.classList.remove("d-none");
        resultBox.scrollIntoView({ behavior: "smooth" });
    }
});
