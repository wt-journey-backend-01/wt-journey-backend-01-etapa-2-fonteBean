const agentes = [];

function findAll(){
  return agentes;
}

function criarAgente(agente){
  agentes.push(agente);
}

function deleteAgente(index){
  agentes.splice(index, 1)
}



module.exports  = {
  findAll,
  findById
}