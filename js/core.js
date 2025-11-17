/* =========================================================
   CORE.JS — Núcleo do Sistema
   Responsável pela ponte entre UI, dados e gerador de treinos.
   ========================================================= */

console.log("core.js carregado com sucesso.");


// =========================
// OBJETO PRINCIPAL (APP)
// =========================
const TreinoPro = {
    state: {
        goal: "hipertrofia",
        types: [],
        level: "iniciante",
        days: 3,
        duration: 45,
        limitations: "",
        logic: "balanced",
    },

    init() {
        console.log("TreinoPro iniciado.");
        this.bindUIEvents();
        UI.renderExerciseLibrary(ExerciseData); 
    },

    // =========================================================
    // CAPTURA TODOS OS DADOS DO FORMULÁRIO
    // =========================================================
    updateStateFromForm() {
        const form = document.querySelector("#generator-form");

        this.state.goal = form.querySelector("[data-hook='input-goal']").value;

        // tipos de treino
        const typeChecks = form.querySelectorAll("[data-hook='input-type'] input[type='checkbox']");
        this.state.types = [];
        typeChecks.forEach(chk => {
            if (chk.checked) this.state.types.push(chk.value);
        });

        this.state.level = form.querySelector("[data-hook='input-level']").value;
        this.state.days = Number(form.querySelector("[data-hook='input-days']").value);
        this.state.duration = Number(form.querySelector("[data-hook='input-duration']").value);
        this.state.limitations = form.querySelector("[data-hook='input-limitations']").value.trim();
        this.state.logic = form.querySelector("[data-hook='input-logic']").value;

        console.log("Estado atualizado:", this.state);
    },

    // =========================================================
    // EVENTOS DA INTERFACE
    // =========================================================
    bindUIEvents() {

        // BOTÃO GERAR TREINO NORMAL
        document.querySelector("[data-hook='btn-generate']")
            .addEventListener("click", () => {
                this.updateStateFromForm();

                const workoutPlan = WorkoutGenerator.generatePlan(this.state);

                UI.displayWorkout(workoutPlan);
            });

        // BOTÃO GERAR TREINO ALEATÓRIO
        document.querySelector("[data-hook='btn-random']")
            .addEventListener("click", () => {
                const workoutPlan = WorkoutGenerator.generateRandomPlan();

                UI.displayWorkout(workoutPlan);
            });
    }
};


// INICIALIZA APP
document.addEventListener("DOMContentLoaded", () => TreinoPro.init());
