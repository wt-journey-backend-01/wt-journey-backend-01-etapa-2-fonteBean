const agentesRepository = require('../repositories/agentesRepository')
const express = require('express');
const { v4: uuidv4 } = require('uuid');


function getAgentes(req,res){
  const agentes = agentesRepository.findAll();
  res.status(200).json(agentes);
}

function getAgenteById(req,res){
  const agenteId = req.params.id;
  const agente = agentesRepository.findById(agenteId);
  if(!agente){
       return res.status(404).send("Agente nao encontrado");
    }
     res.status(200).json(agente);
}




function createAgente(req,res){
  const {nome, cargo}  = req.body;
  if(!nome || !cargo){
    return res.status(400).send("Nome e Cargo sao obrigatorios")
  }
  const novoAgente ={
        id : uuidv4(),
         nome,
        dataDeIncorporacao: new Date(),
        cargo
    }
  agentesRepository.criarAgente(novoAgente);
  res.status(201).send(novoAgente);
}


function deleteAgente(req,res){
    const agentes = agentesRepository.findAll();
    const agenteId =req.params.id;
    const agentIndex = agentes.findIndex(a => a.id === agenteId);
    
    if(!agentIndex){
       return res.status(400).send("Agente nao encontrado");
    }
  agentesRepository.deleteAgente()
  res.status(200).send();
}

module.exports = {
  getAgenteById,
  getAgentes,
  createAgente,
  deleteAgente,
};