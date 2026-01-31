# Student Nutrition and Fitness Tracker

**DBMS Project - 4th Semester BSc in ICT**

## Project Overview
A comprehensive database management system for tracking student nutrition intake and fitness records in a university canteen environment.

### Academic Focus
- ✅ Database Design & Normalization (1NF, 2NF, 3NF)
- ✅ Raw SQL Queries (JOINs, Aggregations, GROUP BY)
- ✅ Data Analysis & Reporting
- ✅ Referential Integrity

## Tech Stack
- **Framework**: Next.js (Full-stack)
- **Database**: MySQL
- **SQL Library**: mysql2 (RAW SQL - No ORM)
- **Styling**: Bootstrap 5

## University Structure
- **Departments**: ICT, CSE, BBA
- **Batches per Department**: 4 (Total: 12 batches)
- **Users**: Canteen Staff, Teachers, Medical Officers

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database
1. Create MySQL database:
```sql
CREATE DATABASE nutrition_tracker;
```

2. Update `.env.local` with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=nutrition_tracker
```

### 3. Initialize Database
Run the schema and seed files in MySQL:
```bash
mysql -u root -p nutrition_tracker < database/schema.sql
mysql -u root -p nutrition_tracker < database/seed.sql
```

### 4. Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

## Database Schema

### Tables (Normalized to 3NF)
1. **Department** - University departments
2. **Batch** - Student batches per department
3. **Student** - Student information
4. **FoodCategory** - Food categories
5. **FoodItem** - Menu items with nutritional data
6. **Invoice** - Purchase transactions
7. **InvoiceDetails** - Line items for each invoice
8. **HealthRecord** - Student health metrics
9. **NutritionAnalysis** - Dietary analysis and recommendations

## User Modules

### 1. Canteen Staff
- Create invoices by student ID
- Select multiple food items
- Auto-calculate nutritional totals

### 2. Teacher/Medical Officer
- View student profiles
- Add health records (height, weight, BMI)
- Analyze nutrition intake
- Generate deficiency reports

## Key Features
- Real canteen menu with pricing
- Nutritional tracking (calories, protein, carbs, fat)
- BMI calculation and health monitoring
- Deficiency detection and recommendations
- Department-wise analytics

## Project Structure
```
├── database/
│   ├── schema.sql          # Database schema (3NF)
│   ├── seed.sql            # Sample data
│   ├── queries.sql         # Important SQL queries
│   └── ER_DIAGRAM.md       # ER diagram documentation
├── lib/
│   └── db.js              # MySQL connection
├── pages/
│   ├── api/               # API routes (raw SQL)
│   ├── index.js           # Landing page
│   ├── canteen.js         # Canteen invoice system
│   └── medical.js         # Teacher/Medical dashboard
└── public/
    └── ...
```

## Important SQL Queries
See `database/queries.sql` for:
- Daily calorie intake per student
- Department-wise average BMI
- Students with nutrition deficiency
- Top consumed food items
- Weekly nutrition trends

## Sample Data
- Sample Student: **Ishtiak Mahmood** (B220102002, ICT, Batch 2)
- Complete canteen menu with nutritional information
- Multiple departments and batches

## Viva Preparation
- Database normalized to 3NF (explained in ER_DIAGRAM.md)
- All SQL queries use JOINs and aggregations
- Code includes detailed comments
- Simple, readable, and explainable


