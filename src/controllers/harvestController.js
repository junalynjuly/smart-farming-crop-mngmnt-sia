const model = require('../models/harvestModel');

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const isId = (v) => Number.isInteger(Number(v)) && Number(v) > 0;

function fail(res, e) {
  if (e.message === 'PLANTING_NOT_FOUND') return res.status(404).json({ success: false, message: 'Planting not found.' });
  if (e.message === 'NOT_ACTIVE') return res.status(409).json({ success: false, message: 'That planting is not Active, so it cannot be harvested.' });
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
    if (!row) return res.status(404).json({ success: false, message: 'Harvest not found.' });
    res.status(200).json({ success: true, data: row });
  } catch (e) { fail(res, e); }
};

exports.create = async (req, res) => {
  try {
    const b = req.body || {};
    const qty = Number(b.quantity_kg);
    if (!isId(b.planting_id) || !DATE.test(b.harvest_date || '') || !(qty > 0) || !['A', 'B', 'C'].includes(b.quality_grade)) {
      return res.status(400).json({ success: false, message: 'planting_id, harvest_date (YYYY-MM-DD), quantity_kg above 0 and quality_grade (A, B or C) are required.' });
    }
    const id = await model.create({ ...b, quantity_kg: qty });
    res.status(201).json({ success: true, data: await model.getById(id) });
  } catch (e) { fail(res, e); }
};
