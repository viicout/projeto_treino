import { runAI } from './aiModel.js';
import { renderProgramToDom } from './domRenderer.js';

const el = {
  name: document.getElementById('name'),
  age: document.getElementById('age'),
  weight: document.getElementById('weight'),
  time: document.getElementById('time'),
  sessions: document.getElementById('sessions'),
  goal: document.getElementById('goal'),
  type: document.getElementById('type'),
  level: document.getElementById('level'),
  limitations: document.getElementById('limitations'),
  generateBtn: document.getElementById('generateBtn'),
  workoutBox: document.getElementById('workoutBox'),
  trainProgress: document.getElementById('trainProgress'),
  trainProgressText: document.getElementById('trainProgressText')
};

function getFocusChecked(){ return []; }

function formValues(){
  return {
    name: el.name?.value?.trim() || '',
    age: el.age?.value?.trim() || '',
    weight: el.weight?.value?.trim() || '',
    time: el.time?.value?.trim() || '45',
    sessions: el.sessions?.value?.trim() || '3',
    goal: el.goal?.value || 'hipertrofia',
    type: el.type?.value || 'musculacao',
    level: el.level?.value || 'auto',
    limitations: el.limitations?.value?.trim() || '',
    focus: getFocusChecked()
  };
}

async function generateAndRender(){
  const form = formValues();
  el.generateBtn.disabled = true;
  const prevText = el.generateBtn.innerText;
  el.generateBtn.innerText = "Gerando...";
  el.trainProgress.style.display = 'block';
  el.trainProgressText.textContent = 'Chamando IA...';

  try {
    const payload = {
      diasTreino: Number(form.sessions),
      objetivo: form.goal,
      nivel: form.level,
      tipoTreino: form.type,
      nome: form.name,
      foco: form.focus,
      tempo: Number(form.time),
      limitacoes: form.limitations
    };

    const aiResp = await runAI(payload);

    if(aiResp.erro){
      el.workoutBox.innerHTML = `<div class="alert alert-danger">Erro: ${aiResp.mensagem}</div>`;
    } else {
      // Cria objeto rec para renderizar
      const rec = {
        form,
        createdAt: new Date().toISOString(),
        program: aiResp.program || aiResp.treino || aiResp.plano || []
      };
      renderProgramToDom(el.workoutBox, rec);
    }

  } catch(err){
    el.workoutBox.innerHTML = `<div class="alert alert-danger">Erro ao gerar treino: ${err.message}</div>`;
  } finally {
    el.generateBtn.disabled = false;
    el.generateBtn.innerText = prevText;
    el.trainProgress.style.display = 'none';
  }
}

el.generateBtn.addEventListener('click', generateAndRender);
