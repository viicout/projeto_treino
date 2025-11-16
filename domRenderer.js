// js/domRenderer.js
// Renderiza o programa (cards / acordeão) de forma bonita

export function renderProgramToDom(containerEl, rec){
  const prog = rec.program || [];
  let html = `<div class="mb-2"><strong>${rec.form?.name || 'Usuário anônimo'}</strong> <div class="text-muted-light small">${new Date(rec.createdAt || Date.now()).toLocaleString()} • ${rec.form?.level || ''} • ${rec.form?.goal || ''}</div></div>`;

  html += `<div class="accordion" id="accordionTreinos">`;

  prog.forEach((day, idx) => {
    const dayTitle = day.dayName || day.titulo || `Dia ${idx+1}`;
    const mobility = day.mobility || day.mobilidade || [];
    const warmup = day.warmup || day.aquecimento || [];
    const main = day.main || day.treino || day.principal || [];
    const stretch = day.stretch || day.alongamento || day.stretching || [];

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
            <table class="table table-sm table-borderless table-custom text-light">
              <thead><tr><th>Exercício</th><th>Séries</th><th>Reps / Observações</th></tr></thead>
              <tbody>
                ${
                  (main.length ? main : []).map(ex => {
                    if(typeof ex === 'string') return `<tr><td>${ex}</td><td>-</td><td>-</td></tr>`;
                    const name = ex.name || ex.nome || ex.exercise || '';
                    const sets = ex.sets || ex.series || '-';
                    const reps = ex.reps || ex.repetitions || ex.range || '-';
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

  html += `</div>`; // accordion
  containerEl.innerHTML = html;
}
