// -------- MAIN CONTROLLER (ATUALIZADO FINAL 100%) --------
// Arquivo: js/main.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-treino");
  const resultBox = document.getElementById("resultado");

  // garante botão PDF (se não existir — cria acima do resultado)
  let btnPDF = document.getElementById("btnPDF");
  if (!btnPDF) {
    const wrapper = document.createElement("div");
    wrapper.className = "text-end mb-3";
    btnPDF = document.createElement("button");
    btnPDF.id = "btnPDF";
    btnPDF.className = "btn btn-primary";
    btnPDF.innerHTML = "📄 Salvar Treino em PDF";
    wrapper.appendChild(btnPDF);

    const container = document.querySelector(".container");
    if (container) container.insertBefore(wrapper, resultBox);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const tipo = document.getElementById("tipoTreino").value;
    const objetivo = document.getElementById("objetivo").value;
    const nivel = document.getElementById("nivel").value;
    const dias = Number(document.getElementById("dias").value) || 3;

    let treinoGerado = [];

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

    mostrarTreinoComExtras(tipo, nivel, treinoGerado);
  });

  // =========================
  // MONTAGEM DO TREINO COM ESTILO BONITO
  // =========================
  function mostrarTreinoComExtras(tipo, nivel, treino) {
    resultBox.innerHTML = "";

    if (!treino || treino.length === 0) {
      resultBox.classList.remove("d-none");
      resultBox.innerHTML = `<p class="text-danger">Erro ao gerar treino.</p>`;
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.id = "resultCard";

    treino.forEach((dia, index) => {
      const extras = pegaExtras(tipo, nivel);

      const dayDiv = document.createElement("div");
      dayDiv.className = "mb-4 p-4 workout-day";
      dayDiv.style.borderRadius = "15px";
      dayDiv.style.background = "rgba(255,255,255,0.04)";
      dayDiv.style.backdropFilter = "blur(6px)";
      dayDiv.style.border = "1px solid rgba(255,255,255,0.08)";

      const header = `
        <div style="margin-bottom:15px;">
          <h3 style="
            font-weight:700;
            margin:0 0 5px 0;
            color:#5b6cff;
            font-size:1.6rem;
          ">📅 Treino — Dia ${index + 1}</h3>

          <div style="
            height:3px;
            width:100%;
            background:linear-gradient(90deg,#5b6cff,#8a3df2);
            border-radius:2px;
            margin-top:8px;
          "></div>
        </div>
      `;

      const bloco = (titulo, emoji, itens) => `
        <div style="margin-bottom:22px;">
          <h4 style="
            font-size:1.25rem;
            font-weight:600;
            color:#8a3df2;
            margin-bottom:10px;
          ">${emoji} ${titulo}</h4>

          <ul style="list-style:none;margin:0;padding:0;">
            ${itens
              .map(
                (i) => `
              <li style="
                background:rgba(255,255,255,0.06);
                padding:10px 14px;
                border-radius:10px;
                margin-bottom:8px;
                border:1px solid rgba(255,255,255,0.07);
              ">• ${i}</li>`
              )
              .join("")}
          </ul>
        </div>
      `;

      const blocoTreino = `
        <div style="margin-bottom:22px;">
          <h4 style="
            font-size:1.25rem;
            font-weight:600;
            color:#5b6cff;
            margin-bottom:10px;
          ">🏋️ Exercícios do Dia</h4>

          <div>
            ${dia
              .map(
                (ex) => `
              <div style="
                background:rgba(255,255,255,0.07);
                padding:10px 14px;
                border-radius:10px;
                margin-bottom:8px;
                border:1px solid rgba(255,255,255,0.1);
              ">• ${ex}</div>`
              )
              .join("")}
          </div>
        </div>
      `;

      dayDiv.innerHTML =
        header +
        bloco("Mobilidade", "🔵", extras.mobilidade) +
        bloco("Aquecimento", "⚡", extras.aquecimento) +
        blocoTreino +
        bloco("Alongamento", "🧘", extras.alongamento);

      wrapper.appendChild(dayDiv);
    });

    resultBox.appendChild(wrapper);
    resultBox.classList.remove("d-none");
    wrapper.scrollIntoView({ behavior: "smooth" });
  }

  function pegaExtras(tipo, nivel) {
    if (tipo === "musculacao" && typeof window.getMusculacaoExtras === "function")
      return window.getMusculacaoExtras(nivel);
    if (tipo === "calistenia" && typeof window.getCalisExtras === "function")
      return window.getCalisExtras(nivel);
    if (tipo === "crossfit" && typeof window.getCrossExtras === "function")
      return window.getCrossExtras(nivel);

    return {
      mobilidade: ["Mobilidade geral 10x", "Mobilidade quadril 10x", "Rotação de ombro 15x"],
      aquecimento: ["Polichinelo 60s", "Air squat 15x", "Corrida no lugar 60s"],
      alongamento: ["Peito 30s", "Posterior 30s", "Ombro 30s"]
    };
  }

  // =========================
  // GERAR PDF — FUNÇÃO FINAL
  // =========================
  btnPDF.addEventListener("click", async () => {
    const card = document.querySelector("#resultCard");
    if (!card) return alert("Gere um treino antes de salvar em PDF.");

    // 🔥 Criar modo PDF (tema branco temporário)
    card.classList.add("pdf-mode");

    // Aguarda pintura do layout
    await new Promise((res) => setTimeout(res, 150));

    try {
      const canvas = await html2canvas(card, {
        scale: 2,
        backgroundColor: "#ffffff" // <<< FUNDO BRANCO
      });

      const img = canvas.toDataURL("image/png");
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth() - 20;
      const pageHeight = (canvas.height * pageWidth) / canvas.width;

      pdf.addImage(img, "PNG", 10, 10, pageWidth, pageHeight);
      pdf.save(`treino-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      console.error(e);
      alert("Erro ao gerar PDF.");
    }

    // 🔥 Volta ao modo normal
    card.classList.remove("pdf-mode");
  });
});
