const casosController = require('../controllers/casosController')
const express = require('express');
const router = express.Router()

router.get('/casos', casosController.getCasos);
router.get('/casos/:id', casosController.getCaso);
router.post('/casos', casosController.createCaso);
// router.put('/casos/:id', (req,res));
// router.patch('/casos/:id', (req,res));
router.delete('/casos/:id', casosController.deleteCaso);

module.exports = router
