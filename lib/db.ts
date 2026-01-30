// PostgreSQL Database Connection for Next.js
// Adapted from dreamweaver project

import { Pool } from 'pg'

let pool: Pool | null = null

export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    })
  }
  return pool
}

export async function query(text: string, params?: any[]) {
  const pool = getPool()
  const result = await pool.query(text, params)
  return result
}

// Initialize database tables for CookNow
export async function initDatabase() {
  const pool = getPool()

  // Create recipes table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS recipes (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      cuisine VARCHAR(100),
      flavors TEXT[],
      time_minutes INTEGER,
      difficulty VARCHAR(50),
      steps TEXT[],
      ingredients_required JSONB,
      nutrition JSONB,
      is_leftover_rescue BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create user_ingredients table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_ingredients (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255),
      name VARCHAR(255) NOT NULL,
      amount VARCHAR(50),
      unit VARCHAR(50),
      category VARCHAR(100),
      expiry_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create shopping_list table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shopping_list (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255),
      ingredient_name VARCHAR(255) NOT NULL,
      amount VARCHAR(50),
      unit VARCHAR(50),
      is_purchased BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  console.log('Database tables initialized successfully')
}

// Save recipe to database
export async function saveRecipe(recipe: any) {
  const result = await query(
    `INSERT INTO recipes (title, cuisine, flavors, time_minutes, difficulty, steps, ingredients_required, nutrition, is_leftover_rescue)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      recipe.title,
      recipe.cuisine,
      recipe.flavors,
      recipe.timeMinutes,
      recipe.difficulty,
      recipe.steps,
      JSON.stringify(recipe.ingredientsRequired),
      JSON.stringify(recipe.nutrition),
      recipe.isLeftoverRescue
    ]
  )
  return result.rows[0]
}

// Get recipes from database
export async function getRecipes(limit: number = 10) {
  const result = await query(
    `SELECT * FROM recipes ORDER BY created_at DESC LIMIT $1`,
    [limit]
  )
  return result.rows
}

// Save ingredient to database
export async function saveIngredient(ingredient: any, userId: string = 'default') {
  const result = await query(
    `INSERT INTO user_ingredients (user_id, name, amount, unit, category, expiry_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      userId,
      ingredient.name,
      ingredient.amount,
      ingredient.unit,
      ingredient.category,
      ingredient.expiryDate
    ]
  )
  return result.rows[0]
}
