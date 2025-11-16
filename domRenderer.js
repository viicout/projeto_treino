// domRenderer.js — renderiza treino e histórico no DOM
export function renderProgramToDom(containerEl, rec) {
  const prog = rec.program || [];
  let html = `<div class="mb-2"><strong>${rec.form?.name || 'Usuário anônimo'}</strong> 
    <div class="text-muted small">${new Date(rec.createdAt || Date.now()).toLocaleString()} • ${rec.form?.levelUsed || ''} • ${rec.form?.goal || ''}</div></div>`;

  html += `<div class="accordion" id="accordionTreinos">`;

  prog.forEach((day, idx) => {
    const dayTitle = day.dayName || `Dia ${idx+1}`;
    html += `
      <div class="accordion-item workout-day">
        <h2 class="accordion-header" id="heading${idx}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${idx}" aria-expanded="false">
            ${dayTitle}
          </button>
        </h2>
        <div id="collapse${idx}" class="accordion-collapse collapse" data-bs-parent="#accordionTreinos">
          <div class="accordion-body">
            <p class="section-title">Mobilidade</p>
            <ul>${(day.mobility || []).map(i=>`<li>${i}</li>`).join('') || '<li>Sem informação</li>'}</ul>

            <p class="section-title">Aquecimento</p>
            <ul>${(day.warmup || []).map(i=>`<li>${i}</li>`).join('') || '<li>Sem informação</li>'}</ul>

            <p class="section-title">Treino Principal</p>
            <ul>${(day.main || []).map(ex => ex.name || ex).map(i=>`<li>${i}</li>`).join('') || '<li>Sem informação</li>'}</ul>

            <p class="section-title">Alongamento</p>
            <ul>${(day.stretch || []).map(i=>`<li>${i}</li>`).join('') || '<li>Sem informação</li>'}</ul>
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  containerEl.innerHTML = html;
}

export function renderHistory(containerEl, history){
  if(!history || !history.length){ 
    containerEl.innerHTML = `<p class="text-muted-light">Sem histórico.</p>`; 
    return; 
  }
  let html = '';
  history.forEach(rec => {
    const date = new Date(rec.createdAt || Date.now()).toLocaleString();
    html += `<div class="history-item"><div class="history-date">${date}</div><div class="history-goal">Objetivo: ${rec.form?.goal || '-'}</div></div>`;
  });
  containerEl.innerHTML = html;
}
