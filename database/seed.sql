-- ================================================================
-- STUDENT NUTRITION AND FITNESS TRACKER - SEED DATA
-- ================================================================
-- This file contains sample data for the database
-- Including: Departments, Batches, Students, Food Items
-- ================================================================

USE nutrition_tracker;

-- ================================================================
-- 1. INSERT DEPARTMENTS
-- ================================================================
INSERT INTO Department (department_name) VALUES
('ICT'),
('CSE'),
('BBA');

-- ================================================================
-- 2. INSERT BATCHES (4 batches per department = 12 total)
-- ================================================================
INSERT INTO Batch (batch_number, department_id) VALUES
-- ICT Department (department_id = 1)
(1, 1), (2, 1), (3, 1), (4, 1),
-- CSE Department (department_id = 2)
(1, 2), (2, 2), (3, 2), (4, 2),
-- BBA Department (department_id = 3)
(1, 3), (2, 3), (3, 3), (4, 3);

-- ================================================================
-- 3. INSERT STUDENTS
-- ================================================================
-- Required Sample Student: Ishtiak Mahmood
INSERT INTO Student (student_id, student_name, department_id, batch_id, email, phone) VALUES
('B220102002', 'Ishtiak Mahmood', 1, 2, 'ishtiak@student.edu', '01712345678');

-- Additional Sample Students for Testing
INSERT INTO Student (student_id, student_name, department_id, batch_id, email, phone) VALUES
-- ICT Department
('B220101031', 'A', 1, 1, 'anika@student.edu', '01712345601'),
('B220102006', 'Fahmida Faiza', 1, 2, 'r@student.edu', '01712345602'),
('B220103001', 'Syed Sakib', 1, 3, 't@student.edu', '01712345603'),
('B220104001', 'Enan', 1, 4, 's@student.edu', '01712345604'),

-- CSE Department
('B220201031', 'Maliha Khan', 2, 5, 'maliha@student.edu', '01712345605'),
('B220202032', 'Fahim Ahmed', 2, 6, 'fahim@student.edu', '01712345606'),
('B220203033', 'Nusrat Jahan', 2, 7, 'nusrat@student.edu', '01712345607'),
('B220204034', 'Tanvir Hossain', 2, 8, 'tanvir@student.edu', '01712345608'),

-- BBA Department
('B220301031', 'Sadia Sultana', 3, 9, 'sadia@student.edu', '01712345609'),
('B220302032', 'Imran Khan', 3, 10, 'imran@student.edu', '01712345610'),
('B220303033', 'Priya Das', 3, 11, 'priya@student.edu', '01712345611'),
('B220304034', 'Karim Uddin', 3, 12, 'karim@student.edu', '01712345612');

-- ================================================================
-- 4. INSERT FOOD CATEGORIES
-- ================================================================
INSERT INTO FoodCategory (category_name) VALUES
('Breakfast'),
('Lunch/Dinner'),
('Bharta'),
('Snacks/Drinks');

-- ================================================================
-- 5. INSERT FOOD ITEMS WITH NUTRITIONAL DATA
-- ================================================================
-- Note: Nutritional values are estimated based on standard serving sizes
-- Values represent: calories (kcal), protein (g), carbs (g), fat (g)

-- ----------------------------------------------------------------
-- BREAKFAST ITEMS (category_id = 1)
-- ----------------------------------------------------------------
INSERT INTO FoodItem (food_name, category_id, price, calories, protein, carbs, fat) VALUES
('Paratha / Roti', 1, 8.00, 120, 3.5, 18, 4),
('Dal', 1, 8.00, 100, 6, 15, 2),
('Khichuri + Dim + Vorta (Package)', 1, 50.00, 450, 18, 65, 12),
('Khichuri + Vorta (Package)', 1, 30.00, 350, 10, 58, 8),
('Khichuri (Extra)', 1, 10.00, 200, 5, 38, 3);

-- ----------------------------------------------------------------
-- LUNCH & DINNER ITEMS (category_id = 2)
-- ----------------------------------------------------------------
INSERT INTO FoodItem (food_name, category_id, price, calories, protein, carbs, fat) VALUES
('Rice + Dal (Unlimited)', 2, 25.00, 400, 12, 75, 5),
('Rice (Per Plate)', 2, 20.00, 300, 6, 65, 1),
('Beef (Full Plate)', 2, 110.00, 450, 35, 5, 28),
('Beef (Half Plate)', 2, 60.00, 225, 18, 3, 14),
('Broiler Chicken', 2, 80.00, 320, 32, 2, 18),
('Telapia / Pangas Fish', 2, 80.00, 280, 28, 0, 16),
('Small Fish', 2, 80.00, 260, 26, 0, 14),
('Rui Fish', 2, 80.00, 300, 30, 0, 17),
('Sing Fish', 2, 80.00, 290, 29, 0, 16),
('Pabda Fish', 2, 80.00, 285, 28, 0, 15),
('Dal (Unlimited)', 2, 20.00, 150, 9, 22, 3),
('Mixed Vegetable', 2, 20.00, 80, 3, 15, 2),
('Egg Curry', 2, 25.00, 180, 12, 6, 12);

-- ----------------------------------------------------------------
-- BHARTA ITEMS (category_id = 3)
-- ----------------------------------------------------------------
INSERT INTO FoodItem (food_name, category_id, price, calories, protein, carbs, fat) VALUES
('Aloo Bharta', 3, 5.00, 90, 2, 18, 1),
('Begun Bharta', 3, 10.00, 70, 2, 12, 2.5),
('Fish Bharta', 3, 10.00, 120, 10, 5, 6),
('Other Bharta', 3, 10.00, 85, 2.5, 14, 2),
('Dim Bhuna', 3, 20.00, 150, 11, 4, 10),
('Vegetable (Jhol)', 3, 10.00, 60, 2, 12, 1.5),
('Salad', 3, 0.00, 25, 1, 5, 0.2);

-- ----------------------------------------------------------------
-- SNACKS & DRINKS (category_id = 4)
-- ----------------------------------------------------------------
INSERT INTO FoodItem (food_name, category_id, price, calories, protein, carbs, fat) VALUES
('Aloo Chop', 4, 5.00, 120, 2.5, 18, 5),
('Singara', 4, 5.00, 130, 3, 20, 4.5),
('Samosa', 4, 5.00, 140, 3.5, 19, 5.5),
('Noodles', 4, 10.00, 220, 6, 38, 6),
('Red Tea', 4, 4.00, 5, 0, 1, 0),
('Milk Tea', 4, 8.00, 60, 2, 10, 2);

-- ================================================================
-- 6. INSERT SAMPLE HEALTH RECORDS
-- ================================================================
-- Health records for some students (BMI = weight / (height/100)^2)
INSERT INTO HealthRecord (student_id, height, weight, bmi, recorded_by, notes) VALUES
('B220102002', 175.00, 70.00, 22.86, 'medical', 'Normal BMI, good health'),
('B220101001', 160.00, 55.00, 21.48, 'medical', 'Healthy weight'),
('B220202001', 178.00, 75.00, 23.67, 'teacher', 'Slightly above normal'),
('B220301001', 165.00, 58.00, 21.30, 'medical', 'Normal range');

-- ================================================================
-- 7. INSERT SAMPLE INVOICES
-- ================================================================
-- Sample invoice for Ishtiak Mahmood (Lunch)
INSERT INTO Invoice (student_id, created_by, total_price, total_calories, total_protein, total_carbs, total_fat, created_at) VALUES
('B220102002', 'canteen_staff', 145.00, 800, 59, 70, 42, '2026-01-22 13:30:00');

-- Get the last invoice ID
SET @last_invoice_id = LAST_INSERT_ID();

-- Invoice details for above invoice
INSERT INTO InvoiceDetails (invoice_id, food_item_id, quantity, subtotal_price, subtotal_calories, subtotal_protein, subtotal_carbs, subtotal_fat) VALUES
(@last_invoice_id, 7, 1, 20.00, 300, 6, 65, 1),     -- Rice (Per Plate)
(@last_invoice_id, 8, 1, 110.00, 450, 35, 5, 28),   -- Beef (Full Plate)
(@last_invoice_id, 17, 1, 10.00, 70, 2, 12, 2.5),   -- Begun Bharta
(@last_invoice_id, 21, 1, 5.00, 90, 2, 18, 1);      -- Aloo Bharta

-- Sample invoice for another student (Breakfast)
INSERT INTO Invoice (student_id, created_by, total_price, total_calories, total_protein, total_carbs, total_fat, created_at) VALUES
('B220101001', 'canteen_staff', 50.00, 450, 18, 65, 12, '2026-01-22 08:30:00');

SET @last_invoice_id = LAST_INSERT_ID();

INSERT INTO InvoiceDetails (invoice_id, food_item_id, quantity, subtotal_price, subtotal_calories, subtotal_protein, subtotal_carbs, subtotal_fat) VALUES
(@last_invoice_id, 3, 1, 50.00, 450, 18, 65, 12);   -- Khichuri + Dim + Vorta (Package)

-- Sample invoice for CSE student (Snacks)
INSERT INTO Invoice (student_id, created_by, total_price, total_calories, total_protein, total_carbs, total_fat, created_at) VALUES
('B220202001', 'canteen_staff', 18.00, 280, 8.5, 48, 11.5, '2026-01-22 16:00:00');

SET @last_invoice_id = LAST_INSERT_ID();

INSERT INTO InvoiceDetails (invoice_id, food_item_id, quantity, subtotal_price, subtotal_calories, subtotal_protein, subtotal_carbs, subtotal_fat) VALUES
(@last_invoice_id, 24, 2, 10.00, 260, 6, 38, 9),     -- Singara x2
(@last_invoice_id, 28, 1, 8.00, 60, 2, 10, 2);       -- Milk Tea

-- ================================================================
-- 8. INSERT SAMPLE NUTRITION ANALYSIS
-- ================================================================
-- Analysis for Ishtiak Mahmood based on his consumption
INSERT INTO NutritionAnalysis (
    student_id, 
    analysis_date, 
    period_start, 
    period_end,
    avg_daily_calories,
    avg_daily_protein,
    avg_daily_carbs,
    avg_daily_fat,
    calorie_status,
    protein_status,
    advice,
    analyzed_by
) VALUES (
    'B220102002',
    '2026-01-22',
    '2026-01-15',
    '2026-01-22',
    1850.00,
    65.00,
    240.00,
    55.00,
    'Normal',
    'Normal',
    'Your nutrition intake is balanced. Continue maintaining a healthy diet with adequate protein and vegetables.',
    'medical'
);

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================
-- Uncomment to verify data insertion

-- Check all departments and batches
-- SELECT d.department_name, b.batch_number 
-- FROM Department d 
-- INNER JOIN Batch b ON d.department_id = b.department_id 
-- ORDER BY d.department_name, b.batch_number;

-- Check student Ishtiak Mahmood
-- SELECT * FROM vw_student_details WHERE student_id = 'B220102002';

-- Check all food items by category
-- SELECT * FROM vw_menu_items ORDER BY category_name, food_name;

-- Check invoices with details
-- SELECT * FROM vw_invoice_summary ORDER BY created_at DESC;

-- Count records
-- SELECT 
--     (SELECT COUNT(*) FROM Department) as departments,
--     (SELECT COUNT(*) FROM Batch) as batches,
--     (SELECT COUNT(*) FROM Student) as students,
--     (SELECT COUNT(*) FROM FoodCategory) as categories,
--     (SELECT COUNT(*) FROM FoodItem) as food_items,
--     (SELECT COUNT(*) FROM Invoice) as invoices,
--     (SELECT COUNT(*) FROM HealthRecord) as health_records;

-- ================================================================
-- END OF SEED DATA
-- ================================================================
