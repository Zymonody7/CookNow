// Database Initialization Script
// Run this script to create the necessary tables in PostgreSQL

import { initDatabase } from '../lib/db'

async function main() {
  console.log('🚀 Initializing CookNow database...')

  try {
    await initDatabase()
    console.log('✅ Database initialized successfully!')
    console.log('\nTables created:')
    console.log('  - recipes')
    console.log('  - user_ingredients')
    console.log('  - shopping_list')
    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to initialize database:', error)
    process.exit(1)
  }
}

main()
