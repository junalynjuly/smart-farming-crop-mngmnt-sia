const model = require('../models/plantingReportModel');

exports.plantingsWithHarvests = async (req, res) => {
  try {
    res.status(200).json({ success: true, data: await model.plantingsWithHarvests() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
