<<<<<<< HEAD
<<<<<<< HEAD
-- Create Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Farms Table
CREATE TABLE IF NOT EXISTS farms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    farm_name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Crops Table
CREATE TABLE IF NOT EXISTS crops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    planting_date DATE,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Crop Logs Table
CREATE TABLE IF NOT EXISTS crop_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    crop_id INT NOT NULL,
    log_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    soil_moisture FLOAT,
    temperature FLOAT,
    humidity FLOAT,
    notes TEXT,
    FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE
);

-- Create Care Tasks Table
CREATE TABLE IF NOT EXISTS care_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_name VARCHAR(150) NOT NULL,
    description TEXT,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
=======
CREATE TABLE IF NOT EXISTS crops (
    crop_id INT AUTO_INCREMENT PRIMARY KEY,
    crop_name VARCHAR(100) NOT NULL,
    crop_type VARCHAR(50) NOT NULL,
    variety VARCHAR(100),
    growth_duration_days INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
=======

-- =========================================================
-- SMART FARMING AND CROP MANAGEMENT SYSTEM
---- Approved combined schema: 17 tables
-- Group-approved version; tested in smart_farming_test
-- MySQL 8.0+
-- =========================================================

-- 1. ROLES
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) DEFAULT NULL
>>>>>>> main
);

-- 2. USERS
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) DEFAULT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id) REFERENCES roles(id)
        ON DELETE SET NULL
);

-- 3. FARMS
CREATE TABLE IF NOT EXISTS farms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    farm_name VARCHAR(100) NOT NULL,
    location VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_farms_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- 4. CROPS
CREATE TABLE IF NOT EXISTS crops (
    crop_id INT AUTO_INCREMENT PRIMARY KEY,
    crop_name VARCHAR(80) NOT NULL UNIQUE,
    category ENUM(
        'Cereal', 'Vegetable', 'Fruit', 'Legume', 'Root crop'
    ) NOT NULL,
    days_to_maturity INT NOT NULL,
    expected_yield_kg_ha DECIMAL(10,2) DEFAULT NULL,
    CONSTRAINT crops_chk_1 CHECK (days_to_maturity > 0),
    CONSTRAINT crops_chk_2 CHECK (
        expected_yield_kg_ha IS NULL
        OR expected_yield_kg_ha > 0
    )
);

-- 5. FIELDS
CREATE TABLE IF NOT EXISTS fields (
    field_id INT AUTO_INCREMENT PRIMARY KEY,
    farm_id INT NOT NULL,
    field_name VARCHAR(80) NOT NULL,
    area_ha DECIMAL(8,2) NOT NULL,
    soil_type ENUM(
        'Clay', 'Loam', 'Sandy', 'Sandy loam', 'Silt'
    ) NOT NULL,
    status ENUM('Available', 'Planted', 'Fallow')
        NOT NULL DEFAULT 'Available',
    UNIQUE KEY uq_field_per_farm (farm_id, field_name),
    CONSTRAINT fk_fields_farm
        FOREIGN KEY (farm_id) REFERENCES farms(id),
    CONSTRAINT fields_chk_1 CHECK (area_ha > 0)
);

-- 6. FARM INPUTS
CREATE TABLE IF NOT EXISTS farm_inputs (
    input_id INT AUTO_INCREMENT PRIMARY KEY,
    input_name VARCHAR(100) NOT NULL UNIQUE,
    input_type ENUM(
        'Seed', 'Fertilizer', 'Pesticide', 'Other'
    ) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    stock_qty DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    reorder_level DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    CONSTRAINT farm_inputs_chk_1 CHECK (stock_qty >= 0),
    CONSTRAINT farm_inputs_chk_2 CHECK (reorder_level >= 0)
);

-- 7. CROP GROWTH STAGES
CREATE TABLE IF NOT EXISTS crop_growth_stages (
    stage_id INT AUTO_INCREMENT PRIMARY KEY,
    crop_id INT NOT NULL,
    stage_name VARCHAR(60) NOT NULL,
    stage_order INT NOT NULL,
    start_day INT NOT NULL,
    end_day INT NOT NULL,
    CONSTRAINT uq_stage_order UNIQUE (crop_id, stage_order),
    CONSTRAINT fk_stage_crop
        FOREIGN KEY (crop_id) REFERENCES crops(crop_id),
    CONSTRAINT crop_growth_stages_chk_1
        CHECK (end_day >= start_day),
    CONSTRAINT crop_growth_stages_chk_2
        CHECK (stage_order > 0),
    CONSTRAINT crop_growth_stages_chk_3
        CHECK (start_day >= 0)
);

-- 8. CROP THRESHOLDS
CREATE TABLE IF NOT EXISTS crop_thresholds (
    threshold_id INT AUTO_INCREMENT PRIMARY KEY,
    crop_id INT NOT NULL,
    metric ENUM('soil_moisture', 'temperature', 'ph') NOT NULL,
    min_value DECIMAL(6,2) NOT NULL,
    max_value DECIMAL(6,2) NOT NULL,
    CONSTRAINT uq_threshold UNIQUE (crop_id, metric),
    CONSTRAINT fk_threshold_crop
        FOREIGN KEY (crop_id) REFERENCES crops(crop_id),
    CONSTRAINT crop_thresholds_chk_1
        CHECK (max_value >= min_value)
);

-- 9. PLANTINGS
CREATE TABLE IF NOT EXISTS plantings (
    planting_id INT AUTO_INCREMENT PRIMARY KEY,
    field_id INT NOT NULL,
    crop_id INT NOT NULL,
    planted_by INT DEFAULT NULL,
    planting_date DATE NOT NULL,
    expected_harvest_date DATE DEFAULT NULL,
    current_stage_id INT DEFAULT NULL,
    status ENUM('Active', 'Harvested', 'Failed')
        NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
<<<<<<< HEAD
    FOREIGN KEY (farm_id) REFERENCES farms(farm_id) ON DELETE CASCADE
>>>>>>> origin/main
);
=======
    CONSTRAINT chk_harvest_after_planting CHECK (
        expected_harvest_date IS NULL
        OR expected_harvest_date >= planting_date
    ),
    CONSTRAINT fk_planting_field
        FOREIGN KEY (field_id) REFERENCES fields(field_id),
    CONSTRAINT fk_planting_crop
        FOREIGN KEY (crop_id) REFERENCES crops(crop_id),
    CONSTRAINT fk_planting_user
        FOREIGN KEY (planted_by) REFERENCES users(id),
    CONSTRAINT fk_planting_stage
        FOREIGN KEY (current_stage_id)
        REFERENCES crop_growth_stages(stage_id)
);

-- 10. HARVESTS
CREATE TABLE IF NOT EXISTS harvests (
    harvest_id INT AUTO_INCREMENT PRIMARY KEY,
    planting_id INT NOT NULL,
    harvest_date DATE NOT NULL,
    quantity_kg DECIMAL(10,2) NOT NULL,
    quality_grade ENUM('A', 'B', 'C') NOT NULL,
    recorded_by INT NOT NULL,
    CONSTRAINT fk_harvest_planting
        FOREIGN KEY (planting_id) REFERENCES plantings(planting_id),
    CONSTRAINT fk_harvest_user
        FOREIGN KEY (recorded_by) REFERENCES users(id),
    CONSTRAINT harvests_chk_1 CHECK (quantity_kg > 0)
);

-- 11. INPUT USAGE
CREATE TABLE IF NOT EXISTS input_usage (
    usage_id INT AUTO_INCREMENT PRIMARY KEY,
    planting_id INT NOT NULL,
    input_id INT NOT NULL,
    quantity_used DECIMAL(10,2) NOT NULL,
    usage_date DATE NOT NULL,
    used_by INT NOT NULL,
    CONSTRAINT fk_usage_planting
        FOREIGN KEY (planting_id) REFERENCES plantings(planting_id),
    CONSTRAINT fk_usage_input
        FOREIGN KEY (input_id) REFERENCES farm_inputs(input_id),
    CONSTRAINT fk_usage_user
        FOREIGN KEY (used_by) REFERENCES users(id),
    CONSTRAINT input_usage_chk_1 CHECK (quantity_used > 0)
);

-- 12. CARE TASKS
CREATE TABLE IF NOT EXISTS care_tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    planting_id INT NOT NULL,
    task_type ENUM(
        'Irrigation', 'Fertilizing', 'Pest control', 'Weeding', 'Other'
    ) NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('Pending', 'Done', 'Skipped', 'Overdue')
        NOT NULL DEFAULT 'Pending',
    source ENUM('Manual', 'Auto') NOT NULL DEFAULT 'Manual',
    skip_reason VARCHAR(255) DEFAULT NULL,
    assigned_to INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_task_planting
        FOREIGN KEY (planting_id) REFERENCES plantings(planting_id),
    CONSTRAINT fk_task_user
        FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- 13. SENSOR READINGS
CREATE TABLE IF NOT EXISTS sensor_readings (
    reading_id INT AUTO_INCREMENT PRIMARY KEY,
    field_id INT NOT NULL,
    planting_id INT DEFAULT NULL,
    sensor_type ENUM('Soil Moisture', 'Temperature', 'pH') NOT NULL,
    reading_value DECIMAL(8,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reading_field
        FOREIGN KEY (field_id) REFERENCES fields(field_id),
    CONSTRAINT fk_reading_planting
        FOREIGN KEY (planting_id) REFERENCES plantings(planting_id)
);

-- 14. ALERTS
CREATE TABLE IF NOT EXISTS alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    field_id INT NOT NULL,
    reading_id INT DEFAULT NULL,
    alert_type VARCHAR(80) NOT NULL,
    message VARCHAR(255) NOT NULL,
    severity ENUM('Low', 'Medium', 'High')
        NOT NULL DEFAULT 'Medium',
    status ENUM('Open', 'Acknowledged', 'Resolved')
        NOT NULL DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_alert_field
        FOREIGN KEY (field_id) REFERENCES fields(field_id),
    CONSTRAINT fk_alert_reading
        FOREIGN KEY (reading_id)
        REFERENCES sensor_readings(reading_id)
);

-- 15. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id INT DEFAULT NULL,
    details TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL
);

-- 16. WEATHER LOGS
CREATE TABLE IF NOT EXISTS weather_logs (
    weather_id INT AUTO_INCREMENT PRIMARY KEY,
    farm_id INT NOT NULL,
    field_id INT DEFAULT NULL,
    temperature_c DECIMAL(5,2) DEFAULT NULL,
    humidity_pct DECIMAL(5,2) DEFAULT NULL,
    rainfall_mm DECIMAL(7,2) DEFAULT NULL,
    wind_speed_kph DECIMAL(6,2) DEFAULT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_weather_farm
        FOREIGN KEY (farm_id) REFERENCES farms(id),
    CONSTRAINT fk_weather_field
        FOREIGN KEY (field_id) REFERENCES fields(field_id)
);

-- 17. PEST REPORTS
CREATE TABLE IF NOT EXISTS pest_reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    field_id INT NOT NULL,
    planting_id INT DEFAULT NULL,
    reported_by INT DEFAULT NULL,
    pest_name VARCHAR(100) NOT NULL,
    description TEXT DEFAULT NULL,
    severity ENUM('Low', 'Medium', 'High')
        NOT NULL DEFAULT 'Medium',
    report_date DATE NOT NULL,
    status ENUM('Reported', 'Monitoring', 'Treated', 'Resolved')
        NOT NULL DEFAULT 'Reported',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pest_field
        FOREIGN KEY (field_id) REFERENCES fields(field_id),
    CONSTRAINT fk_pest_planting
        FOREIGN KEY (planting_id) REFERENCES plantings(planting_id),
    CONSTRAINT fk_pest_user
        FOREIGN KEY (reported_by) REFERENCES users(id)
        ON DELETE SET NULL
);
>>>>>>> main
