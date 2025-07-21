const agentes = [];

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

function deleteAgente(index){
  agentes.splice(index, 1)
}



module.exports  = {
  findAll,
  findById,
  criarAgente,
  deleteAgente
}