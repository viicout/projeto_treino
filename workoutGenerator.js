// workoutGenerator.js
export function normalizeAIResponse(aiResp) {
  if (!aiResp) return { program: [] };
  if (Array.isArray(aiResp)) return { program: aiResp };
  if (aiResp.program || aiResp.treino || aiResp.plano) {
    return { program: aiResp.program || aiResp.treino || aiResp.plano };
  }
  return { program: aiResp.program || [] };
}
