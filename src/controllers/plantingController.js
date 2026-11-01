const model = require('../models/plantingModel');

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const STATUSES = ['Active', 'Harvested', 'Failed'];
const isId = (v) => Number.isInteger(Number(v)) && Number(v) > 0;

function fail(res, e) {
  const known = {
    NOT_FOUND: [404, 'Planting not found.'],
    FIELD_NOT_FOUND: [400, 'That field does not exist.'],
    CROP_NOT_FOUND: [400, 'That crop does not exist.'],
    FIELD_BUSY: [409, 'That field already has an active planting.']
  };
  if (known[e.message]) return res.status(known[e.message][0]).json({ success: false, message: known[e.message][1] });
  if (e.errno === 1451) return res.status(409).json({ success: false, message: 'Cannot delete: this planting has harvest or input usage records.' });
  if (e.errno === 1452) return res.status(400).json({ success: false, message: 'Invalid field or crop.' });
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
    if (!row) return res.status(404).json({ success: false, message: 'Planting not found.' });
    res.status(200).json({ success: true, data: row });
  } catch (e) { fail(res, e); }
};

exports.create = async (req, res) => {
  try {
    const b = req.body || {};
    if (!isId(b.field_id) || !isId(b.crop_id) || !DATE.test(b.planting_date || '')) {
      return res.status(400).json({ success: false, message: 'field_id, crop_id and planting_date (YYYY-MM-DD) are required.' });
    }
    const id = await model.create(b);
    res.status(201).json({ success: true, data: await model.getById(id) });
  } catch (e) { fail(res, e); }
};

exports.update = async (req, res) => {
  try {
    const b = req.body || {};
    if (!isId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid id.' });
    if (!isId(b.crop_id) || !DATE.test(b.planting_date || '') || !STATUSES.includes(b.status)) {
      return res.status(400).json({ success: false, message: 'crop_id, planting_date and a valid status are required.' });
    }
    if (b.expected_harvest_date && (!DATE.test(b.expected_harvest_date) || b.expected_harvest_date < b.planting_date)) {
      return res.status(400).json({ success: false, message: 'expected_harvest_date must be a valid date on or after planting_date.' });
    }
    await model.update(req.params.id, b);
    res.status(200).json({ success: true, data: await model.getById(req.params.id) });
  } catch (e) { fail(res, e); }
};

exports.remove = async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid id.' });
    await model.remove(req.params.id);
    res.status(200).json({ success: true, message: 'Planting deleted.' });
  } catch (e) { fail(res, e); }
};
