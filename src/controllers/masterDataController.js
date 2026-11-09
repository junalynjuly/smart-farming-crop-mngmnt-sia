import MasterDataModel from '../models/masterDataModel.js';

const MasterDataController = {
    
    listCrops: async (req, res) => {
        try {
            const crops = await MasterDataModel.getAllCrops();
            res.render('master-data/crops/index', { crops, user: req.session.user });
        } catch (error) {
            console.error('Error fetching crops:', error);
            res.status(500).render('error', { message: 'Failed to load crops.' });
        }
    },

    renderAddCropForm: (req, res) => {
        res.render('master-data/crops/add', { error: null, user: req.session.user });
    },

    createCrop: async (req, res) => {
        try {
            const { crop_name, category, days_to_maturity } = req.body;
            
            if (!crop_name || !category || days_to_maturity <= 0) {
                return res.render('master-data/crops/add', { 
                    error: 'All fields are required and days to maturity must be greater than 0.',
                    user: req.session.user 
                });
            }

            await MasterDataModel.createCrop({ crop_name, category, days_to_maturity });
            res.redirect('/crops');
        } catch (error) {
            console.error('Error creating crop:', error);
            res.render('master-data/crops/add', { error: 'Database error or duplicate crop name.', user: req.session.user });
        }
    },

    renderEditCropForm: async (req, res) => {
        try {
            const crop = await MasterDataModel.getCropById(req.params.id);
            if (!crop) return res.status(404).render('error', { message: 'Crop not found.' });
            res.render('master-data/crops/edit', { crop, error: null, user: req.session.user });
        } catch (error) {
            res.status(500).render('error', { message: 'Error loading edit form.' });
        }
    },

    updateCrop: async (req, res) => {
        try {
            const { crop_name, category, days_to_maturity } = req.body;
            await MasterDataModel.updateCrop(req.params.id, { crop_name, category, days_to_maturity });
            res.redirect('/crops');
        } catch (error) {
            res.status(500).render('error', { message: 'Failed to update crop.' });
        }
    },

    deleteCrop: async (req, res) => {
        try {
            await MasterDataModel.deleteCrop(req.params.id);
            res.redirect('/crops');
        } catch (error) {
            res.redirect('/crops?error=Cannot delete crop because it is referenced in plantings.');
        }
    },

    listFields: async (req, res) => {
        try {
            const fields = await MasterDataModel.getAllFields();
            const error = req.query.error || null;
            res.render('master-data/fields/index', { fields, error, user: req.session.user });
        } catch (error) {
            console.error('Error fetching fields:', error);
            res.status(500).render('error', { message: 'Failed to load fields.' });
        }
    },

    renderAddFieldForm: async (req, res) => {
        try {
            const farms = await MasterDataModel.getAllFarms();
            res.render('master-data/fields/add', { farms, error: null, user: req.session.user });
        } catch (error) {
            res.status(500).render('error', { message: 'Failed to load form dependencies.' });
        }
    },

    createField: async (req, res) => {
        try {
            const { field_name, farm_id, area_hectares, soil_type, status } = req.body;
            const farms = await MasterDataModel.getAllFarms();

            if (!field_name || !farm_id || area_hectares <= 0) {
                return res.render('master-data/fields/add', { 
                    farms, 
                    error: 'Field name, farm, and area (> 0) are required.', 
                    user: req.session.user 
                });
            }

            const existing = await MasterDataModel.getFieldByNameAndFarm(field_name, farm_id);
            if (existing) {
                return res.render('master-data/fields/add', { 
                    farms, 
                    error: 'A field with this name already exists in this farm.', 
                    user: req.session.user 
                });
            }

            await MasterDataModel.createField({ field_name, farm_id, area_hectares, soil_type, status });
            res.redirect('/fields');
        } catch (error) {
            console.error('Error creating field:', error);
            res.status(500).render('error', { message: 'Server error while saving field.' });
        }
    },

    renderEditFieldForm: async (req, res) => {
        try {
            const field = await MasterDataModel.getFieldById(req.params.id);
            const farms = await MasterDataModel.getAllFarms();
            if (!field) return res.status(404).render('error', { message: 'Field not found.' });
            res.render('master-data/fields/edit', { field, farms, error: null, user: req.session.user });
        } catch (error) {
            res.status(500).render('error', { message: 'Error loading edit form.' });
        }
    },

    updateField: async (req, res) => {
        try {
            const { field_name, farm_id, area_hectares, soil_type, status } = req.body;
            await MasterDataModel.updateField(req.params.id, { field_name, farm_id, area_hectares, soil_type, status });
            res.redirect('/fields');
        } catch (error) {
            res.status(500).render('error', { message: 'Failed to update field.' });
        }
    },

    deleteField: async (req, res) => {
        try {
            await MasterDataModel.deleteField(req.params.id);
            res.redirect('/fields');
        } catch (error) {
            // Friendly message when foreign key constraint (plantings) blocks deletion
            res.redirect('/fields?error=Cannot delete field because active or past plantings are linked to it.');
        }
    },

    listInputs: async (req, res) => {
        try {
            const inputs = await MasterDataModel.getAllInputs();
            res.render('master-data/farm-inputs/index', { inputs, user: req.session.user });
        } catch (error) {
            console.error('Error fetching farm inputs:', error);
            res.status(500).render('error', { message: 'Failed to load farm inputs.' });
        }
    },

    renderAddInputForm: (req, res) => {
        res.render('master-data/farm-inputs/add', { error: null, user: req.session.user });
    },

    createInput: async (req, res) => {
        try {
            const { input_name, category, unit, stock_quantity, reorder_level } = req.body;
            if (!input_name || stock_quantity < 0) {
                return res.render('master-data/farm-inputs/add', { error: 'Valid input name and non-negative stock are required.', user: req.session.user });
            }
            await MasterDataModel.createInput({ input_name, category, unit, stock_quantity, reorder_level });
            res.redirect('/farm-inputs');
        } catch (error) {
            res.status(500).render('error', { message: 'Failed to create farm input.' });
        }
    },

    renderEditInputForm: async (req, res) => {
        try {
            const input = await MasterDataModel.getInputById(req.params.id);
            if (!input) return res.status(404).render('error', { message: 'Farm input not found.' });
            res.render('master-data/farm-inputs/edit', { input, error: null, user: req.session.user });
        } catch (error) {
            res.status(500).render('error', { message: 'Error loading edit form.' });
        }
    },

    updateInput: async (req, res) => {
        try {
            const { input_name, category, unit, stock_quantity, reorder_level } = req.body;
            await MasterDataModel.updateInput(req.params.id, { input_name, category, unit, stock_quantity, reorder_level });
            res.redirect('/farm-inputs');
        } catch (error) {
            res.status(500).render('error', { message: 'Failed to update farm input.' });
        }
    },

    deleteInput: async (req, res) => {
        try {
            await MasterDataModel.deleteInput(req.params.id);
            res.redirect('/farm-inputs');
        } catch (error) {
            res.redirect('/farm-inputs?error=Cannot delete input because it has been used in transactions.');
        }
    },

    renderIdleFieldsReport: async (req, res) => {
        try {
            const idleFields = await MasterDataModel.getIdleFieldsReport();
            res.render('reports/idle-fields', { idleFields, user: req.session.user });
        } catch (error) {
            console.error('Error generating idle fields report:', error);
            res.status(500).render('error', { message: 'Failed to generate idle fields report.' });
        }
    }
};

export default MasterDataController;