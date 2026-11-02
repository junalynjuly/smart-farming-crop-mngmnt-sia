CREATE TABLE IF NOT EXISTS plantings (
  planting_id INT AUTO_INCREMENT PRIMARY KEY,
  field_id INT NOT NULL,
  crop_id INT NOT NULL,
  planted_by INT NULL,
  planting_date DATE NOT NULL,
  expected_harvest_date DATE NULL,
  status ENUM('Active','Harvested','Failed') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_harvest_after_planting CHECK (expected_harvest_date IS NULL OR expected_harvest_date >= planting_date),
  CONSTRAINT fk_planting_field FOREIGN KEY (field_id) REFERENCES fields(field_id),
  CONSTRAINT fk_planting_crop FOREIGN KEY (crop_id) REFERENCES crops(crop_id)
);

CREATE TABLE IF NOT EXISTS harvests (
  harvest_id INT AUTO_INCREMENT PRIMARY KEY,
  planting_id INT NOT NULL,
  harvest_date DATE NOT NULL,
  quantity_kg DECIMAL(10,2) NOT NULL CHECK (quantity_kg > 0),
  quality_grade ENUM('A','B','C') NOT NULL,
  recorded_by INT NULL,
  CONSTRAINT fk_harvest_planting FOREIGN KEY (planting_id) REFERENCES plantings(planting_id)
);

CREATE TABLE IF NOT EXISTS input_usage (
  usage_id INT AUTO_INCREMENT PRIMARY KEY,
  planting_id INT NOT NULL,
  input_id INT NOT NULL,
  quantity_used DECIMAL(10,2) NOT NULL CHECK (quantity_used > 0),
  usage_date DATE NOT NULL,
  used_by INT NULL,
  CONSTRAINT fk_usage_planting FOREIGN KEY (planting_id) REFERENCES plantings(planting_id),
  CONSTRAINT fk_usage_input FOREIGN KEY (input_id) REFERENCES farm_inputs(input_id)
);
