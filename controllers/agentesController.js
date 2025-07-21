const agentesRepository = require('../repositories/agentesRepository')
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { patchCaso } = require('./casosController');


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

function updateAgente(req, res) {
  const agenteId = req.params.id;
  const { nome, cargo, dataDeIncorporacao } = req.body;

  if (!nome || !cargo || !dataDeIncorporacao) {
    return res.status(400).send("Todos os campos são obrigatórios para atualização completa.");
  }

  const agente = agentesRepository.findById(agenteId);
  if (!agente) {
    return res.status(404).send("Agente não encontrado.");
  }
  agente.nome = nome;
  agente.cargo = cargo;
  agente.dataDeIncorporacao = new Date(dataDeIncorporacao);

  res.status(200).json(agente);
}

function patchagente(req, res) {
  const agenteId = req.params.id;
  const { nome, cargo, dataDeIncorporacao} = req.body;

  const agente = agentesRepository.findById(agenteId);
  if (!agente) {
    return res.status(404).send("agente não encontrado.");
  }

  if (nome !== undefined) { 
    agente.nome = nome;
  }
  if (cargo !== undefined) {
    agente.cargo = cargo;
  }

  if(dataDeIncorporacao !== undefined && dataDeIncorporacao < new Date()){
    agente.dataDeIncorporacao =dataDeIncorporacao
  }
  res.status(200).json(agente);
}

function deleteAgente(req,res){
    const agentes = agentesRepository.findAll();
    const agenteId =req.params.id;
    const agentIndex = agentes.findIndex(a => a.id === agenteId);
    
    if(agentIndex === -1){
       return res.status(404).send("Agente nao encontrado");
    }
  agentesRepository.deleteAgente(agentIndex);
  res.status(200).send();
}

module.exports = {
  getAgenteById,
  getAgentes,
  createAgente,
  deleteAgente,
  updateAgente,
  patchCaso
};