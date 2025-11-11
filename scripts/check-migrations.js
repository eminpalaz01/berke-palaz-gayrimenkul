#!/usr/bin/env node

/**
 * Migration Check Script
 * Veritabanı migration durumunu kontrol eder ve gerekirse uygular
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Migration durumu kontrol ediliyor...\n');

const isProduction = process.env.NODE_ENV === 'production';
const migrationsDir = path.join(__dirname, '..', 'prisma', 'migrations');

try {
  // Migration klasörünü kontrol et
  const hasMigrations = fs.existsSync(migrationsDir) && 
    fs.readdirSync(migrationsDir).filter(f => f !== '.gitkeep').length > 0;

  if (hasMigrations) {
    console.log('📋 Migration dosyaları bulundu');
    console.log('📊 Uygulanmamış migration\'lar kontrol ediliyor...\n');

    try {
      // Migration durumunu kontrol et
      const status = execSync('npx prisma migrate status', { 
        encoding: 'utf-8',
        stdio: 'pipe'
      });

      console.log(status);

      // Eğer uygulanmamış migration varsa
      if (status.includes('following migration have not yet been applied') || 
          status.includes('Database schema is not in sync')) {
        
        console.log('\n⚠️  Uygulanmamış migration\'lar tespit edildi!');
        
        if (isProduction) {
          console.log('🚀 Production ortamı - Migration\'lar uygulanıyor...\n');
          execSync('npx prisma migrate deploy', { stdio: 'inherit' });
          console.log('\n✅ Migration\'lar başarıyla uygulandı!');
        } else {
          console.log('💡 Development ortamı - Migration\'ları uygulamak için:');
          console.log('   npm run db:migrate:deploy\n');
        }
      } else {
        console.log('✅ Tüm migration\'lar uygulanmış durumda!');
      }
    } catch (error) {
      // Migration status hatası - muhtemelen ilk kurulum
      console.log('⚠️  Migration durumu alınamadı (ilk kurulum olabilir)');
      
      if (isProduction) {
        console.log('🚀 Production - Migration\'lar uygulanıyor...\n');
        try {
          execSync('npx prisma migrate deploy', { stdio: 'inherit' });
          console.log('\n✅ Migration\'lar başarıyla uygulandı!');
        } catch (deployError) {
          console.log('⚠️  Migration deploy başarısız, db:push deneniyor...');
          execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
          console.log('✅ Schema başarıyla uygulandı!');
        }
      }
    }
  } else {
    console.log('📝 Migration dosyası bulunamadı');
    console.log('💡 İlk migration oluşturmak için:');
    console.log('   npm run db:migrate\n');
    
    // Production'da migration yoksa db:push kullan
    if (isProduction) {
      console.log('🚀 Production - Schema uygulanıyor...\n');
      execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
      console.log('✅ Schema başarıyla uygulandı!');
    }
  }

  console.log('\n✅ Migration kontrolü tamamlandı!\n');
} catch (error) {
  console.error('❌ Hata:', error.message);
  
  if (isProduction) {
    console.error('⚠️  Production ortamında kritik hata!');
    process.exit(1);
  } else {
    console.log('💡 Development ortamında hata göz ardı edildi');
  }
}
