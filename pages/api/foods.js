// ================================================================
// API ROUTE: Get All Food Items
// ================================================================
// Endpoint: GET /api/foods
// Purpose: Fetch all available food items with categories
// Used by: Canteen staff for invoice creation
// ================================================================

import { executeQuery } from '../../lib/db';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // RAW SQL Query with JOIN
    // Retrieves all food items grouped by category
    const query = `
      SELECT 
        f.food_item_id,
        f.food_name,
        f.price,
        f.calories,
        f.protein,
        f.carbs,
        f.fat,
        f.is_available,
        c.category_id,
        c.category_name
      FROM FoodItem f
      INNER JOIN FoodCategory c ON f.category_id = c.category_id
      WHERE f.is_available = 1
      ORDER BY c.category_id, f.food_name
    `;

    const results = await executeQuery(query);

    // Group food items by category
    const categories = {};
    
    results.forEach(item => {
      const categoryName = item.category_name;
      
      if (!categories[categoryName]) {
        categories[categoryName] = {
          category_id: item.category_id,
          category_name: categoryName,
          items: []
        };
      }
      
      categories[categoryName].items.push({
        food_item_id: item.food_item_id,
        food_name: item.food_name,
        price: parseFloat(item.price),
        calories: parseFloat(item.calories),
        protein: parseFloat(item.protein),
        carbs: parseFloat(item.carbs),
        fat: parseFloat(item.fat)
      });
    });

    // Convert to array
    const categoriesArray = Object.values(categories);

    res.status(200).json({
      success: true,
      categories: categoriesArray,
      total_items: results.length
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch food items' });
  }
}
