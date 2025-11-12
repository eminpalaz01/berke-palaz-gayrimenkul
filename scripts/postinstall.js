#!/usr/bin/env node

/**
 * Post-install script
 * Production'da npm install sonrası otomatik olarak çalışır
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Post-install script başlatılıyor...');

// Production ortamında mı kontrol et
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

try {
  // Prisma Client'ı her zaman oluştur
  console.log('📦 Prisma Client oluşturuluyor...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client oluşturuldu');

  // Production'da migration'ları otomatik uygula
  if (isProduction) {
    console.log('🔄 Production ortamı tespit edildi');
    console.log('📊 Migration'lar uygulanıyor...');
    
    try {
      // Migration'ları uygula (varsa)
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('✅ Migration'lar başarıyla uygulandı');
    } catch (error) {
      console.log('Migration bulunamadi veya zaten uygulanmis');
      
      // Migration yoksa db:push kullan
      console.log('Schema veritabanina uygulaniyor...');
      execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
      console.log('Schema basariyla uygulandi');
    }
  }

  console.log('Post-install tamamlandi!');
} catch (error) {
  console.error('Post-install hatasi:', error.message);
  
  // Production'da hata varsa çık
  if (isProduction) {
    process.exit(1);
  }
  
  // Development'ta sadece uyari ver
  console.log('Development ortaminda hata goz ardi edildi');
}
