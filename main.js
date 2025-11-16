import { renderProgramToDom, renderHistory } from './domRenderer.js';
import { normalizeAIResponse } from './workoutGenerator.js';
import { getExercises } from './exerciseDB.js';

const STORAGE_KEY = 'trainforge_modular_v1';

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
  resetBtn: document.getElementById('resetBtn'),
  workoutBox: document.getElementById('workoutBox'),
  historyList: document.getElementById('historyList'),
  clearHistoryBtn: document.getElementById('clearHistoryBtn')
};

function uid(){ return Date.now() + Math.floor(Math.random()*999); }
function getFocusChecked(){ return Array.from(document.querySelectorAll('input[name="focus"]:checked')).map(i=>i.value); }
function loadHistory(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }catch(e){ return []; } }
function saveHistory(h){ localStorage.setItem(STORAGE_KEY, JSON.stringify(h)); }

let history = loadHistory();
renderHistory(el.historyList, history);

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

function generateLocalWorkout() {
  const form = formValues();
  const exercises = getExercises();
  const tipo = form.type;
  const foco = form.focus[0] || 'peito';
  const program = [];

  for(let i=0;i<form.sessions;i++){
    program.push({
      dayName: `Dia ${i+1}`,
      mobility: exercises.mobility,
      warmup: exercises.warmups,
      main: exercises[tipo][foco].slice(0,5).map(ex => ({...ex, sets: 3, reps: 12})),
      stretch: exercises.stretching
    });
  }

  const rec = { id: uid(), createdAt: new Date().toISOString(), form, program };
  renderProgramToDom(el.workoutBox, rec);
  history.unshift(rec); history = history.slice(0,80); saveHistory(history);
  renderHistory(el.historyList, history);
}

el.generateBtn.addEventListener('click', generateLocalWorkout);
el.resetBtn.addEventListener('click', () => {
  el.name.value=''; el.age.value=''; el.weight.value=''; el.time.value=45; el.sessions.value=3;
  el.goal.value='hipertrofia'; el.type.value='musculacao'; el.level.value='auto'; el.limitations.value='';
  document.querySelectorAll('input[name="focus"]').forEach((c,i)=> c.checked = i===0);
});
el.clearHistoryBtn.addEventListener('click', () => { if(!confirm('Apagar histórico?')) return; history=[]; saveHistory(history); renderHistory(el.historyList, history); el.workoutBox.innerHTML = `<p class="text-muted-light">Histórico limpo.</p>`; });
