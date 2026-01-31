// ================================================================
// API ROUTE: Add Health Record
// ================================================================
// Endpoint: POST /api/health
// Purpose: Add health record for a student (height, weight, BMI)
// Used by: Teachers and Medical Officers
// ================================================================

import { executeQuery } from '../../lib/db';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { student_id, height, weight, recorded_by, notes } = req.body;

  // Validate input
  if (!student_id || !height || !weight || !recorded_by) {
    return res.status(400).json({ 
      error: 'student_id, height, weight, and recorded_by are required' 
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

    // Calculate BMI = weight / (height in meters)^2
    const heightInMeters = parseFloat(height) / 100;
    const bmi = parseFloat(weight) / (heightInMeters * heightInMeters);

    // Insert health record
    const insertQuery = `
      INSERT INTO HealthRecord (
        student_id, height, weight, bmi, recorded_by, notes
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = await executeQuery(insertQuery, [
      student_id,
      parseFloat(height).toFixed(2),
      parseFloat(weight).toFixed(2),
      bmi.toFixed(2),
      recorded_by,
      notes || null
    ]);

    // Determine BMI category
    let bmi_category = '';
    if (bmi < 18.5) {
      bmi_category = 'Underweight';
    } else if (bmi < 25) {
      bmi_category = 'Normal weight';
    } else if (bmi < 30) {
      bmi_category = 'Overweight';
    } else {
      bmi_category = 'Obese';
    }

    res.status(201).json({
      success: true,
      message: 'Health record added successfully',
      health_record: {
        health_record_id: result.insertId,
        student_id,
        height: parseFloat(height).toFixed(2),
        weight: parseFloat(weight).toFixed(2),
        bmi: bmi.toFixed(2),
        bmi_category,
        recorded_by
      }
    });

  } catch (error) {
    console.error('Health record error:', error);
    res.status(500).json({ error: 'Failed to add health record' });
  }
}
