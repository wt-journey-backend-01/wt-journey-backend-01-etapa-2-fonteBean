const casos = [];

function findAll(){
  return casos;
}
function findById(id) {
  const caso = casos.find(a => a.id === id);
  return caso;
}

function criarCaso(caso){
  casos.push(caso);
}

function deleteCaso(index){
  casos.splice(index, 1)
}



module.exports  = {
  findAll,
  findById,
  criarCaso,
  deleteCaso
}
