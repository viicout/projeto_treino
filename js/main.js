async function generateAndRender() {
  const form = formValues();

  el.generateBtn.disabled = true;
  const prevText = el.generateBtn.innerText;
  el.generateBtn.innerText = "Gerando...";

  if (el.trainProgress) { 
    el.trainProgress.style.display = 'flex'; 
    el.trainProgressText.textContent = 'Preparando IA...'; 
  }

  try {
    // --- Normalização de payload ---
    let foco = getFocusChecked();
    if (!foco || !foco.length) foco = ["full"]; // default se nenhum foco selecionado

    let nome = form.name || "Usuário";
    nome = nome.replace(/[^\w\s]/gi,''); // remove caracteres especiais

    const diasTreino = Number(form.sessions) || 3;
    const tempo = Number(form.time) || 45;

    const payload = {
      diasTreino,
      objetivo: form.goal || "hipertrofia",
      nivel: form.level || "auto",
      tipoTreino: form.type || "musculacao",
      nome,
      foco,
      tempo,
      limitacoes: form.limitations || ""
    };

    console.log("Payload enviado para a IA:", payload); // debug no console

    // --- Chamada segura da IA ---
    const aiResp = await runAI(payload);

    if (aiResp.erro) {
      el.workoutBox.innerHTML = `<div class="alert alert-danger">Erro: ${aiResp.mensagem}</div>`;
      console.error('AI retornou erro:', aiResp);
    } else {
      const norm = normalizeAIResponse(aiResp);
      const rec = { 
        id: uid(), 
        createdAt: new Date().toISOString(), 
        form: Object.assign({}, form, { levelUsed: form.level }), 
        program: norm.program || [] 
      };
      renderProgramToDom(el.workoutBox, rec);
      history.unshift(rec); 
      history = history.slice(0, 80); 
      saveHistory(history);
      renderHistory(el.historyList, history);
    }

  } catch (err) {
    console.error('generateAndRender error', err);
    el.workoutBox.innerHTML = `<div class="alert alert-danger">Erro ao gerar treino: ${err.message || err}</div>`;
  } finally {
    if (el.trainProgress) el.trainProgress.style.display = 'none';
    el.generateBtn.disabled = false;
    el.generateBtn.innerText = prevText;
  }
}
