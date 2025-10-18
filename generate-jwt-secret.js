#!/usr/bin/env node

/**
 * Script pour générer une clé JWT_SECRET sécurisée
 * Usage: node generate-jwt-secret.js
 */

const crypto = require('crypto');

console.log('\n🔐 Génération d\'une clé JWT_SECRET sécurisée...\n');

const secret = crypto.randomBytes(32).toString('hex');

console.log('Votre clé JWT_SECRET:');
console.log('━'.repeat(70));
console.log(secret);
console.log('━'.repeat(70));

console.log('\n📋 Instructions:');
console.log('1. Copiez la clé ci-dessus');
console.log('2. Sur Render.com, allez dans Environment Variables');
console.log('3. Ajoutez une nouvelle variable:');
console.log('   - Key: JWT_SECRET');
console.log('   - Value: [collez la clé copiée]');
console.log('\n⚠️  IMPORTANT: Ne partagez JAMAIS cette clé publiquement!\n');
