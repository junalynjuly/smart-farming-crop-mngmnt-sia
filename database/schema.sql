CREATE TABLE IF NOT EXISTS crops (
    crop_id INT AUTO_INCREMENT PRIMARY KEY,
    crop_name VARCHAR(100) NOT NULL,
    crop_type VARCHAR(50) NOT NULL,
    variety VARCHAR(100),
    growth_duration_days INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fields (
    field_id INT AUTO_INCREMENT PRIMARY KEY,
    farm_id INT NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    area_size DECIMAL(10,2) NOT NULL,
    area_unit VARCHAR(20) DEFAULT 'sqm',
    soil_type VARCHAR(50),
    location_description VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(farm_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS farm_inputs (
    input_id INT AUTO_INCREMENT PRIMARY KEY,
    farm_id INT NOT NULL,
    input_name VARCHAR(100) NOT NULL,
    input_type VARCHAR(50) NOT NULL,
    quantity DECIMAL(10,2) DEFAULT 0,
    unit VARCHAR(30) NOT NULL,
    unit_price DECIMAL(10,2) DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(farm_id) ON DELETE CASCADE
);