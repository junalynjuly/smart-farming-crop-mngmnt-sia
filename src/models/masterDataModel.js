const db = require('../config/db');

const MasterDataModel = {

    getAllCrops: async () => {
        const [rows] = await db.promise().query('SELECT * FROM crops ORDER BY crop_name');
        return rows;
    },

    getCropById: async (id) => {
        const [rows] = await db.promise().query('SELECT * FROM crops WHERE crop_id = ?', [id]);
        return rows[0];
    },

    createCrop: async (data) => {
        const { crop_name, category, days_to_maturity } = data;
        const [result] = await db.promise().query(
            'INSERT INTO crops (crop_name, category, days_to_maturity) VALUES (?, ?, ?)',
            [crop_name, category, days_to_maturity]
        );
        return result.insertId;
    },

    updateCrop: async (id, data) => {
        const { crop_name, category, days_to_maturity } = data;
        await db.promise().query(
            'UPDATE crops SET crop_name = ?, category = ?, days_to_maturity = ? WHERE crop_id = ?',
            [crop_name, category, days_to_maturity, id]
        );
    },

    deleteCrop: async (id) => {
        await db.promise().query('DELETE FROM crops WHERE crop_id = ?', [id]);
    },

    getAllFields: async () => {
        const query = `
            SELECT f.*, fm.farm_name 
            FROM fields f
            JOIN farms fm ON f.farm_id = fm.farm_id
            ORDER BY f.field_name
        `;
        const [rows] = await db.promise().query(query);
        return rows;
    },

    getFieldById: async (id) => {
        const [rows] = await db.promise().query('SELECT * FROM fields WHERE field_id = ?', [id]);
        return rows[0];
    },

    getFieldByNameAndFarm: async (fieldName, farmId) => {
        const [rows] = await db.promise().query(
            'SELECT * FROM fields WHERE field_name = ? AND farm_id = ?',
            [fieldName, farmId]
        );
        return rows[0];
    },

    createField: async (data) => {
        const { field_name, farm_id, area_hectares, soil_type, status } = data;
        const [result] = await db.promise().query(
            'INSERT INTO fields (field_name, farm_id, area_hectares, soil_type, status) VALUES (?, ?, ?, ?, ?)',
            [field_name, farm_id, area_hectares, soil_type, status || 'Idle']
        );
        return result.insertId;
    },

    updateField: async (id, data) => {
        const { field_name, farm_id, area_hectares, soil_type, status } = data;
        await db.promise().query(
            'UPDATE fields SET field_name = ?, farm_id = ?, area_hectares = ?, soil_type = ?, status = ? WHERE field_id = ?',
            [field_name, farm_id, area_hectares, soil_type, status, id]
        );
    },

    deleteField: async (id) => {
        await db.promise().query('DELETE FROM fields WHERE field_id = ?', [id]);
    },

    getAllInputs: async () => {
        const [rows] = await db.promise().query('SELECT * FROM farm_inputs ORDER BY input_name');
        return rows;
    },

    getInputById: async (id) => {
        const [rows] = await db.promise().query('SELECT * FROM farm_inputs WHERE input_id = ?', [id]);
        return rows[0];
    },

    createInput: async (data) => {
        const { input_name, category, unit, stock_quantity, reorder_level } = data;
        const [result] = await db.promise().query(
            'INSERT INTO farm_inputs (input_name, category, unit, stock_quantity, reorder_level) VALUES (?, ?, ?, ?, ?)',
            [input_name, category, unit, stock_quantity, reorder_level]
        );
        return result.insertId;
    },

    updateInput: async (id, data) => {
        const { input_name, category, unit, stock_quantity, reorder_level } = data;
        await db.promise().query(
            'UPDATE farm_inputs SET input_name = ?, category = ?, unit = ?, stock_quantity = ?, reorder_level = ? WHERE input_id = ?',
            [input_name, category, unit, stock_quantity, reorder_level, id]
        );
    },

    deleteInput: async (id) => {
        await db.promise().query('DELETE FROM farm_inputs WHERE input_id = ?', [id]);
    },

    getIdleFieldsReport: async () => {
        const query = `
            SELECT 
                f.field_id,
                f.field_name,
                f.area_hectares,
                f.soil_type,
                f.status,
                fm.farm_name
            FROM fields f
            JOIN farms fm ON f.farm_id = fm.farm_id
            LEFT JOIN plantings p 
                ON f.field_id = p.field_id 
               AND p.status = 'Active'
            WHERE p.planting_id IS NULL
            ORDER BY f.field_name;
        `;
        const [rows] = await db.promise().query(query);
        return rows;
    },

    getAllFarms: async () => {
        const [rows] = await db.promise().query('SELECT farm_id, farm_name FROM farms ORDER BY farm_name');
        return rows;
    }
};

export default MasterDataModel;