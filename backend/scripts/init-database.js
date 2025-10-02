#!/usr/bin/env node

/**
 * Database initialization script
 * Run this to set up the database schema and initial data
 */

import database from '../database/database.js';
import { config } from '../config.js';

const initDatabase = async () => {
  try {
    console.log('🗄️  Initializing Connect Studio Database...');
    console.log(`📍 Database location: ${config.DB_PATH}`);
    
    // Connect to database
    await database.connect();
    console.log('✅ Connected to database');
    
    // Initialize schema
    await database.initSchema();
    console.log('✅ Database schema initialized');
    
    // Verify tables were created
    const tables = await database.query(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);
    
    console.log('\n📋 Created tables:');
    tables.forEach(table => {
      console.log(`   - ${table.name}`);
    });
    
    // Check themes
    const themeCount = await database.get('SELECT COUNT(*) as count FROM themes');
    console.log(`\n🎨 Themes available: ${themeCount.count}`);
    
    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\nYou can now start the server with: npm start');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await database.close();
  }
};

// Run initialization
initDatabase();
