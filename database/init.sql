-- ============================================================
-- CivicTrack – MySQL Database Schema & Initial Seed Data
-- ============================================================

CREATE DATABASE IF NOT EXISTS civictrack_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE civictrack_db;

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    contact_email VARCHAR(150),
    contact_phone VARCHAR(20),
    head_officer VARCHAR(120),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    mobile VARCHAR(20),
    role ENUM('citizen', 'admin', 'department') DEFAULT 'citizen',
    department_id INT NULL,
    photo_url VARCHAR(255) NULL,
    auth_provider VARCHAR(50) DEFAULT 'local',
    firebase_uid VARCHAR(128) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 3. Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tracking_id VARCHAR(40) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NULL,
    longitude DECIMAL(11, 8) NULL,
    image_url VARCHAR(255) NULL,
    status ENUM('pending', 'in-progress', 'resolved', 'rejected') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    submitted_by VARCHAR(150) NOT NULL,
    citizen_id INT NULL,
    department_id INT NULL,
    assigned_officer VARCHAR(150) NULL,
    admin_remarks TEXT NULL,
    resolved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (citizen_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 4. Complaint Timeline Table
CREATE TABLE IF NOT EXISTS complaint_timeline (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id INT NOT NULL,
    stage VARCHAR(80) NOT NULL,
    note TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    action_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id INT NOT NULL,
    citizen_id INT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    FOREIGN KEY (citizen_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- SEED DATA
-- ============================================================

-- Seed Departments
INSERT INTO departments (name, code, description, contact_email, head_officer) VALUES
('Roads & Infrastructure', 'ROADS', 'Management of potholes, asphalt resurfacing, and sidewalks', 'roads@civictrack.gov.in', 'Rajesh Kumar'),
('Electrical Department', 'ELEC', 'Streetlights, power distribution nodes, and electric infrastructure', 'elec@civictrack.gov.in', 'Vikramaditya Rao'),
('Water Supply Department', 'WATER', 'Municipal pipeline leaks, drainage valves, and water purification', 'water@civictrack.gov.in', 'Priya Sharma'),
('Sanitation Department', 'SANIT', 'Garbage collection, public bins, and solid waste processing', 'sanitation@civictrack.gov.in', 'Suresh Patel'),
('Traffic Control Department', 'TRAFFIC', 'Traffic lights, signal timing, and road junction management', 'traffic@civictrack.gov.in', 'Anand Singh'),
('General Services', 'GEN', 'Public park maintenance, civic signage, and general municipal issues', 'general@civictrack.gov.in', 'Meera Deshmukh')
ON DUPLICATE KEY UPDATE name=name;

-- Seed Users (Password is bcrypt or sha256 for demo accounts: citizen123, admin123, dept123)
-- Using werkzeug/scrypt compatible hashed values or plaintext fallback in migration
INSERT INTO users (full_name, email, password_hash, mobile, role, department_id, auth_provider) VALUES
('System Administrator', 'admin@civictrack.gov.in', 'pbkdf2:sha256:260000$admin123hash$5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '9000000001', 'admin', NULL, 'local'),
('PWD Field Officer', 'pwd@civictrack.gov.in', 'pbkdf2:sha256:260000$dept123hash$5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '9000000002', 'department', 1, 'local'),
('Rahul Verma', 'citizen@example.com', 'pbkdf2:sha256:260000$citizen123hash$5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '9876543210', 'citizen', NULL, 'local'),
('Visahl Rajkumar', 'visahl.rajkumar@gmail.com', 'pbkdf2:sha256:260000$demo123hash$5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '9876543211', 'citizen', NULL, 'google')
ON DUPLICATE KEY UPDATE email=email;

-- Seed Initial Complaints
INSERT INTO complaints (tracking_id, title, category, description, location, status, priority, submitted_by, citizen_id, department_id, assigned_officer) VALUES
('CIV-2024-001', 'Deep pothole on MG Road near Signal', 'Road Damage', 'Deep pothole approximately 2 feet wide on MG Road causing traffic slowdown.', 'MG Road, Near Signal No. 5, Bangalore - 560001', 'in-progress', 'high', 'citizen@example.com', 3, 1, 'Rajesh Kumar'),
('CIV-2024-002', 'Street light not working for 10 days', 'Streetlight', 'Street light junction has not been functioning causing night commuter hazard.', 'Koramangala 4th Block, Bangalore - 560034', 'pending', 'medium', 'citizen@example.com', 3, 2, NULL),
('CIV-2024-003', 'Water leakage from municipal pipe', 'Water Leakage', 'Major underground municipal pipe leaking near HSR Sector 2, water wasted continuously.', 'HSR Layout Sector 2, Bangalore - 560102', 'resolved', 'high', 'citizen@example.com', 3, 3, 'Priya Sharma'),
('CIV-2024-004', 'Clogged drainage causing flooding', 'Drainage', 'Main drainage channel completely clogged with debris causing road overflow.', 'Jayanagar 4th Block, Bangalore - 560041', 'in-progress', 'high', 'citizen@example.com', 3, 4, 'Suresh Patel'),
('CIV-2024-005', 'Garbage not collected for 2 weeks', 'Garbage Collection', 'Waste piling up along Whitefield Main Road creating public hygiene concerns.', 'Whitefield Main Road, Bangalore - 560066', 'pending', 'medium', 'citizen@example.com', 3, 4, NULL),
('CIV-2024-006', 'Traffic signal malfunctioning', 'Traffic Signal', 'Traffic signal stuck on red for all directions causing major junction gridlock.', 'Silk Board Junction, Bangalore - 560068', 'resolved', 'urgent', 'citizen@example.com', 3, 5, 'Anand Singh')
ON DUPLICATE KEY UPDATE tracking_id=tracking_id;

-- Seed Timeline Stages for CIV-2024-001
INSERT INTO complaint_timeline (complaint_id, stage, note, is_completed, action_date) VALUES
(1, 'Submitted', 'Complaint registered successfully by citizen', TRUE, '2024-11-01'),
(1, 'Assigned', 'Assigned to Roads & Infrastructure Department', TRUE, '2024-11-02'),
(1, 'In Progress', 'Field inspection complete; asphalt patching crew dispatched', TRUE, '2024-11-03'),
(1, 'Resolved', 'Awaiting field crew signoff', FALSE, NULL);

-- Seed Timeline Stages for CIV-2024-002
INSERT INTO complaint_timeline (complaint_id, stage, note, is_completed, action_date) VALUES
(2, 'Submitted', 'Complaint registered successfully by citizen', TRUE, '2024-11-05'),
(2, 'Assigned', 'Pending department allocation', FALSE, NULL),
(2, 'In Progress', 'Work not started', FALSE, NULL),
(2, 'Resolved', 'Pending resolution', FALSE, NULL);

-- Seed Timeline Stages for CIV-2024-003
INSERT INTO complaint_timeline (complaint_id, stage, note, is_completed, action_date) VALUES
(3, 'Submitted', 'Complaint registered successfully by citizen', TRUE, '2024-10-20'),
(3, 'Assigned', 'Assigned to Water Supply Department', TRUE, '2024-10-21'),
(3, 'In Progress', 'Plumbing team replaced ruptured joint', TRUE, '2024-10-22'),
(3, 'Resolved', 'Pipe successfully replaced and pressure verified', TRUE, '2024-10-25');
