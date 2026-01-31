# ER DIAGRAM & DATABASE NORMALIZATION DOCUMENTATION

## Student Nutrition and Fitness Tracker - DBMS Project

---

## 1. ER DIAGRAM (Entity-Relationship Diagram)

### Entities and Attributes

#### 1.1 **Department**
- **Primary Key:** department_id
- **Attributes:**
  - department_id (INT, PK, AUTO_INCREMENT)
  - department_name (VARCHAR, UNIQUE)
  - created_at (TIMESTAMP)

#### 1.2 **Batch**
- **Primary Key:** batch_id
- **Foreign Key:** department_id → Department(department_id)
- **Attributes:**
  - batch_id (INT, PK, AUTO_INCREMENT)
  - batch_number (INT)
  - department_id (INT, FK)
  - created_at (TIMESTAMP)
- **Constraint:** UNIQUE(batch_number, department_id)

#### 1.3 **Student**
- **Primary Key:** student_id
- **Foreign Keys:** 
  - department_id → Department(department_id)
  - batch_id → Batch(batch_id)
- **Attributes:**
  - student_id (VARCHAR, PK)
  - student_name (VARCHAR)
  - department_id (INT, FK)
  - batch_id (INT, FK)
  - email (VARCHAR)
  - phone (VARCHAR)
  - created_at (TIMESTAMP)

#### 1.4 **FoodCategory**
- **Primary Key:** category_id
- **Attributes:**
  - category_id (INT, PK, AUTO_INCREMENT)
  - category_name (VARCHAR, UNIQUE)
  - created_at (TIMESTAMP)

#### 1.5 **FoodItem**
- **Primary Key:** food_item_id
- **Foreign Key:** category_id → FoodCategory(category_id)
- **Attributes:**
  - food_item_id (INT, PK, AUTO_INCREMENT)
  - food_name (VARCHAR)
  - category_id (INT, FK)
  - price (DECIMAL)
  - calories (DECIMAL)
  - protein (DECIMAL)
  - carbs (DECIMAL)
  - fat (DECIMAL)
  - is_available (BOOLEAN)
  - created_at (TIMESTAMP)

#### 1.6 **Invoice**
- **Primary Key:** invoice_id
- **Foreign Key:** student_id → Student(student_id)
- **Attributes:**
  - invoice_id (INT, PK, AUTO_INCREMENT)
  - student_id (VARCHAR, FK)
  - created_by (VARCHAR)
  - total_price (DECIMAL)
  - total_calories (DECIMAL)
  - total_protein (DECIMAL)
  - total_carbs (DECIMAL)
  - total_fat (DECIMAL)
  - created_at (TIMESTAMP)

#### 1.7 **InvoiceDetails** (Junction Table)
- **Primary Key:** invoice_detail_id
- **Foreign Keys:**
  - invoice_id → Invoice(invoice_id)
  - food_item_id → FoodItem(food_item_id)
- **Attributes:**
  - invoice_detail_id (INT, PK, AUTO_INCREMENT)
  - invoice_id (INT, FK)
  - food_item_id (INT, FK)
  - quantity (INT)
  - subtotal_price (DECIMAL)
  - subtotal_calories (DECIMAL)
  - subtotal_protein (DECIMAL)
  - subtotal_carbs (DECIMAL)
  - subtotal_fat (DECIMAL)

#### 1.8 **HealthRecord**
- **Primary Key:** health_record_id
- **Foreign Key:** student_id → Student(student_id)
- **Attributes:**
  - health_record_id (INT, PK, AUTO_INCREMENT)
  - student_id (VARCHAR, FK)
  - height (DECIMAL)
  - weight (DECIMAL)
  - bmi (DECIMAL)
  - recorded_by (VARCHAR)
  - recorded_at (TIMESTAMP)
  - notes (TEXT)

#### 1.9 **NutritionAnalysis**
- **Primary Key:** analysis_id
- **Foreign Key:** student_id → Student(student_id)
- **Attributes:**
  - analysis_id (INT, PK, AUTO_INCREMENT)
  - student_id (VARCHAR, FK)
  - analysis_date (DATE)
  - period_start (DATE)
  - period_end (DATE)
  - avg_daily_calories (DECIMAL)
  - avg_daily_protein (DECIMAL)
  - avg_daily_carbs (DECIMAL)
  - avg_daily_fat (DECIMAL)
  - calorie_status (ENUM: 'Normal', 'Low', 'High')
  - protein_status (ENUM: 'Normal', 'Low', 'High')
  - advice (TEXT)
  - analyzed_by (VARCHAR)
  - created_at (TIMESTAMP)

---

## 2. RELATIONSHIPS

### 2.1 Department ←→ Batch
- **Type:** One-to-Many (1:N)
- **Cardinality:** One department can have many batches
- **Participation:** Department (Partial), Batch (Total)

### 2.2 Department ←→ Student
- **Type:** One-to-Many (1:N)
- **Cardinality:** One department can have many students
- **Participation:** Department (Partial), Student (Total)

### 2.3 Batch ←→ Student
- **Type:** One-to-Many (1:N)
- **Cardinality:** One batch can have many students
- **Participation:** Batch (Partial), Student (Total)

### 2.4 FoodCategory ←→ FoodItem
- **Type:** One-to-Many (1:N)
- **Cardinality:** One category can have many food items
- **Participation:** FoodCategory (Partial), FoodItem (Total)

### 2.5 Student ←→ Invoice
- **Type:** One-to-Many (1:N)
- **Cardinality:** One student can have many invoices
- **Participation:** Student (Partial), Invoice (Total)

### 2.6 Invoice ←→ FoodItem
- **Type:** Many-to-Many (M:N) **[Resolved via InvoiceDetails]**
- **Cardinality:** One invoice can have many food items; one food item can be in many invoices
- **Junction Table:** InvoiceDetails

### 2.7 Student ←→ HealthRecord
- **Type:** One-to-Many (1:N)
- **Cardinality:** One student can have many health records (historical tracking)
- **Participation:** Student (Partial), HealthRecord (Total)

### 2.8 Student ←→ NutritionAnalysis
- **Type:** One-to-Many (1:N)
- **Cardinality:** One student can have many nutrition analyses
- **Participation:** Student (Partial), NutritionAnalysis (Total)

---

## 3. NORMALIZATION EXPLANATION

### 3.1 First Normal Form (1NF)

**Definition:** All attributes must contain atomic (indivisible) values, and there should be no repeating groups.

**Application in our schema:**

✅ **Department Table:**
- All fields (department_id, department_name) are atomic
- No repeating groups

✅ **Student Table:**
- Each attribute (student_id, student_name, email, phone) contains single values
- No multi-valued attributes

✅ **FoodItem Table:**
- Nutritional values (calories, protein, carbs, fat) are stored as separate atomic attributes
- NOT storing as array or comma-separated values

✅ **Invoice & InvoiceDetails:**
- Instead of storing multiple food items in one invoice row (repeating group), we created InvoiceDetails table
- Each row in InvoiceDetails represents ONE food item in ONE invoice

**Example of 1NF Violation (AVOIDED):**
```
❌ Bad Design:
Invoice: [invoice_id, student_id, food_items: "Rice,Dal,Fish", quantities: "1,1,2"]

✅ Our Design:
Invoice: [invoice_id, student_id, total_price, ...]
InvoiceDetails: [invoice_detail_id, invoice_id, food_item_id, quantity]
```

---

### 3.2 Second Normal Form (2NF)

**Definition:** Must be in 1NF, and all non-key attributes must be fully dependent on the entire primary key (no partial dependencies).

**Application in our schema:**

✅ **Batch Table:**
- Composite candidate key: (batch_number, department_id)
- We use surrogate key (batch_id) instead
- All attributes depend on batch_id (no partial dependency)

✅ **InvoiceDetails Table:**
- Primary key: invoice_detail_id
- All attributes (quantity, subtotal_price, subtotal_calories, etc.) depend on the entire primary key
- food_item_id and invoice_id are foreign keys, not part of composite primary key for attributes

✅ **Student Table:**
- Primary key: student_id
- All attributes (student_name, email, phone) fully depend on student_id
- department_id and batch_id are foreign keys (not partial dependencies)

**Example of 2NF Violation (AVOIDED):**
```
❌ Bad Design (Partial Dependency):
InvoiceDetails: [invoice_id, food_item_id, food_name, quantity, price]
Problem: food_name depends only on food_item_id, not on the full key

✅ Our Design:
InvoiceDetails: [invoice_detail_id, invoice_id, food_item_id, quantity, subtotal_price]
FoodItem: [food_item_id, food_name, price, ...]
```

---

### 3.3 Third Normal Form (3NF)

**Definition:** Must be in 2NF, and no non-key attribute should depend on another non-key attribute (no transitive dependencies).

**Application in our schema:**

✅ **Student Table:**
- student_id → department_id (direct dependency)
- department_id → department_name (stored in Department table, not Student)
- NO transitive dependency: student_id → department_id → department_name

✅ **Invoice Table:**
- Total values (total_price, total_calories, etc.) are **calculated** from InvoiceDetails
- These are stored for **performance** (denormalization trade-off), but can be derived
- This is acceptable in practical database design

✅ **HealthRecord Table:**
- BMI is calculated from height and weight
- However, it's stored for **historical tracking** (BMI at that specific time)
- This is acceptable for temporal data

**Example of 3NF Violation (AVOIDED):**
```
❌ Bad Design (Transitive Dependency):
Student: [student_id, student_name, department_id, department_name, batch_id, batch_number]
Problem: student_id → department_id → department_name (transitive)

✅ Our Design:
Student: [student_id, student_name, department_id, batch_id]
Department: [department_id, department_name]
Batch: [batch_id, batch_number, department_id]
```

---

## 4. REFERENTIAL INTEGRITY

### Foreign Key Constraints

All foreign keys enforce referential integrity:

1. **Student.department_id** → Department.department_id
   - ON DELETE RESTRICT (cannot delete department with students)

2. **Student.batch_id** → Batch.batch_id
   - ON DELETE RESTRICT (cannot delete batch with students)

3. **Batch.department_id** → Department.department_id
   - ON DELETE CASCADE (deleting department deletes its batches)

4. **FoodItem.category_id** → FoodCategory.category_id
   - ON DELETE RESTRICT (cannot delete category with food items)

5. **Invoice.student_id** → Student.student_id
   - ON DELETE CASCADE (deleting student deletes their invoices)

6. **InvoiceDetails.invoice_id** → Invoice.invoice_id
   - ON DELETE CASCADE (deleting invoice deletes its details)

7. **InvoiceDetails.food_item_id** → FoodItem.food_item_id
   - ON DELETE RESTRICT (cannot delete food item used in invoices)

8. **HealthRecord.student_id** → Student.student_id
   - ON DELETE CASCADE

9. **NutritionAnalysis.student_id** → Student.student_id
   - ON DELETE CASCADE

---

## 5. CARDINALITY SUMMARY

| Relationship | Type | Notation |
|-------------|------|----------|
| Department → Batch | 1:N | 1 department has 0 to many batches |
| Department → Student | 1:N | 1 department has 0 to many students |
| Batch → Student | 1:N | 1 batch has 0 to many students |
| FoodCategory → FoodItem | 1:N | 1 category has 0 to many items |
| Student → Invoice | 1:N | 1 student has 0 to many invoices |
| Student → HealthRecord | 1:N | 1 student has 0 to many health records |
| Student → NutritionAnalysis | 1:N | 1 student has 0 to many analyses |
| Invoice ←→ FoodItem | M:N | Resolved via InvoiceDetails |

---

## 6. VISUAL ER DIAGRAM (ASCII)

```
┌─────────────┐
│ Department  │
│─────────────│
│ PK: dept_id │──┐
│ dept_name   │  │ 1:N
└─────────────┘  │
                 ├──────┐
┌─────────────┐  │      │
│   Batch     │  │      │
│─────────────│  │      │
│ PK: batch_id│──┼──┐   │
│ batch_num   │  │  │   │
│FK: dept_id  │◄─┘  │   │
└─────────────┘     │   │
                    │ 1:N
┌──────────────┐    │   │
│   Student    │    │   │
│──────────────│    │   │
│PK:student_id │◄───┘   │
│ student_name │        │
│FK: dept_id   │◄───────┘
│FK: batch_id  │
└──────────────┘
      │ 1:N
      ├─────────────────────────┐
      │                         │
      ▼                         ▼
┌──────────┐            ┌────────────────┐
│ Invoice  │            │  HealthRecord  │
│──────────│            │────────────────│
│PK:inv_id │──┐         │PK: health_id   │
│FK:stu_id │  │ 1:N     │FK: student_id  │
│total_cal │  │         │height, weight  │
│total_pro │  │         │bmi             │
└──────────┘  │         └────────────────┘
              │
              ▼
      ┌──────────────┐         ┌──────────────┐
      │InvoiceDetails│    M:N  │  FoodItem    │
      │──────────────│◄────────│──────────────│
      │PK: detail_id │         │PK: food_id   │
      │FK: invoice_id│         │FK: category  │
      │FK: food_id   │         │food_name     │
      │quantity      │         │price, cal    │
      │subtotal_*    │         │protein, etc  │
      └──────────────┘         └──────────────┘
                                      ▲
                                      │ 1:N
                               ┌──────────────┐
                               │FoodCategory  │
                               │──────────────│
                               │PK:category_id│
                               │category_name │
                               └──────────────┘
```

---

## 7. VIVA QUESTIONS & ANSWERS

### Q1: Why did you normalize the database to 3NF?
**A:** To eliminate data redundancy, ensure data integrity, reduce update anomalies, and make the database more maintainable. 3NF ensures that all non-key attributes depend only on the primary key and not on other non-key attributes.

### Q2: Explain the many-to-many relationship in your schema.
**A:** The Invoice and FoodItem relationship is many-to-many. One invoice can have multiple food items, and one food item can appear in multiple invoices. We resolved this using the InvoiceDetails junction table, which stores the relationship with additional attributes like quantity and subtotals.

### Q3: Why did you store calculated values (BMI, total_calories) in tables?
**A:** For performance and historical tracking. BMI changes over time as weight/height change, so storing it preserves the exact value at that moment. Invoice totals are stored to avoid recalculation on every query. This is a controlled denormalization for practical benefits.

### Q4: What are the advantages of using foreign keys?
**A:** Foreign keys enforce referential integrity, prevent orphaned records, maintain data consistency, and enable CASCADE operations for related data management.

### Q5: How does your schema support ACID properties?
**A:** Using InnoDB engine with transactions, primary keys ensure entity integrity, foreign keys ensure referential integrity, and proper constraints prevent invalid data states.

---

**End of ER Diagram Documentation**
