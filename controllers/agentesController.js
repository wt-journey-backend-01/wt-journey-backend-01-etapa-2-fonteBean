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




function createAgente(req, res) {
  const { nome, cargo, dataDeIncorporacao } = req.body;

  if (!nome || !cargo || !dataDeIncorporacao) {
    return res.status(400).send("Nome, Cargo e dataDeIncorporacao são obrigatórios.");
  }

  const data = new Date(dataDeIncorporacao);
  const agora = new Date();

  if (isNaN(data.getTime())) {
    return res.status(400).send("Data de incorporação inválida.");
  }

  if (data > agora) {
    return res.status(400).send("Data de incorporação não pode ser no futuro.");
  }

  const novoAgente = {
    id: uuidv4(),
    nome,
    cargo,
    dataDeIncorporacao: data,
  };

  agentesRepository.criarAgente(novoAgente);
  res.status(201).json(novoAgente);
}

function updateAgente(req, res) {
  const agenteId = req.params.id;
  const { nome, cargo, dataDeIncorporacao } = req.body;
  if ('id' in req.body) {
  return res.status(400).send("Não é permitido alterar o ID do agente.");
}

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

function patchAgente(req, res) {
  const agenteId = req.params.id;
  const { nome, cargo, dataDeIncorporacao} = req.body;
  if ('id' in req.body) {
  return res.status(400).send("Não é permitido alterar o ID do agente.");
}
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

if (dataDeIncorporacao !== undefined) {
  const data = new Date(dataDeIncorporacao);
  const agora = new Date();
  if (isNaN(data.getTime())) {
    return res.status(400).send("Data de incorporação inválida.");
  }
  if (data > agora) {
    return res.status(400).send("Data de incorporação não pode ser no futuro.");
  }
  agente.dataDeIncorporacao = data;
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
  res.status(204).send();
}

module.exports = {
  getAgenteById,
  getAgentes,
  createAgente,
  deleteAgente,
  updateAgente,
  patchAgente,
};