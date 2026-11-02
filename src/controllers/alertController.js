const alertModel = require('../models/alertModel');
const auditLogModel = require('../models/auditLogModel');

exports.getAll = async (req, res) => {
  try {
    const data = await alertModel.getAll();
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const alert = await alertModel.getById(req.params.id);
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
    res.status(200).json({ success: true, data: alert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { field_id, severity, message } = req.body;
    if (!field_id || !severity || !message) {
      return res.status(400).json({ success: false, message: 'field_id, severity and message are required' });
    }
    if (!alertModel.SEVERITIES.includes(severity)) {
      return res.status(400).json({ success: false, message: 'severity must be Low, Medium or High' });
    }
    const alert = await alertModel.create(req.body);
    await auditLogModel.log({
      user_id: req.body.user_id || null, action: 'INSERT', table_name: 'alerts',
      record_id: alert.alert_id, details: 'Alert created manually'
    });
    res.status(201).json({ success: true, data: alert });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ success: false, message: 'Invalid field_id, reading_id, threshold_id or task_id' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { severity, status } = req.body;
    if (severity && !alertModel.SEVERITIES.includes(severity)) {
      return res.status(400).json({ success: false, message: 'severity must be Low, Medium or High' });
    }
    if (status && !alertModel.STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'status must be Open, Acknowledged or Resolved' });
    }
    const alert = await alertModel.update(req.params.id, req.body);
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
    await auditLogModel.log({
      user_id: req.body.user_id || null, action: 'UPDATE', table_name: 'alerts',
      record_id: alert.alert_id, details: 'Alert updated'
    });
    res.status(200).json({ success: true, data: alert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const ok = await alertModel.remove(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Alert not found' });
    await auditLogModel.log({
      user_id: null, action: 'DELETE', table_name: 'alerts',
      record_id: Number(req.params.id), details: 'Alert deleted'
    });
    res.status(200).json({ success: true, message: 'Alert deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
