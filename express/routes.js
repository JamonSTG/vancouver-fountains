const express = require('express');
const { fountainController, reportController } = require('./controller');
const {
  validateFountainId,
  validateReportData,
  validateFountainUpdate,
  validateQueryParams
} = require('./middleware');

const router = express.Router();

// Fountain routes
router.get('/fountains', validateQueryParams, fountainController.getAll);
router.get('/fountains/:id', validateFountainId, fountainController.getById);
router.put('/fountains/:id', validateFountainId, validateFountainUpdate, fountainController.update);

// Report routes
router.post('/fountains/:id/reports', validateFountainId, validateReportData, reportController.create);
router.get('/fountains/:id/reports', validateFountainId, reportController.getByFountainId);

module.exports = router;
