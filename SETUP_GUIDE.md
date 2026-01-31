# SETUP GUIDE - Student Nutrition and Fitness Tracker

## Complete Installation & Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn package manager

---

## Step-by-Step Setup

### 1. Install Dependencies

Open terminal in the project directory and run:

```bash
npm install
```

This will install:
- Next.js (framework)
- React (UI library)
- mysql2 (database driver)
- Bootstrap (styling)

---

### 2. Configure MySQL Database

#### 2.1 Create Database

Open MySQL command line or MySQL Workbench and execute:

```sql
CREATE DATABASE nutrition_tracker;
```

#### 2.2 Update Environment Variables

Edit the `.env.local` file in the project root:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=nutrition_tracker
DB_PORT=3306
```

**Important:** Replace `your_mysql_password` with your actual MySQL root password.

---

### 3. Initialize Database Schema

Run the schema file to create all tables:

```bash
mysql -u root -p nutrition_tracker < database/schema.sql
```

Or manually execute in MySQL Workbench:
1. Open `database/schema.sql`
2. Select all content
3. Execute

This creates:
- 9 normalized tables (3NF)
- Foreign key relationships
- Indexes for performance
- Views for common queries

---

### 4. Insert Sample Data

Run the seed file to populate database:

```bash
mysql -u root -p nutrition_tracker < database/seed.sql
```

This inserts:
- 3 departments (ICT, CSE, BBA)
- 12 batches (4 per department)
- Sample students including **Ishtiak Mahmood** (B220102002)
- Complete canteen menu (30+ food items)
- Sample invoices and health records

---

### 5. Verify Database Setup

Connect to MySQL and verify:

```sql
USE nutrition_tracker;

-- Check tables
SHOW TABLES;

-- Verify student Ishtiak Mahmood
SELECT * FROM vw_student_details WHERE student_id = 'B220102002';

-- Check food items
SELECT * FROM vw_menu_items LIMIT 10;

-- Verify data counts
SELECT 
    (SELECT COUNT(*) FROM Department) as departments,
    (SELECT COUNT(*) FROM Student) as students,
    (SELECT COUNT(*) FROM FoodItem) as food_items;
```

Expected output:
- 3 departments
- 13 students
- 30 food items

---

### 6. Start Development Server

Run the Next.js application:

```bash
npm run dev
```

The application will start on: **http://localhost:3000**

---

### 7. Test the Application

#### 7.1 Test Canteen Module
1. Navigate to: http://localhost:3000/canteen
2. Enter Student ID: `B220102002`
3. Click "Search Student"
4. Select food items from menu
5. Create invoice

#### 7.2 Test Medical Module
1. Navigate to: http://localhost:3000/medical
2. Enter Student ID: `B220102002`
3. Select analysis period (7 days)
4. Click "Load Data"
5. View nutrition summary and add health record

---

## Troubleshooting

### Issue 1: Database Connection Error

**Error:** `ER_ACCESS_DENIED_ERROR` or `ECONNREFUSED`

**Solution:**
1. Verify MySQL is running: `mysql --version`
2. Check credentials in `.env.local`
3. Test connection: `mysql -u root -p`

### Issue 2: Module Not Found

**Error:** `Cannot find module 'mysql2'`

**Solution:**
```bash
npm install mysql2
```

### Issue 3: Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Or use different port
npm run dev -- -p 3001
```

### Issue 4: Bootstrap Not Loading

**Solution:**
Clear browser cache and restart server.

---

## Project Structure

```
Nutrition System Cstu/
├── database/
│   ├── schema.sql          # Database schema (3NF)
│   ├── seed.sql            # Sample data
│   ├── queries.sql         # Important SQL queries
│   └── ER_DIAGRAM.md       # ER diagram documentation
├── lib/
│   └── db.js              # MySQL connection library
├── pages/
│   ├── api/               # API routes (RAW SQL)
│   │   ├── students/[studentId].js
│   │   ├── foods.js
│   │   ├── invoices.js
│   │   ├── health.js
│   │   ├── analysis.js
│   │   └── reports/departments.js
│   ├── index.js           # Landing page
│   ├── canteen.js         # Canteen module
│   ├── medical.js         # Medical/Teacher module
│   └── _app.js            # App wrapper
├── .env.local             # Environment variables
├── package.json           # Dependencies
└── README.md             # Documentation
```

---

## API Endpoints

### GET Endpoints
- `GET /api/students/[studentId]` - Get student details
- `GET /api/foods` - Get all food items
- `GET /api/nutrition/[studentId]?period_days=7` - Get nutrition summary
- `GET /api/reports/departments` - Get department statistics

### POST Endpoints
- `POST /api/invoices` - Create new invoice
  ```json
  {
    "student_id": "B220102002",
    "created_by": "canteen_staff",
    "items": [
      {"food_item_id": 7, "quantity": 1}
    ]
  }
  ```

- `POST /api/health` - Add health record
  ```json
  {
    "student_id": "B220102002",
    "height": 175.0,
    "weight": 70.0,
    "recorded_by": "medical"
  }
  ```

- `POST /api/analysis` - Save nutrition analysis
  ```json
  {
    "student_id": "B220102002",
    "period_start": "2026-01-15",
    "period_end": "2026-01-22",
    "calorie_status": "Normal",
    "protein_status": "Normal",
    "advice": "Balanced diet",
    "analyzed_by": "medical"
  }
  ```

---

## Sample Student IDs for Testing

- **B220102002** - Ishtiak Mahmood (ICT, Batch 2)
- **B220101001** - Anika Rahman (ICT, Batch 1)
- **B220202001** - Fahim Ahmed (CSE, Batch 2)
- **B220301001** - Sadia Sultana (BBA, Batch 1)

---

## Important SQL Queries

All important queries are documented in: `database/queries.sql`

Key queries include:
1. Daily calorie intake per student
2. Department-wise average BMI
3. Students with nutrition deficiency
4. Top consumed food items
5. Weekly nutrition trends
6. Complete student profile
7. Invoice details
8. Batch-wise comparison

---

## Viva Preparation

### Key Points to Remember

1. **Database Normalization:**
   - Schema is in 3NF
   - No redundancy
   - All tables have primary keys
   - Foreign keys ensure referential integrity

2. **SQL Features Used:**
   - INNER JOIN, LEFT JOIN
   - GROUP BY, HAVING
   - Aggregation (SUM, AVG, COUNT, MIN, MAX)
   - Date functions
   - Subqueries

3. **Transaction Support:**
   - Invoice creation uses transactions
   - Ensures data consistency between Invoice and InvoiceDetails

4. **Performance Optimization:**
   - Indexes on foreign keys
   - Views for common queries
   - Connection pooling

---

## Production Deployment (Optional)

For production deployment:

1. **Update .env for production:**
```env
DB_HOST=your_production_host
DB_USER=your_production_user
DB_PASSWORD=your_secure_password
NODE_ENV=production
```

2. **Build application:**
```bash
npm run build
```

3. **Start production server:**
```bash
npm start
```

---

## Support & Contact

For issues or questions regarding this DBMS project:
- Review `database/ER_DIAGRAM.md` for database design
- Check `database/queries.sql` for SQL examples
- Refer to `README.md` for project overview

---

**Project developed for DBMS Course - 4th Semester BSc in ICT**

Focus: Database Design, Normalization, SQL Queries, Data Analysis
