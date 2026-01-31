// ================================================================
// API ROUTE: Get Student by Student ID
// ================================================================
// Endpoint: GET /api/students/[studentId]
// Purpose: Fetch student details with department and batch info
// Used by: Canteen staff to verify student before creating invoice
// ================================================================

import { executeQuery } from '../../../lib/db';

export default async function handler(req, res) {
  const { studentId } = req.query;

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate student ID
  if (!studentId) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  try {
    // RAW SQL Query with JOIN
    // Retrieves student information along with department and batch details
    const query = `
      SELECT 
        s.student_id,
        s.student_name,
        s.email,
        s.phone,
        d.department_id,
        d.department_name,
        b.batch_id,
        b.batch_number
      FROM Student s
      INNER JOIN Department d ON s.department_id = d.department_id
      INNER JOIN Batch b ON s.batch_id = b.batch_id
      WHERE s.student_id = ?
    `;

    const results = await executeQuery(query, [studentId]);

    // Check if student exists
    if (results.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Return student details
    res.status(200).json({
      success: true,
      student: results[0]
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch student details' });
  }
}
