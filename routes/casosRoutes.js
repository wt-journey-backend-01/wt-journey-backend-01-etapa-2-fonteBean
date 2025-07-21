const casosController = require('../controllers/casosController.js')
const express = require('express');
const router = express.Router()

router.get('/casos', casosController.getCasos);
router.get('/casos/:id', casosController.getCaso);
router.post('/casos', casosController.createCaso);
router.put('/casos/:id', casosController.updateCaso);
router.patch('/casos/:id', casosController.patchCaso);
router.delete('/casos/:id', casosController.deleteCaso);

module.exports = router
