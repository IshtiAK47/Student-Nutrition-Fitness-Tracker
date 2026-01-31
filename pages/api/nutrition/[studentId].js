// ================================================================
// API ROUTE: Get Student Nutrition Summary
// ================================================================
// Endpoint: GET /api/nutrition/[studentId]
// Purpose: Analyze student's nutrition intake over a period
// Used by: Teachers and Medical Officers
// ================================================================

import { executeQuery } from '../../../lib/db';

export default async function handler(req, res) {
  const { studentId } = req.query;
  const { period_days = 7 } = req.query; // Default 7 days

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!studentId) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  try {
    // Query 1: Get student basic info
    const studentQuery = `
      SELECT 
        s.student_id,
        s.student_name,
        d.department_name,
        b.batch_number
      FROM Student s
      INNER JOIN Department d ON s.department_id = d.department_id
      INNER JOIN Batch b ON s.batch_id = b.batch_id
      WHERE s.student_id = ?
    `;
    
    const studentResults = await executeQuery(studentQuery, [studentId]);
    
    if (studentResults.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const student = studentResults[0];

    // Query 2: Calculate nutrition totals for the period using aggregation
    const nutritionQuery = `
      SELECT 
        COUNT(i.invoice_id) as total_invoices,
        COALESCE(SUM(i.total_calories), 0) as total_calories,
        COALESCE(SUM(i.total_protein), 0) as total_protein,
        COALESCE(SUM(i.total_carbs), 0) as total_carbs,
        COALESCE(SUM(i.total_fat), 0) as total_fat,
        COALESCE(SUM(i.total_price), 0) as total_spent,
        COALESCE(AVG(i.total_calories), 0) as avg_calories_per_meal,
        COALESCE(AVG(i.total_protein), 0) as avg_protein_per_meal
      FROM Invoice i
      WHERE i.student_id = ?
        AND i.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    `;

    const nutritionResults = await executeQuery(nutritionQuery, [studentId, period_days]);
    const nutrition = nutritionResults[0];

    // Calculate daily averages
    const days = parseInt(period_days);
    const avg_daily_calories = parseFloat(nutrition.total_calories) / days;
    const avg_daily_protein = parseFloat(nutrition.total_protein) / days;
    const avg_daily_carbs = parseFloat(nutrition.total_carbs) / days;
    const avg_daily_fat = parseFloat(nutrition.total_fat) / days;

    // Query 3: Get latest health record
    const healthQuery = `
      SELECT 
        height, weight, bmi, recorded_at, notes
      FROM HealthRecord
      WHERE student_id = ?
      ORDER BY recorded_at DESC
      LIMIT 1
    `;

    const healthResults = await executeQuery(healthQuery, [studentId]);
    const latest_health = healthResults.length > 0 ? healthResults[0] : null;

    // Query 4: Get recent invoices
    const recentInvoicesQuery = `
      SELECT 
        invoice_id,
        total_price,
        total_calories,
        total_protein,
        total_carbs,
        total_fat,
        created_at
      FROM Invoice
      WHERE student_id = ?
        AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      ORDER BY created_at DESC
      LIMIT 10
    `;

    const recentInvoices = await executeQuery(recentInvoicesQuery, [studentId, period_days]);

    // Analyze nutrition status
    // Standard: 2000-2500 kcal/day, 50-60g protein/day
    let calorie_status = 'Normal';
    let protein_status = 'Normal';
    let advice = [];

    if (avg_daily_calories < 1500) {
      calorie_status = 'Low';
      advice.push('Your daily calorie intake is below recommended levels. Consider eating more balanced meals.');
    } else if (avg_daily_calories > 3000) {
      calorie_status = 'High';
      advice.push('Your calorie intake is high. Consider portion control and healthier food choices.');
    }

    if (avg_daily_protein < 40) {
      protein_status = 'Low';
      advice.push('Protein intake is insufficient. Include more fish, chicken, eggs, and dal in your diet.');
    } else if (avg_daily_protein > 100) {
      protein_status = 'High';
      advice.push('Protein intake is very high. Ensure balanced nutrition with vegetables and carbs.');
    }

    if (advice.length === 0) {
      advice.push('Your nutrition intake is balanced. Keep maintaining a healthy diet!');
    }

    // Return comprehensive summary
    res.status(200).json({
      success: true,
      student,
      period: {
        days: days,
        period_start: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        period_end: new Date().toISOString().split('T')[0]
      },
      nutrition_summary: {
        total_invoices: nutrition.total_invoices,
        total_spent: parseFloat(nutrition.total_spent).toFixed(2),
        total_calories: parseFloat(nutrition.total_calories).toFixed(2),
        total_protein: parseFloat(nutrition.total_protein).toFixed(2),
        total_carbs: parseFloat(nutrition.total_carbs).toFixed(2),
        total_fat: parseFloat(nutrition.total_fat).toFixed(2),
        avg_daily_calories: avg_daily_calories.toFixed(2),
        avg_daily_protein: avg_daily_protein.toFixed(2),
        avg_daily_carbs: avg_daily_carbs.toFixed(2),
        avg_daily_fat: avg_daily_fat.toFixed(2),
        avg_calories_per_meal: parseFloat(nutrition.avg_calories_per_meal).toFixed(2),
        avg_protein_per_meal: parseFloat(nutrition.avg_protein_per_meal).toFixed(2)
      },
      analysis: {
        calorie_status,
        protein_status,
        advice: advice.join(' ')
      },
      latest_health,
      recent_invoices: recentInvoices
    });

  } catch (error) {
    console.error('Nutrition summary error:', error);
    res.status(500).json({ error: 'Failed to fetch nutrition summary' });
  }
}
