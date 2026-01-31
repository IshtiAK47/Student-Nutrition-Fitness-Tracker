# QUICK START GUIDE

## For First-Time Setup (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Database (Automated)
**Option A - Windows (Easiest):**
```bash
setup-database.bat
```
Follow the prompts to enter your MySQL credentials.

**Option B - Manual:**
```bash
mysql -u root -p
CREATE DATABASE nutrition_tracker;
exit

mysql -u root -p nutrition_tracker < database/schema.sql
mysql -u root -p nutrition_tracker < database/seed.sql
```

### Step 3: Configure Environment
Edit `.env.local` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=nutrition_tracker
DB_PORT=3306
```

### Step 4: Start Application
```bash
npm run dev
```

### Step 5: Open Browser
Visit: **http://localhost:3000**

---

## Quick Test

### Test 1: Canteen System
1. Click "Open Canteen System"
2. Enter Student ID: `B220102002`
3. Click "Search Student"
4. Select some food items
5. Click "Create Invoice"

✅ **Expected:** Invoice created with total price and nutrition

### Test 2: Medical Dashboard
1. Click "Open Medical Dashboard"
2. Enter Student ID: `B220102002`
3. Select "Last 7 days"
4. Click "Load Data"

✅ **Expected:** Nutrition summary with charts and analysis

---

## Sample Test Data

### Students
- **B220102002** - Ishtiak Mahmood (ICT, Batch 2) ⭐ Required
- **B220101001** - Anika Rahman (ICT, Batch 1)
- **B220202001** - Fahim Ahmed (CSE, Batch 2)
- **B220301001** - Sadia Sultana (BBA, Batch 1)

### Popular Food Items
- Rice + Dal (Unlimited) - ৳25
- Beef (Full Plate) - ৳110
- Khichuri + Dim + Vorta - ৳50
- Milk Tea - ৳8

---

## Troubleshooting

### Problem: "Cannot find module 'mysql2'"
**Solution:**
```bash
npm install mysql2
```

### Problem: "Database connection failed"
**Solution:**
1. Check MySQL is running
2. Verify credentials in `.env.local`
3. Test connection: `mysql -u root -p`

### Problem: "Student not found"
**Solution:**
1. Verify database is seeded
2. Check Student ID: `B220102002`
3. Run: `mysql -u root -p nutrition_tracker < database/seed.sql`

### Problem: "Port 3000 in use"
**Solution:**
```bash
npm run dev -- -p 3001
```

---

## Important Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `SETUP_GUIDE.md` | Detailed installation |
| `VIVA_QUESTIONS.md` | Viva preparation |
| `PROJECT_SUMMARY.md` | Complete summary |
| `database/schema.sql` | Database structure |
| `database/seed.sql` | Sample data |
| `database/queries.sql` | Important queries |
| `database/ER_DIAGRAM.md` | Database design |

---

## For Viva Demonstration

### 1. Show Database Design
```sql
USE nutrition_tracker;
SHOW TABLES;
DESCRIBE Student;
DESCRIBE Invoice;
```

### 2. Run Important Query
```sql
-- Daily calorie intake
SELECT 
    s.student_name,
    DATE(i.created_at) as date,
    SUM(i.total_calories) as daily_calories
FROM Student s
INNER JOIN Invoice i ON s.student_id = i.student_id
WHERE s.student_id = 'B220102002'
GROUP BY s.student_name, DATE(i.created_at);
```

### 3. Show Working Application
1. Create new invoice
2. View nutrition summary
3. Add health record

### 4. Explain Normalization
- Show ER diagram in `database/ER_DIAGRAM.md`
- Explain 1NF, 2NF, 3NF
- Point out foreign keys

---

## Key Points to Remember

✅ Database is in **3NF** (normalized)  
✅ Uses **RAW SQL** (no ORM)  
✅ Has **transactions** for data integrity  
✅ Includes **complex JOINs** and aggregations  
✅ Real canteen data with **actual prices**  
✅ Required student **Ishtiak Mahmood** included  

---

## Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Setup database (Windows)
setup-database.bat

# Test database connection
mysql -u root -p nutrition_tracker -e "SELECT COUNT(*) FROM Student;"
```

---

## Next Steps After Setup

1. ✅ Test all features
2. ✅ Review SQL queries in `database/queries.sql`
3. ✅ Read `VIVA_QUESTIONS.md`
4. ✅ Practice explaining database design
5. ✅ Prepare for demonstration

---

**Need help?** Check `SETUP_GUIDE.md` for detailed instructions.

**Ready for viva?** Review `VIVA_QUESTIONS.md` for 20+ Q&A.

**Want to understand design?** Read `database/ER_DIAGRAM.md`.

---

Good luck! 🚀
