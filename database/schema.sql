-- ================================================================
-- STUDENT NUTRITION AND FITNESS TRACKER - DATABASE SCHEMA
-- ================================================================
-- DBMS Project - 4th Semester BSc in ICT
-- 
-- NORMALIZATION: This schema is designed following 3NF principles
-- - 1NF: All attributes contain atomic values, no repeating groups
-- - 2NF: No partial dependencies (all non-key attributes depend on entire primary key)
-- - 3NF: No transitive dependencies (non-key attributes don't depend on other non-key attributes)
-- ================================================================

-- Drop existing database and create fresh
DROP DATABASE IF EXISTS nutrition_tracker;
CREATE DATABASE nutrition_tracker;
USE nutrition_tracker;

-- ================================================================
-- TABLE 1: Department
-- Purpose: Store university departments
-- Normalization: 1NF (atomic values), 2NF & 3NF (no dependencies)
-- ================================================================
CREATE TABLE Department (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- TABLE 2: Batch
-- Purpose: Store batch information for each department
-- Normalization: 
--   - 1NF: Atomic values
--   - 2NF: batch_number + department_id form composite key concept, but we use surrogate key
--   - 3NF: No transitive dependency (department_id directly references Department)
-- ================================================================
CREATE TABLE Batch (
    batch_id INT PRIMARY KEY AUTO_INCREMENT,
    batch_number INT NOT NULL,
    department_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES Department(department_id) ON DELETE CASCADE,
    UNIQUE KEY unique_batch_dept (batch_number, department_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- TABLE 3: Student
-- Purpose: Store student information
-- Normalization:
--   - 1NF: All attributes are atomic
--   - 2NF: All attributes depend on student_id (PK)
--   - 3NF: department_id and batch_id are foreign keys (no transitive dependency)
-- ================================================================
CREATE TABLE Student (
    student_id VARCHAR(20) PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    department_id INT NOT NULL,
    batch_id INT NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES Department(department_id) ON DELETE RESTRICT,
    FOREIGN KEY (batch_id) REFERENCES Batch(batch_id) ON DELETE RESTRICT,
    INDEX idx_department (department_id),
    INDEX idx_batch (batch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- TABLE 4: FoodCategory
-- Purpose: Categorize food items (Breakfast, Lunch/Dinner, Bharta, Snacks)
-- Normalization: 1NF, 2NF, 3NF (simple lookup table)
-- ================================================================
CREATE TABLE FoodCategory (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- TABLE 5: FoodItem
-- Purpose: Store menu items with pricing and nutritional information
-- Normalization:
--   - 1NF: All attributes atomic (calories, protein, carbs, fat are single values)
--   - 2NF: All nutritional attributes depend on food_item_id (PK)
--   - 3NF: category_id is FK (no transitive dependency)
-- ================================================================
CREATE TABLE FoodItem (
    food_item_id INT PRIMARY KEY AUTO_INCREMENT,
    food_name VARCHAR(100) NOT NULL,
    category_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    calories DECIMAL(10, 2) NOT NULL COMMENT 'Calories in kcal',
    protein DECIMAL(10, 2) NOT NULL COMMENT 'Protein in grams',
    carbs DECIMAL(10, 2) NOT NULL COMMENT 'Carbohydrates in grams',
    fat DECIMAL(10, 2) NOT NULL COMMENT 'Fat in grams',
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES FoodCategory(category_id) ON DELETE RESTRICT,
    INDEX idx_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- TABLE 6: Invoice
-- Purpose: Store purchase transactions from canteen
-- Normalization:
--   - 1NF: Atomic values (totals are calculated, not derived arrays)
--   - 2NF: All attributes depend on invoice_id
--   - 3NF: student_id is FK, created_by stores user role (normalized reference)
-- Note: Total values are denormalized for performance (acceptable trade-off)
-- ================================================================
CREATE TABLE Invoice (
    invoice_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(20) NOT NULL,
    created_by VARCHAR(50) NOT NULL COMMENT 'User role: canteen_staff, teacher, medical',
    total_price DECIMAL(10, 2) NOT NULL,
    total_calories DECIMAL(10, 2) NOT NULL,
    total_protein DECIMAL(10, 2) NOT NULL,
    total_carbs DECIMAL(10, 2) NOT NULL,
    total_fat DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE CASCADE,
    INDEX idx_student (student_id),
    INDEX idx_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- TABLE 7: InvoiceDetails
-- Purpose: Store line items for each invoice (many-to-many resolution)
-- Normalization:
--   - 1NF: Atomic values
--   - 2NF: Attributes depend on composite key (invoice_id + food_item_id)
--   - 3NF: No transitive dependencies
-- This table resolves many-to-many relationship between Invoice and FoodItem
-- ================================================================
CREATE TABLE InvoiceDetails (
    invoice_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_id INT NOT NULL,
    food_item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    subtotal_price DECIMAL(10, 2) NOT NULL,
    subtotal_calories DECIMAL(10, 2) NOT NULL,
    subtotal_protein DECIMAL(10, 2) NOT NULL,
    subtotal_carbs DECIMAL(10, 2) NOT NULL,
    subtotal_fat DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES Invoice(invoice_id) ON DELETE CASCADE,
    FOREIGN KEY (food_item_id) REFERENCES FoodItem(food_item_id) ON DELETE RESTRICT,
    INDEX idx_invoice (invoice_id),
    INDEX idx_food_item (food_item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- TABLE 8: HealthRecord
-- Purpose: Store student health metrics (height, weight, BMI)
-- Normalization:
--   - 1NF: All attributes atomic
--   - 2NF: All depend on health_record_id
--   - 3NF: student_id is FK, BMI can be calculated but stored for historical tracking
-- ================================================================
CREATE TABLE HealthRecord (
    health_record_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(20) NOT NULL,
    height DECIMAL(5, 2) NOT NULL COMMENT 'Height in cm',
    weight DECIMAL(5, 2) NOT NULL COMMENT 'Weight in kg',
    bmi DECIMAL(5, 2) NOT NULL COMMENT 'Body Mass Index',
    recorded_by VARCHAR(50) NOT NULL COMMENT 'User role: teacher, medical',
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE CASCADE,
    INDEX idx_student (student_id),
    INDEX idx_date (recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- TABLE 9: NutritionAnalysis
-- Purpose: Store dietary analysis and recommendations
-- Normalization:
--   - 1NF: Atomic values (status fields are single values)
--   - 2NF: All attributes depend on analysis_id
--   - 3NF: student_id is FK, no transitive dependencies
-- ================================================================
CREATE TABLE NutritionAnalysis (
    analysis_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(20) NOT NULL,
    analysis_date DATE NOT NULL,
    period_start DATE NOT NULL COMMENT 'Analysis period start',
    period_end DATE NOT NULL COMMENT 'Analysis period end',
    avg_daily_calories DECIMAL(10, 2),
    avg_daily_protein DECIMAL(10, 2),
    avg_daily_carbs DECIMAL(10, 2),
    avg_daily_fat DECIMAL(10, 2),
    calorie_status ENUM('Normal', 'Low', 'High') DEFAULT 'Normal',
    protein_status ENUM('Normal', 'Low', 'High') DEFAULT 'Normal',
    advice TEXT,
    analyzed_by VARCHAR(50) NOT NULL COMMENT 'User role: teacher, medical',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE CASCADE,
    INDEX idx_student (student_id),
    INDEX idx_date (analysis_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- INDEXES FOR PERFORMANCE
-- ================================================================
-- Additional indexes for common query patterns

-- For reporting queries by department
CREATE INDEX idx_student_dept_batch ON Student(department_id, batch_id);

-- For date-range queries on invoices
CREATE INDEX idx_invoice_student_date ON Invoice(student_id, created_at);

-- For nutrition analysis queries
CREATE INDEX idx_analysis_student_date ON NutritionAnalysis(student_id, analysis_date);

-- ================================================================
-- VIEWS FOR COMMON QUERIES
-- ================================================================

-- View: Student with Department and Batch Information
CREATE VIEW vw_student_details AS
SELECT 
    s.student_id,
    s.student_name,
    d.department_name,
    b.batch_number,
    s.email,
    s.phone,
    s.created_at
FROM Student s
INNER JOIN Department d ON s.department_id = d.department_id
INNER JOIN Batch b ON s.batch_id = b.batch_id;

-- View: Complete Invoice with Student Details
CREATE VIEW vw_invoice_summary AS
SELECT 
    i.invoice_id,
    i.student_id,
    s.student_name,
    d.department_name,
    b.batch_number,
    i.total_price,
    i.total_calories,
    i.total_protein,
    i.total_carbs,
    i.total_fat,
    i.created_by,
    i.created_at
FROM Invoice i
INNER JOIN Student s ON i.student_id = s.student_id
INNER JOIN Department d ON s.department_id = d.department_id
INNER JOIN Batch b ON s.batch_id = b.batch_id;

-- View: Food Item with Category
CREATE VIEW vw_menu_items AS
SELECT 
    f.food_item_id,
    f.food_name,
    c.category_name,
    f.price,
    f.calories,
    f.protein,
    f.carbs,
    f.fat,
    f.is_available
FROM FoodItem f
INNER JOIN FoodCategory c ON f.category_id = c.category_id;

-- ================================================================
-- SCHEMA VERIFICATION QUERIES
-- ================================================================
-- Uncomment these to verify schema after creation

-- SHOW TABLES;
-- DESCRIBE Student;
-- DESCRIBE Invoice;
-- DESCRIBE InvoiceDetails;
-- SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = 'nutrition_tracker';

-- ================================================================
-- END OF SCHEMA
-- ================================================================
