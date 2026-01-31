// ================================================================
// API ROUTE: Save Nutrition Analysis
// ================================================================
// Endpoint: POST /api/analysis
// Purpose: Save nutrition analysis and recommendations
// Used by: Teachers and Medical Officers
// ================================================================

import { executeQuery } from '../../lib/db';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    student_id,
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
  } = req.body;

  // Validate required fields
  if (!student_id || !period_start || !period_end || !analyzed_by) {
    return res.status(400).json({ 
      error: 'student_id, period_start, period_end, and analyzed_by are required' 
    });
  }

  try {
    // Validate student exists
    const studentCheck = await executeQuery(
      'SELECT student_id FROM Student WHERE student_id = ?',
      [student_id]
    );

    if (studentCheck.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Insert nutrition analysis
    const insertQuery = `
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
      ) VALUES (?, CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await executeQuery(insertQuery, [
      student_id,
      period_start,
      period_end,
      avg_daily_calories || null,
      avg_daily_protein || null,
      avg_daily_carbs || null,
      avg_daily_fat || null,
      calorie_status || 'Normal',
      protein_status || 'Normal',
      advice || null,
      analyzed_by
    ]);

    res.status(201).json({
      success: true,
      message: 'Nutrition analysis saved successfully',
      analysis: {
        analysis_id: result.insertId,
        student_id,
        period_start,
        period_end,
        calorie_status,
        protein_status
      }
    });

  } catch (error) {
    console.error('Analysis save error:', error);
    res.status(500).json({ error: 'Failed to save nutrition analysis' });
  }
}
