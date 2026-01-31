// ================================================================
// API ROUTE: Create Invoice
// ================================================================
// Endpoint: POST /api/invoices
// Purpose: Create new invoice with multiple food items
// Used by: Canteen staff
// Transaction ensures data consistency between Invoice and InvoiceDetails
// ================================================================

import { executeTransaction } from '../../lib/db';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { student_id, student_name, department, created_by, items } = req.body;

  // Validate input
  if (!student_id || !student_name || !department || !created_by || !items || items.length === 0) {
    return res.status(400).json({ 
      error: 'student_id, student_name, department, created_by, and items are required' 
    });
  }

  try {
    // Use transaction to ensure data consistency
    const result = await executeTransaction(async (connection) => {
      
      // Step 0: Ensure student exists (insert or update)
      // First check if student exists
      const [existingStudents] = await connection.execute(
        'SELECT student_id FROM Student WHERE student_id = ?',
        [student_id]
      );

      if (existingStudents.length === 0) {
        // Extract batch number from student ID (e.g., B220102002 → 22 → Batch 2, B210... → Batch 1)
        const batchYear = student_id.substring(1, 3); // Get characters after 'B' (position 1-2)
        const batch_number = parseInt(batchYear.charAt(1)); // Get last digit (B22 → 2, B21 → 1)
        
        // Get or create department
        let department_id;
        const [existingDepts] = await connection.execute(
          'SELECT department_id FROM Department WHERE department_name = ?',
          [department]
        );

        if (existingDepts.length > 0) {
          department_id = existingDepts[0].department_id;
        } else {
          // Create new department
          const [deptResult] = await connection.execute(
            'INSERT INTO Department (department_name) VALUES (?)',
            [department]
          );
          department_id = deptResult.insertId;
        }

        // Get or create batch for this department and batch number
        const [batches] = await connection.execute(
          'SELECT batch_id FROM Batch WHERE department_id = ? AND batch_number = ?',
          [department_id, batch_number]
        );

        let batch_id;
        if (batches.length > 0) {
          batch_id = batches[0].batch_id;
        } else {
          // Create new batch with the extracted batch number
          const [batchResult] = await connection.execute(
            'INSERT INTO Batch (batch_number, department_id) VALUES (?, ?)',
            [batch_number, department_id]
          );
          batch_id = batchResult.insertId;
        }

        // Insert new student
        await connection.execute(
          'INSERT INTO Student (student_id, student_name, department_id, batch_id) VALUES (?, ?, ?, ?)',
          [student_id, student_name, department_id, batch_id]
        );
      } else {
        // Update existing student name if provided
        await connection.execute(
          'UPDATE Student SET student_name = ? WHERE student_id = ?',
          [student_name, student_id]
        );
      }
      
      // Step 1: Calculate totals
      let total_price = 0;
      let total_calories = 0;
      let total_protein = 0;
      let total_carbs = 0;
      let total_fat = 0;

      // Fetch food item details and calculate subtotals
      const itemDetails = [];
      
      for (const item of items) {
        const [foodItems] = await connection.execute(
          'SELECT * FROM FoodItem WHERE food_item_id = ?',
          [item.food_item_id]
        );

        if (foodItems.length === 0) {
          throw new Error(`Food item ${item.food_item_id} not found`);
        }

        const foodItem = foodItems[0];
        const quantity = item.quantity || 1;

        // Calculate subtotals
        const subtotal_price = parseFloat(foodItem.price) * quantity;
        const subtotal_calories = parseFloat(foodItem.calories) * quantity;
        const subtotal_protein = parseFloat(foodItem.protein) * quantity;
        const subtotal_carbs = parseFloat(foodItem.carbs) * quantity;
        const subtotal_fat = parseFloat(foodItem.fat) * quantity;

        // Add to totals
        total_price += subtotal_price;
        total_calories += subtotal_calories;
        total_protein += subtotal_protein;
        total_carbs += subtotal_carbs;
        total_fat += subtotal_fat;

        itemDetails.push({
          food_item_id: item.food_item_id,
          quantity,
          subtotal_price,
          subtotal_calories,
          subtotal_protein,
          subtotal_carbs,
          subtotal_fat
        });
      }

      // Step 2: Insert Invoice
      const insertInvoiceQuery = `
        INSERT INTO Invoice (
          student_id, created_by, 
          total_price, total_calories, total_protein, total_carbs, total_fat
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const [invoiceResult] = await connection.execute(insertInvoiceQuery, [
        student_id,
        created_by,
        total_price.toFixed(2),
        total_calories.toFixed(2),
        total_protein.toFixed(2),
        total_carbs.toFixed(2),
        total_fat.toFixed(2)
      ]);

      const invoice_id = invoiceResult.insertId;

      // Step 3: Insert Invoice Details
      const insertDetailsQuery = `
        INSERT INTO InvoiceDetails (
          invoice_id, food_item_id, quantity,
          subtotal_price, subtotal_calories, subtotal_protein, subtotal_carbs, subtotal_fat
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      for (const detail of itemDetails) {
        await connection.execute(insertDetailsQuery, [
          invoice_id,
          detail.food_item_id,
          detail.quantity,
          detail.subtotal_price.toFixed(2),
          detail.subtotal_calories.toFixed(2),
          detail.subtotal_protein.toFixed(2),
          detail.subtotal_carbs.toFixed(2),
          detail.subtotal_fat.toFixed(2)
        ]);
      }

      // Return invoice data
      return {
        invoice_id,
        student_id,
        total_price: parseFloat(total_price.toFixed(2)),
        total_calories: parseFloat(total_calories.toFixed(2)),
        total_protein: parseFloat(total_protein.toFixed(2)),
        total_carbs: parseFloat(total_carbs.toFixed(2)),
        total_fat: parseFloat(total_fat.toFixed(2)),
        items_count: itemDetails.length
      };
    });

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      invoice: result
    });

  } catch (error) {
    console.error('Invoice creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create invoice',
      details: error.message 
    });
  }
}
