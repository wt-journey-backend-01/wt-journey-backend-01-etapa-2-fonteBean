const casosRepository = require("../repositories/casosRepository.js")
const agentesRepository = require("../repositories/agentesRepository.js")
const {v4 : uuid} = require("uuid");

function getCasos(req,res){
  const casos = casosRepository.findAll();
  res.status(200).send(casos)
}

function getCaso(req,res){
  const casoId = req.params.id;
  const caso = casosRepository.findById(casoId);
  if(!caso){
   return  res.status(404).send("caso nao encontrado")
  }
  res.status(200).send(caso)
}

function createCaso(req,res){
  const {titulo ,descricao ,status, agente_id} = req.body;
  if(!titulo || !descricao ||  !status || !agente_id){
    res.status(400).send("Titulo, descricao, status e agente obrigatorios")
  }

  if( status != "aberto" && status != "solucionado")
    {
   return  res.status(401).send("Status nao permitido ")
    }
  const agente = agentesRepository.findById(agente_id);
  if (!agente) {
    return res.status(404).send("Agente não encontrado para o agente_id fornecido");
  }
    const novoCaso = {
      id: uuid(),
      titulo,
      descricao,
      status,
      agente_id
    }
    casosRepository.criarCaso(novoCaso)
   res.status(201).send(novoCaso) 
}

function deleteCaso(req,res){
    const casos = casosRepository.findAll();
    const casoId = req.params.id;
    const casoIndex = casos.findIndex(c => c.id === casoId);
    
    if(casoIndex === -1){
       return res.status(404).send("Caso nao encontrado");
    }
  casosRepository.deleteCaso(casoIndex);
  res.status(204).send();
}
function updateCaso(req, res) {
  const casoId = req.params.id;
  const { titulo, descricao, status, agente_id } = req.body;

  if (!titulo || !descricao || !status || !agente_id) {
    return res.status(400).send("Todos os campos são obrigatórios para atualização completa.");
  }

  const caso = casosRepository.findById(casoId);
  if (!caso) {
    return res.status(404).send("caso não encontrado.");
  }
 
    if( status != "aberto" && status != "solucionado")
    {
     return  res.status(400).send("Status nao permitido ")
    }
    caso.status = status
  
  const agente = agentesRepository.findById(agente_id);
  if (!agente) {
    return res.status(404).send("Agente não encontrado para o agente_id fornecido");
  }

  caso.titulo = titulo;
  caso.descricao = descricao;
  caso.status = status;
  caso.agente_id = agente_id;

  res.status(200).json(caso);
}

function patchCaso(req, res) {
  const casoId = req.params.id;
  const { titulo, descricao, status, agente_id } = req.body;

  const caso = casosRepository.findById(casoId);
  if (!caso) {
    return res.status(404).send("Caso não encontrado.");
  }

  if (titulo !== undefined) { 
    caso.titulo = titulo;
  }
  if (descricao !== undefined) {
    caso.descricao = descricao;
  }
  if (status !== undefined) {
    if( status != "aberto" && status != "solucionado")
    {
     return  res.status(400).send("Status nao permitido ")
    }
    caso.status = status
  }
  
  if (agente_id !== undefined) {
    const agente = agentesRepository.findById(agente_id);
    if (!agente) {
      return res.status(404).send("Agente não encontrado para o agente_id fornecido.");
    }
    caso.agente_id = agente_id;
  }


  res.status(200).json(caso);
}

module.exports = {
  getCaso,
  getCasos,
  createCaso,
  deleteCaso,
  updateCaso,
  patchCaso,
};
