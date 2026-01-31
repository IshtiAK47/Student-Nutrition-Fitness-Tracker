-- ================================================================
-- IMPORTANT SQL QUERIES FOR VIVA & DEMONSTRATION
-- ================================================================
-- Student Nutrition and Fitness Tracker - DBMS Project
-- These queries demonstrate various SQL concepts:
-- - JOINs (INNER, LEFT, RIGHT)
-- - Aggregation (SUM, AVG, COUNT, MIN, MAX)
-- - GROUP BY and HAVING
-- - Subqueries
-- - Date functions
-- ================================================================

USE nutrition_tracker;

-- ================================================================
-- QUERY 1: Daily Calorie Intake Per Student (Last 7 Days)
-- Purpose: Track individual student's daily nutrition intake
-- Concepts: JOIN, GROUP BY, DATE functions, Aggregation
-- ================================================================
SELECT 
    s.student_id,
    s.student_name,
    d.department_name,
    DATE(i.created_at) as invoice_date,
    COUNT(i.invoice_id) as meals_count,
    SUM(i.total_calories) as daily_calories,
    SUM(i.total_protein) as daily_protein,
    SUM(i.total_carbs) as daily_carbs,
    SUM(i.total_fat) as daily_fat,
    SUM(i.total_price) as daily_spent
FROM Student s
INNER JOIN Department d ON s.department_id = d.department_id
LEFT JOIN Invoice i ON s.student_id = i.student_id
    AND i.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
WHERE s.student_id = 'B220102002'
GROUP BY s.student_id, s.student_name, d.department_name, DATE(i.created_at)
ORDER BY invoice_date DESC;

-- ================================================================
-- QUERY 2: Department-Wise Average BMI
-- Purpose: Compare health metrics across departments
-- Concepts: Multiple JOINs, AVG, GROUP BY, COALESCE
-- ================================================================
SELECT 
    d.department_name,
    COUNT(DISTINCT s.student_id) as total_students,
    COUNT(DISTINCT hr.health_record_id) as students_with_health_data,
    COALESCE(ROUND(AVG(hr.bmi), 2), 0) as avg_bmi,
    COALESCE(ROUND(MIN(hr.bmi), 2), 0) as min_bmi,
    COALESCE(ROUND(MAX(hr.bmi), 2), 0) as max_bmi,
    COALESCE(ROUND(AVG(hr.weight), 2), 0) as avg_weight,
    COALESCE(ROUND(AVG(hr.height), 2), 0) as avg_height
FROM Department d
LEFT JOIN Student s ON d.department_id = s.department_id
LEFT JOIN HealthRecord hr ON s.student_id = hr.student_id
GROUP BY d.department_id, d.department_name
ORDER BY avg_bmi DESC;

-- ================================================================
-- QUERY 3: Students with Nutrition Deficiency (Low Calorie/Protein)
-- Purpose: Identify students needing dietary intervention
-- Concepts: Subquery, JOIN, HAVING, Aggregation
-- ================================================================
SELECT 
    s.student_id,
    s.student_name,
    d.department_name,
    b.batch_number,
    COUNT(i.invoice_id) as total_meals,
    ROUND(AVG(i.total_calories), 2) as avg_calories_per_meal,
    ROUND(AVG(i.total_protein), 2) as avg_protein_per_meal,
    ROUND(SUM(i.total_calories) / 7, 2) as avg_daily_calories,
    ROUND(SUM(i.total_protein) / 7, 2) as avg_daily_protein,
    CASE 
        WHEN SUM(i.total_calories) / 7 < 1500 THEN 'Low Calorie'
        WHEN SUM(i.total_protein) / 7 < 40 THEN 'Low Protein'
        ELSE 'Normal'
    END as deficiency_type
FROM Student s
INNER JOIN Department d ON s.department_id = d.department_id
INNER JOIN Batch b ON s.batch_id = b.batch_id
LEFT JOIN Invoice i ON s.student_id = i.student_id
    AND i.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY s.student_id, s.student_name, d.department_name, b.batch_number
HAVING (SUM(i.total_calories) / 7 < 1500) OR (SUM(i.total_protein) / 7 < 40)
ORDER BY avg_daily_calories ASC;

-- ================================================================
-- QUERY 4: Top 10 Most Consumed Food Items
-- Purpose: Identify popular menu items
-- Concepts: JOIN, SUM, COUNT, GROUP BY, ORDER BY with LIMIT
-- ================================================================
SELECT 
    f.food_name,
    c.category_name,
    COUNT(id.invoice_detail_id) as times_ordered,
    SUM(id.quantity) as total_quantity_sold,
    ROUND(SUM(id.subtotal_price), 2) as total_revenue,
    ROUND(SUM(id.subtotal_calories), 2) as total_calories_served,
    ROUND(AVG(id.quantity), 2) as avg_quantity_per_order
FROM FoodItem f
INNER JOIN FoodCategory c ON f.category_id = c.category_id
INNER JOIN InvoiceDetails id ON f.food_item_id = id.food_item_id
GROUP BY f.food_item_id, f.food_name, c.category_name
ORDER BY total_quantity_sold DESC
LIMIT 10;

-- ================================================================
-- QUERY 5: Weekly Nutrition Trends (Last 4 Weeks)
-- Purpose: Analyze nutrition intake trends over time
-- Concepts: DATE functions, WEEK, GROUP BY, Aggregation
-- ================================================================
SELECT 
    YEAR(i.created_at) as year,
    WEEK(i.created_at) as week_number,
    COUNT(DISTINCT i.student_id) as unique_students,
    COUNT(i.invoice_id) as total_invoices,
    ROUND(SUM(i.total_price), 2) as total_revenue,
    ROUND(AVG(i.total_calories), 2) as avg_calories_per_meal,
    ROUND(AVG(i.total_protein), 2) as avg_protein_per_meal,
    ROUND(SUM(i.total_calories), 2) as total_calories,
    ROUND(SUM(i.total_protein), 2) as total_protein
FROM Invoice i
WHERE i.created_at >= DATE_SUB(NOW(), INTERVAL 4 WEEK)
GROUP BY YEAR(i.created_at), WEEK(i.created_at)
ORDER BY year DESC, week_number DESC;

-- ================================================================
-- QUERY 6: Student Complete Profile with Latest Health & Nutrition
-- Purpose: Comprehensive student view for medical dashboard
-- Concepts: Multiple JOINs, Subquery, COALESCE
-- ================================================================
SELECT 
    s.student_id,
    s.student_name,
    d.department_name,
    b.batch_number,
    s.email,
    s.phone,
    -- Latest Health Record
    hr.height,
    hr.weight,
    hr.bmi,
    hr.recorded_at as health_record_date,
    -- Nutrition Summary (Last 7 days)
    COALESCE(nutrition.total_invoices, 0) as invoices_last_7_days,
    COALESCE(nutrition.avg_daily_calories, 0) as avg_daily_calories,
    COALESCE(nutrition.avg_daily_protein, 0) as avg_daily_protein,
    -- Latest Analysis
    na.calorie_status,
    na.protein_status,
    na.advice
FROM Student s
INNER JOIN Department d ON s.department_id = d.department_id
INNER JOIN Batch b ON s.batch_id = b.batch_id
LEFT JOIN (
    SELECT student_id, height, weight, bmi, recorded_at
    FROM HealthRecord
    WHERE (student_id, recorded_at) IN (
        SELECT student_id, MAX(recorded_at)
        FROM HealthRecord
        GROUP BY student_id
    )
) hr ON s.student_id = hr.student_id
LEFT JOIN (
    SELECT 
        student_id,
        COUNT(invoice_id) as total_invoices,
        ROUND(SUM(total_calories) / 7, 2) as avg_daily_calories,
        ROUND(SUM(total_protein) / 7, 2) as avg_daily_protein
    FROM Invoice
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    GROUP BY student_id
) nutrition ON s.student_id = nutrition.student_id
LEFT JOIN (
    SELECT student_id, calorie_status, protein_status, advice
    FROM NutritionAnalysis
    WHERE (student_id, created_at) IN (
        SELECT student_id, MAX(created_at)
        FROM NutritionAnalysis
        GROUP BY student_id
    )
) na ON s.student_id = na.student_id
WHERE s.student_id = 'B220102002';

-- ================================================================
-- QUERY 7: Invoice Details with Food Items
-- Purpose: View complete invoice breakdown
-- Concepts: Multiple JOINs, Detailed line-item view
-- ================================================================
SELECT 
    i.invoice_id,
    i.student_id,
    s.student_name,
    i.created_at,
    f.food_name,
    c.category_name,
    id.quantity,
    f.price as unit_price,
    id.subtotal_price,
    id.subtotal_calories,
    id.subtotal_protein,
    id.subtotal_carbs,
    id.subtotal_fat
FROM Invoice i
INNER JOIN Student s ON i.student_id = s.student_id
INNER JOIN InvoiceDetails id ON i.invoice_id = id.invoice_id
INNER JOIN FoodItem f ON id.food_item_id = f.food_item_id
INNER JOIN FoodCategory c ON f.category_id = c.category_id
WHERE i.invoice_id = 1
ORDER BY c.category_name, f.food_name;

-- ================================================================
-- QUERY 8: Batch-Wise Nutrition Comparison
-- Purpose: Compare nutrition intake across batches
-- Concepts: Multiple JOINs, GROUP BY multiple columns
-- ================================================================
SELECT 
    d.department_name,
    b.batch_number,
    COUNT(DISTINCT s.student_id) as total_students,
    COUNT(i.invoice_id) as total_invoices,
    ROUND(AVG(i.total_calories), 2) as avg_calories_per_meal,
    ROUND(AVG(i.total_protein), 2) as avg_protein_per_meal,
    ROUND(SUM(i.total_price), 2) as total_spent
FROM Department d
INNER JOIN Batch b ON d.department_id = b.department_id
INNER JOIN Student s ON b.batch_id = s.batch_id
LEFT JOIN Invoice i ON s.student_id = i.student_id
    AND i.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY d.department_id, d.department_name, b.batch_id, b.batch_number
ORDER BY d.department_name, b.batch_number;

-- ================================================================
-- QUERY 9: Students Without Recent Health Records
-- Purpose: Identify students needing health checkups
-- Concepts: LEFT JOIN with NULL check, NOT EXISTS
-- ================================================================
SELECT 
    s.student_id,
    s.student_name,
    d.department_name,
    b.batch_number,
    COALESCE(MAX(hr.recorded_at), 'Never') as last_health_checkup,
    DATEDIFF(NOW(), MAX(hr.recorded_at)) as days_since_checkup
FROM Student s
INNER JOIN Department d ON s.department_id = d.department_id
INNER JOIN Batch b ON s.batch_id = b.batch_id
LEFT JOIN HealthRecord hr ON s.student_id = hr.student_id
GROUP BY s.student_id, s.student_name, d.department_name, b.batch_number
HAVING last_health_checkup = 'Never' OR days_since_checkup > 90
ORDER BY days_since_checkup DESC;

-- ================================================================
-- QUERY 10: Food Category Revenue Analysis
-- Purpose: Analyze revenue by food category
-- Concepts: JOIN, GROUP BY, Percentage calculation
-- ================================================================
SELECT 
    c.category_name,
    COUNT(DISTINCT id.invoice_id) as invoices_count,
    SUM(id.quantity) as items_sold,
    ROUND(SUM(id.subtotal_price), 2) as category_revenue,
    ROUND(AVG(id.subtotal_price), 2) as avg_transaction_value,
    ROUND(
        (SUM(id.subtotal_price) / (SELECT SUM(subtotal_price) FROM InvoiceDetails)) * 100, 
        2
    ) as revenue_percentage
FROM FoodCategory c
INNER JOIN FoodItem f ON c.category_id = f.category_id
INNER JOIN InvoiceDetails id ON f.food_item_id = id.food_item_id
GROUP BY c.category_id, c.category_name
ORDER BY category_revenue DESC;

-- ================================================================
-- QUERY 11: Students with High BMI and High Calorie Intake
-- Purpose: Identify students at health risk
-- Concepts: Multiple conditions, Subquery, HAVING
-- ================================================================
SELECT 
    s.student_id,
    s.student_name,
    d.department_name,
    ROUND(hr.bmi, 2) as current_bmi,
    ROUND(SUM(i.total_calories) / 7, 2) as avg_daily_calories,
    ROUND(SUM(i.total_fat) / 7, 2) as avg_daily_fat,
    'High Risk' as health_alert
FROM Student s
INNER JOIN Department d ON s.department_id = d.department_id
INNER JOIN HealthRecord hr ON s.student_id = hr.student_id
LEFT JOIN Invoice i ON s.student_id = i.student_id
    AND i.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
WHERE hr.bmi > 25
    AND hr.recorded_at = (
        SELECT MAX(recorded_at) 
        FROM HealthRecord 
        WHERE student_id = s.student_id
    )
GROUP BY s.student_id, s.student_name, d.department_name, hr.bmi
HAVING avg_daily_calories > 2500
ORDER BY current_bmi DESC, avg_daily_calories DESC;

-- ================================================================
-- QUERY 12: Monthly Revenue Report
-- Purpose: Financial analysis by month
-- Concepts: DATE functions, GROUP BY date parts
-- ================================================================
SELECT 
    YEAR(i.created_at) as year,
    MONTH(i.created_at) as month,
    MONTHNAME(i.created_at) as month_name,
    COUNT(DISTINCT i.student_id) as unique_customers,
    COUNT(i.invoice_id) as total_invoices,
    ROUND(SUM(i.total_price), 2) as total_revenue,
    ROUND(AVG(i.total_price), 2) as avg_invoice_value,
    ROUND(MIN(i.total_price), 2) as min_invoice_value,
    ROUND(MAX(i.total_price), 2) as max_invoice_value
FROM Invoice i
WHERE i.created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
GROUP BY YEAR(i.created_at), MONTH(i.created_at), MONTHNAME(i.created_at)
ORDER BY year DESC, month DESC;

-- ================================================================
-- END OF IMPORTANT QUERIES
-- ================================================================

-- Additional Utility Queries for Testing:

-- Count all records
SELECT 
    'Departments' as table_name, COUNT(*) as count FROM Department
UNION ALL
SELECT 'Batches', COUNT(*) FROM Batch
UNION ALL
SELECT 'Students', COUNT(*) FROM Student
UNION ALL
SELECT 'Food Categories', COUNT(*) FROM FoodCategory
UNION ALL
SELECT 'Food Items', COUNT(*) FROM FoodItem
UNION ALL
SELECT 'Invoices', COUNT(*) FROM Invoice
UNION ALL
SELECT 'Invoice Details', COUNT(*) FROM InvoiceDetails
UNION ALL
SELECT 'Health Records', COUNT(*) FROM HealthRecord
UNION ALL
SELECT 'Nutrition Analysis', COUNT(*) FROM NutritionAnalysis;

-- Test Views
SELECT * FROM vw_student_details;
SELECT * FROM vw_menu_items;
SELECT * FROM vw_invoice_summary ORDER BY created_at DESC LIMIT 5;
