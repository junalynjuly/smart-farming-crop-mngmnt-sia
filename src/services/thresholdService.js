const db = require('../config/db');
const alertModel = require('../models/alertModel');
const auditLogModel = require('../models/auditLogModel');

// Severity depends on how far the value is outside the allowed range
function getSeverity(value, min, max) {
  const range = max - min || 1;
  const gap = value < min ? min - value : value - max;
  const ratio = gap / range;
  if (ratio >= 0.5) return 'High';
  if (ratio >= 0.2) return 'Medium';
  return 'Low';
}

// Check one reading against the threshold of the active crop in that field
async function checkReading(reading) {
  const [rows] = await db.query(
    `SELECT ct.threshold_id, ct.min_value, ct.max_value
     FROM plantings p
     JOIN crop_thresholds ct ON ct.crop_id = p.crop_id AND ct.metric = ?
     WHERE p.field_id = ? AND p.status = 'Active'
     LIMIT 1`,
    [reading.metric, reading.field_id]
  );
  if (rows.length === 0) return null; // no active planting or no threshold

  const { threshold_id, min_value, max_value } = rows[0];
  const value = Number(reading.value);
  const min = Number(min_value);
  const max = Number(max_value);
  if (value >= min && value <= max) return null; // normal

  const direction = value < min ? 'below minimum' : 'above maximum';
  const limit = value < min ? min : max;
  const message = `${reading.metric} ${value} ${direction} (${limit}).`;

  const alert = await alertModel.create({
    field_id: reading.field_id,
    reading_id: reading.reading_id,
    threshold_id,
    severity: getSeverity(value, min, max),
    message
  });

  await auditLogModel.log({
    user_id: null,
    action: 'AUTO_ALERT',
    table_name: 'alerts',
    record_id: alert.alert_id,
    details: message
  });

  return alert;
}

module.exports = { checkReading, getSeverity };
