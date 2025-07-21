const agentesController = require('../controllers/agentesController.js')
const express = require('express');
const router = express.Router();


router.get('/agentes', agentesController.getAgentes);
router.get('/agentes/:id', agentesController.getAgenteById);
router.post('/agentes', agentesController.createAgente);
// router.put('/agentes/:id', (req,res));
// router.patch('/agentes/:id', (req,res));
router.delete('/agentes/:id',agentesController.deleteAgente);

module.exports= router;

