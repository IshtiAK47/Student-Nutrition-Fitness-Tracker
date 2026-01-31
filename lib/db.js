// ================================================================
// DATABASE CONNECTION LIBRARY
// ================================================================
// This module provides MySQL database connection using mysql2
// RAW SQL queries only - NO ORM
// ================================================================

import mysql from 'mysql2/promise';

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nutrition_tracker',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool for better performance
let pool;

/**
 * Get database connection pool
 * Reuses existing pool or creates new one
 */
export function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

/**
 * Execute a SQL query
 * @param {string} query - SQL query to execute
 * @param {array} params - Query parameters for prepared statements
 * @returns {Promise} Query results
 */
export async function executeQuery(query, params = []) {
  try {
    const pool = getPool();
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Execute multiple queries in a transaction
 * @param {function} callback - Function containing queries to execute
 * @returns {Promise} Transaction results
 */
export async function executeTransaction(callback) {
  const pool = getPool();
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    console.error('Transaction error:', error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Test database connection
 * @returns {Promise<boolean>} Connection status
 */
export async function testConnection() {
  try {
    const pool = getPool();
    await pool.query('SELECT 1');
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

export default {
  getPool,
  executeQuery,
  executeTransaction,
  testConnection
};
