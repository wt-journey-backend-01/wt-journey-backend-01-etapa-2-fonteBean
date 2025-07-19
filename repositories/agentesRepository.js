const agentes = [];

function findAll(){
  return agentes;
}

function findById(id){
    const agent = agentes.find(a => a.id === id);
    
    if(!agent){
       return res.status(404).send("Agente nao encontrado");
    }
    return agent
}


function deleteAgente(id){
  const agente = findById(id);
  const agentIndex = agentes.findIndex(a => a.id === agente.id);
    
    if(!agentIndex){
       return res.status(404).send("Agente nao encontrado");
    }
    agentes.splice(agentIndex, 1)
     res.status(204).send();
  agentes.slice(agente,1);

}



module.exports  = {
  findAll,
  findById
}