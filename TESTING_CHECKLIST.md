# TESTING CHECKLIST

## Pre-Demo Testing Checklist for DBMS Project

---

## ✅ PHASE 1: Database Setup Verification

### Database Creation
- [ ] Database `nutrition_tracker` created successfully
- [ ] All 9 tables created (Department, Batch, Student, FoodCategory, FoodItem, Invoice, InvoiceDetails, HealthRecord, NutritionAnalysis)
- [ ] All foreign keys established
- [ ] All indexes created
- [ ] All views created (vw_student_details, vw_menu_items, vw_invoice_summary)

### Test Query:
```sql
USE nutrition_tracker;
SHOW TABLES;
-- Expected: 9 tables
```

---

## ✅ PHASE 2: Sample Data Verification

### Departments
- [ ] 3 departments inserted (ICT, CSE, BBA)

```sql
SELECT * FROM Department;
-- Expected: 3 rows
```

### Batches
- [ ] 12 batches inserted (4 per department)

```sql
SELECT d.department_name, COUNT(b.batch_id) as batch_count
FROM Department d
LEFT JOIN Batch b ON d.department_id = b.department_id
GROUP BY d.department_name;
-- Expected: Each department has 4 batches
```

### Students
- [ ] 13 students inserted
- [ ] **Required student exists:** Ishtiak Mahmood (B220102002)

```sql
SELECT * FROM Student WHERE student_id = 'B220102002';
-- Expected: 1 row with name "Ishtiak Mahmood", department ICT, batch 2
```

### Food Items
- [ ] 4 food categories
- [ ] 30+ food items with nutritional data

```sql
SELECT c.category_name, COUNT(f.food_item_id) as item_count
FROM FoodCategory c
LEFT JOIN FoodItem f ON c.category_id = f.category_id
GROUP BY c.category_name;
-- Expected: Breakfast (5), Lunch/Dinner (13), Bharta (7), Snacks/Drinks (6)
```

### Sample Transactions
- [ ] Sample invoices inserted
- [ ] Sample health records inserted

```sql
SELECT COUNT(*) as invoice_count FROM Invoice;
SELECT COUNT(*) as health_record_count FROM HealthRecord;
-- Expected: At least 3 invoices, 4 health records
```

---

## ✅ PHASE 3: Foreign Key Testing

### Test Referential Integrity
- [ ] Cannot delete department with students

```sql
-- This should FAIL (RESTRICT constraint)
DELETE FROM Department WHERE department_id = 1;
-- Expected: Error - cannot delete or update a parent row
```

- [ ] Cascading delete works for Invoice → InvoiceDetails

```sql
-- Create test invoice
INSERT INTO Invoice (student_id, created_by, total_price, total_calories, total_protein, total_carbs, total_fat)
VALUES ('B220102002', 'test', 100, 500, 20, 60, 10);

SET @test_invoice = LAST_INSERT_ID();

INSERT INTO InvoiceDetails (invoice_id, food_item_id, quantity, subtotal_price, subtotal_calories, subtotal_protein, subtotal_carbs, subtotal_fat)
VALUES (@test_invoice, 1, 1, 100, 500, 20, 60, 10);

-- Delete invoice
DELETE FROM Invoice WHERE invoice_id = @test_invoice;

-- Check invoice details also deleted (CASCADE)
SELECT COUNT(*) FROM InvoiceDetails WHERE invoice_id = @test_invoice;
-- Expected: 0 rows (cascaded delete)
```

---

## ✅ PHASE 4: Application Testing

### Connection Test
- [ ] Application starts without errors: `npm run dev`
- [ ] Database connection successful (check terminal for "Database connection successful")
- [ ] No errors in browser console

### Landing Page (/)
- [ ] Page loads successfully
- [ ] Shows project title
- [ ] Shows two module cards (Canteen, Medical)
- [ ] Links to canteen and medical pages work

### Canteen Module (/canteen)
- [ ] Page loads successfully
- [ ] Student search works
  - [ ] Enter: B220102002
  - [ ] Shows: Ishtiak Mahmood, ICT, Batch 2
- [ ] Food items display in categories
  - [ ] Breakfast items visible
  - [ ] Lunch/Dinner items visible
  - [ ] Bharta items visible
  - [ ] Snacks/Drinks items visible
- [ ] Can add items to cart
- [ ] Quantity can be changed
- [ ] Items can be removed
- [ ] Totals calculate correctly
  - [ ] Total Price
  - [ ] Total Calories
  - [ ] Total Protein, Carbs, Fat
- [ ] Invoice creation works
  - [ ] Success message appears
  - [ ] Invoice ID returned
  - [ ] Cart clears after creation

### Medical Module (/medical)
- [ ] Page loads successfully
- [ ] Student lookup works
  - [ ] Enter: B220102002
  - [ ] Shows student details
- [ ] Nutrition summary displays
  - [ ] Daily averages shown
  - [ ] Calorie status badge (Normal/Low/High)
  - [ ] Protein status badge
  - [ ] Advice text displayed
- [ ] Health record section works
  - [ ] Latest health record displays
  - [ ] Can add new health record
  - [ ] BMI calculates automatically
  - [ ] Success message on save
- [ ] Recent invoices display
  - [ ] Shows transaction history
  - [ ] Nutritional data visible

---

## ✅ PHASE 5: API Endpoint Testing

### GET /api/students/[studentId]
```bash
# Test: Get student details
curl http://localhost:3000/api/students/B220102002
```
- [ ] Returns student object
- [ ] Includes department and batch info
- [ ] Returns 404 for invalid student

### GET /api/foods
```bash
# Test: Get all food items
curl http://localhost:3000/api/foods
```
- [ ] Returns food categories array
- [ ] Each category has items array
- [ ] Nutritional data included

### POST /api/invoices
```bash
# Test: Create invoice
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "B220102002",
    "created_by": "canteen_staff",
    "items": [
      {"food_item_id": 7, "quantity": 1},
      {"food_item_id": 8, "quantity": 1}
    ]
  }'
```
- [ ] Returns success: true
- [ ] Returns invoice_id
- [ ] Totals calculated correctly
- [ ] Invoice saved in database

### GET /api/nutrition/[studentId]
```bash
# Test: Get nutrition summary
curl http://localhost:3000/api/nutrition/B220102002?period_days=7
```
- [ ] Returns student info
- [ ] Returns nutrition summary
- [ ] Returns analysis (calorie/protein status)
- [ ] Returns recent invoices

### POST /api/health
```bash
# Test: Add health record
curl -X POST http://localhost:3000/api/health \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "B220102002",
    "height": 175,
    "weight": 70,
    "recorded_by": "medical",
    "notes": "Test record"
  }'
```
- [ ] Returns success: true
- [ ] BMI calculated correctly
- [ ] Health record saved

### POST /api/analysis
```bash
# Test: Save analysis
curl -X POST http://localhost:3000/api/analysis \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "B220102002",
    "period_start": "2026-01-15",
    "period_end": "2026-01-22",
    "calorie_status": "Normal",
    "protein_status": "Normal",
    "advice": "Good diet",
    "analyzed_by": "medical"
  }'
```
- [ ] Returns success: true
- [ ] Analysis saved in database

---

## ✅ PHASE 6: SQL Query Testing

Run each query from `database/queries.sql`:

### Query 1: Daily Calorie Intake
```sql
-- Daily calorie intake per student (Last 7 Days)
```
- [ ] Executes without errors
- [ ] Returns rows for student B220102002
- [ ] Shows calories, protein, carbs, fat

### Query 2: Department-Wise Average BMI
```sql
-- Department-wise average BMI
```
- [ ] Executes without errors
- [ ] Shows all 3 departments
- [ ] Calculates avg, min, max BMI

### Query 3: Students with Deficiency
```sql
-- Students with nutrition deficiency
```
- [ ] Executes without errors
- [ ] Identifies low calorie/protein students
- [ ] Shows deficiency type

### Query 4: Top Food Items
```sql
-- Top 10 most consumed food items
```
- [ ] Executes without errors
- [ ] Shows food name and category
- [ ] Sorted by quantity sold

### Query 5-12: Other Queries
- [ ] All remaining queries execute successfully
- [ ] Results make logical sense
- [ ] No SQL errors

---

## ✅ PHASE 7: Transaction Testing

### Invoice Creation Transaction
- [ ] Transaction starts
- [ ] Invoice inserted
- [ ] Invoice details inserted
- [ ] Transaction commits
- [ ] On error: rollback works

Test rollback:
```sql
START TRANSACTION;

-- Insert invalid invoice
INSERT INTO Invoice (student_id, created_by, total_price, total_calories, total_protein, total_carbs, total_fat)
VALUES ('INVALID_ID', 'test', 100, 500, 20, 60, 10);
-- Should fail due to foreign key

ROLLBACK;
```
- [ ] Transaction rolls back properly
- [ ] No partial data inserted

---

## ✅ PHASE 8: Performance Testing

### Index Effectiveness
```sql
-- Check index usage
EXPLAIN SELECT * FROM Invoice WHERE student_id = 'B220102002';
-- Should show "Using index" or "Using where with index"
```
- [ ] Indexes being used
- [ ] No full table scans on indexed columns

### Query Performance
- [ ] Complex queries execute in < 1 second
- [ ] JOIN queries use indexes
- [ ] GROUP BY queries performant

---

## ✅ PHASE 9: Data Integrity Testing

### Constraint Checks
- [ ] Cannot insert student with invalid department_id
- [ ] Cannot insert invoice with invalid student_id
- [ ] Cannot insert food item with invalid category_id
- [ ] UNIQUE constraints work (e.g., department_name)

```sql
-- Test UNIQUE constraint
INSERT INTO Department (department_name) VALUES ('ICT');
-- Expected: Error - Duplicate entry
```

### Data Validation
- [ ] BMI calculated correctly (weight / (height/100)²)
- [ ] Invoice totals match sum of details
- [ ] No negative prices or quantities
- [ ] Date fields have valid values

---

## ✅ PHASE 10: Documentation Review

### Code Comments
- [ ] SQL files have explanatory comments
- [ ] API routes have comments
- [ ] Complex logic explained

### Documentation Files
- [ ] README.md complete
- [ ] SETUP_GUIDE.md accurate
- [ ] VIVA_QUESTIONS.md comprehensive
- [ ] ER_DIAGRAM.md clear
- [ ] PROJECT_SUMMARY.md accurate

---

## ✅ PHASE 11: Viva Preparation

### Can Explain:
- [ ] Database normalization (1NF, 2NF, 3NF)
- [ ] ER diagram relationships
- [ ] Foreign key constraints
- [ ] Transaction usage
- [ ] Index purpose
- [ ] Query optimization
- [ ] Many-to-many resolution
- [ ] ACID properties

### Can Demonstrate:
- [ ] Creating an invoice
- [ ] Viewing nutrition analysis
- [ ] Running complex SQL queries
- [ ] Showing normalized schema
- [ ] Explaining data flow

---

## ✅ PHASE 12: Final Checklist

### Pre-Demo
- [ ] Database fully populated
- [ ] Application running smoothly
- [ ] No console errors
- [ ] All features working
- [ ] Documentation reviewed
- [ ] Viva questions practiced

### Demo Preparation
- [ ] MySQL running
- [ ] Node.js server started
- [ ] Browser ready
- [ ] SQL queries prepared
- [ ] ER diagram ready to show
- [ ] Confident with explanations

---

## 🎯 Expected Results Summary

| Component | Expected State |
|-----------|---------------|
| Database | 9 tables, fully normalized (3NF) |
| Data | 3 departments, 12 batches, 13 students, 30+ food items |
| API Routes | 7 endpoints, all functional |
| UI Pages | 3 pages, fully working |
| SQL Queries | 12+ queries, all execute successfully |
| Transactions | Working with rollback |
| Indexes | Created and being used |
| Foreign Keys | All enforced |
| Documentation | Complete and accurate |

---

## 🚦 Testing Status

- [ ] **PHASE 1:** Database Setup - PASS
- [ ] **PHASE 2:** Sample Data - PASS
- [ ] **PHASE 3:** Foreign Keys - PASS
- [ ] **PHASE 4:** Application - PASS
- [ ] **PHASE 5:** API Endpoints - PASS
- [ ] **PHASE 6:** SQL Queries - PASS
- [ ] **PHASE 7:** Transactions - PASS
- [ ] **PHASE 8:** Performance - PASS
- [ ] **PHASE 9:** Data Integrity - PASS
- [ ] **PHASE 10:** Documentation - PASS
- [ ] **PHASE 11:** Viva Prep - PASS
- [ ] **PHASE 12:** Final Check - PASS

---

## ✅ PROJECT STATUS

Once all phases pass:

**🎉 PROJECT READY FOR SUBMISSION & DEMONSTRATION**

Expected Score: **90-100%**

---

Good luck! 🚀
