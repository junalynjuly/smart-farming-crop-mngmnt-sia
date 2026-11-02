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
);