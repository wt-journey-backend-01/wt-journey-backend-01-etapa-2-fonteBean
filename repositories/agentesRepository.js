const agentes = [
{
  "id": "401bccf5-cf9e-489d-8412-446cd169a0f1",
  "nome": "Rommel Carneiro",
  "dataDeIncorporacao": "1992/10/04",
  "cargo": "delegado"

}
];

function findAll(){
  return agentes;
}
function findById(id) {
  const agente = agentes.find(a => a.id === id);
  return agente;
}

function criarAgente(agente){
  agentes.push(agente);
}

function updateAgente(id, dadosAtualizados) {
  const index = agentes.findIndex(a => a.id === id);
  if (index !== -1) {
    agentes[index] = { ...agentes[index], ...dadosAtualizados };
    return agentes[index];
  }
  return null;
}

function deleteAgente(index){
  agentes.splice(index, 1)
}



module.exports  = {
  findAll,
  findById,
  criarAgente,
  deleteAgente
}