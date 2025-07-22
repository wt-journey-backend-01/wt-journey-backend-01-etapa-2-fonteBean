const agentesRepository = require('../repositories/agentesRepository')
const express = require('express');
const { v4: uuidv4 } = require('uuid');



function getAgentes(req, res) {
    let agentes = agentesRepository.findAll();

    const cargo = req.query.cargo;
    const sort = req.query.sort;

    if (cargo) {
        agentes = agentes.filter(a => a.cargo === cargo);

        if (agentes.length === 0) {
            return res.status(404).send(`Agentes com cargo "${cargo}" não encontrados.`);
        }
    }

    if (sort === 'dataDeIncorporacao') {
        agentes.sort((a, b) => {
            if (a.dataDeIncorporacao < b.dataDeIncorporacao) return -1;
            if (a.dataDeIncorporacao > b.dataDeIncorporacao) return 1;
            return 0;
        });
    } else if (sort === '-dataDeIncorporacao') {
        agentes.sort((a, b) => {
            if (a.dataDeIncorporacao > b.dataDeIncorporacao) return -1;
            if (a.dataDeIncorporacao < b.dataDeIncorporacao) return 1;
            return 0;
        });
    }

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
    dataDeIncorporacao: data.toISOString().split('T')[0],
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

  const data = new Date(dataDeIncorporacao);
  const agora = new Date();

  if (isNaN(data.getTime())) {
    return res.status(400).send("Data de incorporação inválida.");
  }

  if (data > agora) {
    return res.status(400).send("Data de incorporação não pode ser no futuro.");
  }

  const agenteAtualizado = agentesRepository.updateAgente(agenteId, {
    nome,
    cargo,
    dataDeIncorporacao: data.toISOString().split('T')[0],
  });

  if (!agenteAtualizado) {
    return res.status(404).send("Agente não encontrado.");
  }

  res.status(200).json(agenteAtualizado);
}


function patchAgente(req, res) {
  const agenteId = req.params.id;
  const { nome, cargo, dataDeIncorporacao } = req.body;

  if ('id' in req.body) {
    return res.status(400).send("Não é permitido alterar o ID do agente.");
  }
  if (nome === undefined && cargo === undefined && dataDeIncorporacao === undefined) {
    return res.status(400).send("Nenhum campo válido para atualização foi enviado.");
  }

  const agente = agentesRepository.findById(agenteId);
  if (!agente) {
    return res.status(404).send("Agente não encontrado.");
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
    agente.dataDeIncorporacao = data.toISOString().split('T')[0];
  }

  res.status(200).json(agente);
}


function deleteAgente(req,res){
  const agenteId =req.params.id;
    
  const sucesso = agentesRepository.deleteAgente(agenteId);
  if(!sucesso){
    return res.status(400).send(`Error ao deletar ${agenteId}`)
  }
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