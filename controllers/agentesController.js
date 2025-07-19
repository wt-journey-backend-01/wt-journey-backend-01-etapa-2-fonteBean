const agentesRepository = require('../repositories/agentesRepository')
const express = require('express');

function deleteAgente(req,res){
   const agenteId = parseInt(req.params.id);
   if(!agenteId){
    res.status(400).send("Id do agente nao passado");
   }
  agentesRepository.findById(agenteId);
  
}