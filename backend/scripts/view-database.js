#!/usr/bin/env node

/**
 * Database viewer script
 * Run this to see all users and data in your database
 */

import database from '../database/database.js';

const viewDatabase = async () => {
  try {
    console.log('🔍 Viewing Connect Studio Database...\n');
    
    // Connect to database
    await database.connect();
    
    // Get all users
    console.log('👥 USERS:');
    console.log('=' .repeat(50));
    const users = await database.query('SELECT id, email, created_at FROM users ORDER BY created_at DESC');
    
    if (users.length === 0) {
      console.log('   No users found. Register a user first!');
    } else {
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ID: ${user.id}`);
        console.log(`      Email: ${user.email}`);
        console.log(`      Created: ${user.created_at}`);
        console.log('');
      });
    }
    
    // Get all projects
    console.log('\n📁 PROJECTS:');
    console.log('=' .repeat(50));
    const projects = await database.query(`
      SELECT p.id, p.title, p.status, u.email as user_email, p.created_at 
      FROM projects p 
      JOIN users u ON p.user_id = u.id 
      ORDER BY p.created_at DESC
    `);
    
    if (projects.length === 0) {
      console.log('   No projects found.');
    } else {
      projects.forEach((project, index) => {
        console.log(`   ${index + 1}. "${project.title}" (ID: ${project.id})`);
        console.log(`      User: ${project.user_email}`);
        console.log(`      Status: ${project.status}`);
        console.log(`      Created: ${project.created_at}`);
        console.log('');
      });
    }
    
    // Get all media files
    console.log('\n🖼️  MEDIA FILES:');
    console.log('=' .repeat(50));
    const mediaFiles = await database.query(`
      SELECT m.id, m.original_filename, m.file_type, m.file_size, p.title as project_title, u.email as user_email
      FROM media_files m 
      JOIN projects p ON m.project_id = p.id
      JOIN users u ON p.user_id = u.id 
      ORDER BY m.created_at DESC
    `);
    
    if (mediaFiles.length === 0) {
      console.log('   No media files found.');
    } else {
      mediaFiles.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file.original_filename} (${file.file_type})`);
        console.log(`      Project: "${file.project_title}"`);
        console.log(`      User: ${file.user_email}`);
        console.log(`      Size: ${(file.file_size / 1024 / 1024).toFixed(2)} MB`);
        console.log('');
      });
    }
    
    // Summary
    console.log('\n📊 SUMMARY:');
    console.log('=' .repeat(50));
    console.log(`   Total Users: ${users.length}`);
    console.log(`   Total Projects: ${projects.length}`);
    console.log(`   Total Media Files: ${mediaFiles.length}`);
    
    const totalSize = mediaFiles.reduce((sum, file) => sum + file.file_size, 0);
    console.log(`   Total Storage Used: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    
  } catch (error) {
    console.error('❌ Error viewing database:', error);
  } finally {
    await database.close();
  }
};

// Run viewer
viewDatabase();
