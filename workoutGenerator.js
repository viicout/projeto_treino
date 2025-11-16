// workoutGenerator.js — normaliza resposta da IA
export function normalizeAIResponse(aiResp) {
  if (!aiResp) return { program: [] };
  if (Array.isArray(aiResp)) return { program: aiResp };
  return { program: aiResp.program || [] };
}
