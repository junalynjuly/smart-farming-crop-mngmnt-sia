const sensorModel = require('../models/sensorReadingModel');
const thresholdService = require('../services/thresholdService');

exports.getAll = async (req, res) => {
  try {
    const data = await sensorModel.getAll();
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { field_id, metric, value, reading_time } = req.body;
    if (!field_id || !metric || value === undefined) {
      return res.status(400).json({ success: false, message: 'field_id, metric and value are required' });
    }
    if (!sensorModel.METRICS.includes(metric)) {
      return res.status(400).json({ success: false, message: 'metric must be soil_moisture, temperature or ph' });
    }
    const reading = await sensorModel.create({ field_id, metric, value, reading_time });
    const alert = await thresholdService.checkReading(reading);
    res.status(201).json({ success: true, data: reading, alert });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ success: false, message: 'Invalid field_id' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};
