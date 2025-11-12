#!/usr/bin/env node

/**
 * Script to switch between MySQL and MSSQL database schemas
 * Usage: node scripts/switch-db.js [mysql|mssql]
 */

const fs = require('fs');
const path = require('path');

const dbType = process.argv[2] || process.env.DB_TYPE || 'mysql';

if (!['mysql', 'mssql'].includes(dbType)) {
  console.error('❌ Invalid database type. Use "mysql" or "mssql"');
  process.exit(1);
}

const schemaSource = path.join(__dirname, '..', 'prisma', `schema.${dbType}.prisma`);
const schemaTarget = path.join(__dirname, '..', 'prisma', 'schema.prisma');

try {
  // Copy the appropriate schema file
  fs.copyFileSync(schemaSource, schemaTarget);
  console.log(`✅ Switched to ${dbType.toUpperCase()} schema`);
  console.log(`📝 Schema file: prisma/schema.prisma`);
  console.log(`\nNext steps:`);
  console.log(`1. Ensure DB_TYPE=${dbType} in your .env file`);
  console.log(`2. Run: npm run db:generate`);
  console.log(`3. Run: npm run db:push (or npm run db:migrate)`);
} catch (error) {
  console.error('❌ Error switching schema:', error.message);
  process.exit(1);
}
