// -------- MAIN CONTROLLER (PDF MULTI-PAGE STABLE) --------
// Arquivo: js/main.js
// Requer: html2canvas + jspdf (já incluídos no seu HTML)

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-treino");
  const resultBox = document.getElementById("resultado");

  // garante botão PDF
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

  // ------------------------------
  // Render (mantive seu visual)
  // ------------------------------
  function mostrarTreinoComExtras(tipo, nivel, treino) {
    resultBox.innerHTML = "";
    if (!treino || treino.length === 0) {
      resultBox.classList.remove("d-none");
      resultBox.innerHTML = `<p class="text-danger">Erro ao gerar treino.</p>`;
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.id = "resultCard";
    wrapper.className = "fade-in";

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
          <h3 style="font-weight:700;margin:0 0 5px 0;color:#5b6cff;font-size:1.6rem">
            📅 Treino — Dia ${index + 1}
          </h3>
          <div style="height:3px;width:100%;background:linear-gradient(90deg,#5b6cff,#8a3df2);border-radius:2px;margin-top:8px"></div>
        </div>
      `;

      const bloco = (titulo, emoji, itens) => {
        return `
          <div style="margin-bottom:18px">
            <h4 style="font-size:1.1rem;font-weight:600;color:#8a3df2;margin-bottom:8px">${emoji} ${titulo}</h4>
            <ul style="list-style:none;margin:0;padding:0">
              ${itens.map(i => `<li style="background:rgba(255,255,255,0.06);padding:8px 12px;border-radius:8px;margin-bottom:8px;border:1px solid rgba(255,255,255,0.07)">• ${i}</li>`).join("")}
            </ul>
          </div>
        `;
      };

      const blocoTreino = `
        <div style="margin-bottom:18px">
          <h4 style="font-size:1.1rem;font-weight:600;color:#5b6cff;margin-bottom:8px">🏋️ Exercícios do Dia</h4>
          <div>
            ${dia.map(ex => `<div style="background:rgba(255,255,255,0.07);padding:8px 12px;border-radius:8px;margin-bottom:8px;border:1px solid rgba(255,255,255,0.1)">• ${ex}</div>`).join("")}
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
      mobilidade: ["Mobilidade geral 10x", "Quadril 10x", "Ombro 15x"],
      aquecimento: ["Polichinelo 60s", "Air squat 15x", "Corrida leve 60s"],
      alongamento: ["Peito 30s", "Posterior 30s", "Ombro 30s"],
    };
  }

  // ------------------------------
  // GERAR PDF MULTIPÁGINA (A4 vertical)
  // ------------------------------
  btnPDF.addEventListener("click", async () => {
    const area = document.querySelector("#resultCard");
    if (!area) return alert("Gere um treino antes de salvar.");

    // 1) aplica modo PDF (apenas para tornar o conteúdo legível no canvas)
    area.classList.add("pdf-mode"); // certifique-se de ter estilos .pdf-mode no style.css

    // pequena espera para o browser aplicar estilos
    await new Promise((r) => setTimeout(r, 120));

    try {
      // captura com html2canvas
      const canvas = await html2canvas(area, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });

      // prepara jsPDF A4
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidthMm = pdf.internal.pageSize.getWidth();
      const pageHeightMm = pdf.internal.pageSize.getHeight();
      const marginMm = 10;
      const usableWidthMm = pageWidthMm - marginMm * 2;
      const usableHeightMm = pageHeightMm - marginMm * 2;

      // converte mm <-> px com base na largura do canvas
      const imgWidthPx = canvas.width;
      const imgWidthMm = usableWidthMm;
      const pxPerMm = imgWidthPx / imgWidthMm;
      const pageHeightPx = Math.floor(usableHeightMm * pxPerMm);

      // fatiar o canvas em pedaços do tamanho da página
      let y = 0;
      let pageCount = 0;
      while (y < canvas.height) {
        const sliceHeight = Math.min(pageHeightPx, canvas.height - y);
        // cria canvas temporário para o pedaço
        const tmpCanvas = document.createElement("canvas");
        tmpCanvas.width = canvas.width;
        tmpCanvas.height = sliceHeight;
        const ctx = tmpCanvas.getContext("2d");
        ctx.drawImage(canvas, 0, y, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

        const imgData = tmpCanvas.toDataURL("image/png");
        const imgHeightMm = sliceHeight / pxPerMm;

        if (pageCount > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", marginMm, marginMm, imgWidthMm, imgHeightMm);

        y += sliceHeight;
        pageCount++;
      }

      // salva o arquivo
      pdf.save(`treino-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF multipágina:", err);
      alert("Erro ao gerar PDF. Ver console.");
    } finally {
      // 2) remove modo PDF (restaura aparência)
      area.classList.remove("pdf-mode");
    }
  });
});
