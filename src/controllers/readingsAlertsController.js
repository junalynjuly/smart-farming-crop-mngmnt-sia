const db = require('../config/db');

exports.getReport = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT sr.reading_id, sr.field_id, sr.metric, sr.value, sr.reading_time,
              a.alert_id, a.severity, a.message, a.status
       FROM sensor_readings sr
       LEFT JOIN alerts a ON a.reading_id = sr.reading_id
       ORDER BY sr.reading_time DESC`
    );
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
