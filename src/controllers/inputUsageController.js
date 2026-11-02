const model = require('../models/inputUsageModel');

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const isId = (v) => Number.isInteger(Number(v)) && Number(v) > 0;

function fail(res, e) {
  if (e.message === 'PLANTING_NOT_FOUND') return res.status(404).json({ success: false, message: 'Planting not found.' });
  if (e.message === 'INPUT_NOT_FOUND') return res.status(404).json({ success: false, message: 'Farm input not found.' });
  if (e.message === 'NOT_ENOUGH') return res.status(409).json({ success: false, message: 'Not enough stock. Only ' + e.stock + ' left.' });
  console.error(e);
  return res.status(500).json({ success: false, message: 'Server error.' });
}

exports.list = async (req, res) => {
  try { res.status(200).json({ success: true, data: await model.getAll() }); }
  catch (e) { fail(res, e); }
};

exports.getOne = async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid id.' });
    const row = await model.getById(req.params.id);
    if (!row) return res.status(404).json({ success: false, message: 'Usage record not found.' });
    res.status(200).json({ success: true, data: row });
  } catch (e) { fail(res, e); }
};

exports.create = async (req, res) => {
  try {
    const b = req.body || {};
    const qty = Number(b.quantity_used);
    if (!isId(b.planting_id) || !isId(b.input_id) || !DATE.test(b.usage_date || '') || !(qty > 0)) {
      return res.status(400).json({ success: false, message: 'planting_id, input_id, usage_date (YYYY-MM-DD) and quantity_used above 0 are required.' });
    }
    const id = await model.create({ ...b, quantity_used: qty });
    res.status(201).json({ success: true, data: await model.getById(id) });
  } catch (e) { fail(res, e); }
};
