const casosRepository = require("../repositories/casosRepository.js")
const {v4 : uuid} = require("uuid");

function getCasos(req,res){
  const casos = casosRepository.findAll();
  res.status(200).send(casos)
}

function getCaso(req,res){
  const casoId = req.params.id;
  const caso = casosRepository.findById(casoId);
  if(!caso){
   return  res.status(400).send("caso nao encontrado")
  }
  res.status(200).send(caso)
}

function createCaso(req,res){
  const {titulo ,descricao ,status} = req.body;
  if(!titulo| !descricao| !status){
    res.status(400).send("Titulo, descricao e status obrigatorios")
  }

  if( status != "aberto" && status != "solucionado")
    {
   return  res.status(401).send("Status nao permitido ")
    }
    const novoCaso = {
      id: uuid(),
      titulo,
      descricao,
      status,
      agente_id: uuid()
    }
    casosRepository.criarCaso(novoCaso)
   res.status(201).send(novoCaso) 
}

function deleteCaso(req,res){
    const casos = casosRepositoryRepository.findAll();
    const casoId = req.params.id;
    const casoIndex = casos.findIndex(c => c.id === casoId);
    
    if(casoIndex === -1){
       return res.status(400).send("Caso nao encontrado");
    }
  casosRepository.deleteCaso(casoIndex);
  res.status(200).send();
}

module.exports = {
  getCaso,
  getCasos,
  createCaso,
  deleteCaso,
};
