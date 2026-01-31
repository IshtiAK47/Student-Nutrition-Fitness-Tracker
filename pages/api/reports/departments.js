// ================================================================
// API ROUTE: Get Department Statistics
// ================================================================
// Endpoint: GET /api/reports/departments
// Purpose: Get department-wise statistics (avg BMI, nutrition intake)
// Used by: Teachers and Medical Officers for analysis
// ================================================================

import { executeQuery } from '../../../lib/db';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Query: Department-wise average BMI
    const bmiQuery = `
      SELECT 
        d.department_name,
        COUNT(DISTINCT s.student_id) as total_students,
        COUNT(DISTINCT hr.health_record_id) as students_with_health_records,
        COALESCE(AVG(hr.bmi), 0) as avg_bmi,
        COALESCE(MIN(hr.bmi), 0) as min_bmi,
        COALESCE(MAX(hr.bmi), 0) as max_bmi
      FROM Department d
      LEFT JOIN Student s ON d.department_id = s.department_id
      LEFT JOIN HealthRecord hr ON s.student_id = hr.student_id
      GROUP BY d.department_id, d.department_name
      ORDER BY d.department_name
    `;

    const bmiStats = await executeQuery(bmiQuery);

    // Query: Department-wise nutrition intake (last 30 days)
    const nutritionQuery = `
      SELECT 
        d.department_name,
        COUNT(DISTINCT i.invoice_id) as total_invoices,
        COALESCE(AVG(i.total_calories), 0) as avg_calories_per_meal,
        COALESCE(AVG(i.total_protein), 0) as avg_protein_per_meal,
        COALESCE(SUM(i.total_price), 0) as total_spent
      FROM Department d
      LEFT JOIN Student s ON d.department_id = s.department_id
      LEFT JOIN Invoice i ON s.student_id = i.student_id
        AND i.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY d.department_id, d.department_name
      ORDER BY d.department_name
    `;

    const nutritionStats = await executeQuery(nutritionQuery);

    // Combine results
    const departmentStats = bmiStats.map((dept, index) => ({
      department_name: dept.department_name,
      health: {
        total_students: dept.total_students,
        students_with_health_records: dept.students_with_health_records,
        avg_bmi: parseFloat(dept.avg_bmi).toFixed(2),
        min_bmi: parseFloat(dept.min_bmi).toFixed(2),
        max_bmi: parseFloat(dept.max_bmi).toFixed(2)
      },
      nutrition_last_30_days: {
        total_invoices: nutritionStats[index].total_invoices,
        avg_calories_per_meal: parseFloat(nutritionStats[index].avg_calories_per_meal).toFixed(2),
        avg_protein_per_meal: parseFloat(nutritionStats[index].avg_protein_per_meal).toFixed(2),
        total_spent: parseFloat(nutritionStats[index].total_spent).toFixed(2)
      }
    }));

    res.status(200).json({
      success: true,
      department_statistics: departmentStats
    });

  } catch (error) {
    console.error('Department stats error:', error);
    res.status(500).json({ error: 'Failed to fetch department statistics' });
  }
}
