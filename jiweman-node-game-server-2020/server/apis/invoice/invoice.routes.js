const express = require('express');
const router = express.Router();
const invoiceController = require('./invoice.controller');

// For superAdmin
router.get('/getAllInvoices/',invoiceController.getAll);

module.exports = router;