// domRenderer.js
export function renderProgramToDom(containerEl, rec){
  const prog = rec.program || [];
  let html = `<div class="mb-2"><strong>${rec.form?.name || 'Usuário anônimo'}</strong> <div class="text-muted-light small">${new Date(rec.createdAt || Date.now()).toLocaleString()} • ${rec.form?.levelUsed || ''} • ${rec.form?.goal || ''}</div></div>`;

  html += `<div class="accordion" id="accordionTreinos">`;

  prog.forEach((day, idx) => {
    const dayTitle = day.dayName || `Dia ${idx+1}`;
    const mobility = day.mobility || [];
    const warmup = day.warmup || [];
    const main = day.main || [];
    const stretch = day.stretch || [];

    html += `
      <div class="accordion-item workout-day">
        <h2 class="accordion-header" id="heading${idx}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${idx}" aria-expanded="false" aria-controls="collapse${idx}">
            ${dayTitle}
          </button>
        </h2>
        <div id="collapse${idx}" class="accordion-collapse collapse" data-bs-parent="#accordionTreinos">
          <div class="accordion-body">
            <p class="section-title">Mobilidade</p>
            <ul>${(mobility.length ? mobility : ['Sem informação']).map(i=>`<li>${i}</li>`).join('')}</ul>

            <p class="section-title">Aquecimento</p>
            <ul>${(warmup.length ? warmup : ['Sem informação']).map(i=>`<li>${i}</li>`).join('')}</ul>

            <p class="section-title">Treino Principal</p>
            <table class="table table-sm table-borderless table-custom">
              <thead><tr><th>Exercício</th><th>Séries</th><th>Reps / Observações</th></tr></thead>
              <tbody>
                ${
                  (main.length ? main : []).map(ex => {
                    if (typeof ex === 'string') return `<tr><td>${ex}</td><td>-</td><td>-</td></tr>`;
                    const name = ex.name || '';
                    const sets = ex.sets || '-';
                    const reps = ex.reps || '-';
                    return `<tr><td>${name}</td><td>${sets}</td><td>${reps}</td></tr>`;
                  }).join('')
                }
              </tbody>
            </table>

            <p class="section-title">Alongamento</p>
            <ul>${(stretch.length ? stretch : ['Sem informação']).map(i=>`<li>${i}</li>`).join('')}</ul>
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  containerEl.innerHTML = html;
}

export function renderHistory(containerEl, history){
  if(!history || !history.length){ containerEl.innerHTML = `<p class="text-muted-light">Sem histórico.</p>`; return; }
  let html = '';
  history.forEach(rec => {
    const date = new Date(rec.createdAt || Date.now()).toLocaleString();
    html += `<div class="history-item">`;
    html += `<div class="history-date">${date}</div>`;
    html += `<div class="history-goal">Objetivo: ${rec.form?.goal || '-'}</div>`;
    html += `<div class="history-exp">Nível: ${rec.form?.levelUsed || '-'}</div>`;
    html += `</div>`;
  });
  containerEl.innerHTML = html;
}
