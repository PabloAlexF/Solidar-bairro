#!/usr/bin/env node

/**
 * Script de verificação de saúde do projeto Solidar Bairro
 * Verifica dependências, configurações e possíveis problemas
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Verificando saúde do projeto Solidar Bairro...\n');

const issues = [];
const warnings = [];

// Verificar estrutura de pastas
const requiredDirs = [
  'backend/src',
  'backend/src/config',
  'backend/src/controllers',
  'backend/src/models',
  'backend/src/routes',
  'backend/src/services',
  'frontend/src',
  'frontend/src/components',
  'frontend/src/pages',
  'frontend/src/services',
  'frontend/src/styles',
  'frontend/src/config',
  'frontend/src/utils',
];

console.log('📁 Verificando estrutura de pastas...');
requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    issues.push(`Pasta obrigatória não encontrada: ${dir}`);
  } else {
    console.log(`✅ ${dir}`);
  }
});

// Verificar arquivos de configuração
const requiredFiles = [
  'backend/package.json',
  'backend/.env.example',
  'frontend/package.json',
  'frontend/.env.example',
  'README.md',
  '.gitignore',
];

console.log('\n📄 Verificando arquivos de configuração...');
requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    issues.push(`Arquivo obrigatório não encontrado: ${file}`);
  } else {
    console.log(`✅ ${file}`);
  }
});

// Verificar dependências do backend
console.log('\n🔧 Verificando dependências do backend...');
try {
  const backendPackage = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
  const requiredBackendDeps = [
    'express',
    'cors',
    'dotenv',
    'firebase-admin',
  ];
  
  requiredBackendDeps.forEach(dep => {
    if (!backendPackage.dependencies[dep]) {
      issues.push(`Dependência obrigatória do backend não encontrada: ${dep}`);
    } else {
      console.log(`✅ ${dep}`);
    }
  });
} catch (error) {
  issues.push('Erro ao ler package.json do backend');
}

// Verificar dependências do frontend
console.log('\n⚛️ Verificando dependências do frontend...');
try {
  const frontendPackage = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
  const requiredFrontendDeps = [
    'react',
    'react-dom',
    'react-router-dom',
    'react-scripts',
  ];
  
  requiredFrontendDeps.forEach(dep => {
    if (!frontendPackage.dependencies[dep]) {
      issues.push(`Dependência obrigatória do frontend não encontrada: ${dep}`);
    } else {
      console.log(`✅ ${dep}`);
    }
  });
} catch (error) {
  issues.push('Erro ao ler package.json do frontend');
}

// Verificar arquivos de ambiente
console.log('\n🌍 Verificando configurações de ambiente...');
if (!fs.existsSync('backend/.env')) {
  warnings.push('Arquivo backend/.env não encontrado. Copie de .env.example');
}

if (!fs.existsSync('frontend/.env.local')) {
  warnings.push('Arquivo frontend/.env.local não encontrado. Copie de .env.example');
}

// Verificar se node_modules existem
console.log('\n📦 Verificando instalação de dependências...');
if (!fs.existsSync('backend/node_modules')) {
  warnings.push('Dependências do backend não instaladas. Execute: cd backend && npm install');
}

if (!fs.existsSync('frontend/node_modules')) {
  warnings.push('Dependências do frontend não instaladas. Execute: cd frontend && npm install');
}

// Verificar sintaxe dos arquivos principais
console.log('\n🔍 Verificando sintaxe dos arquivos principais...');
const mainFiles = [
  'backend/src/server.js',
  'frontend/src/App.js',
  'frontend/src/index.js',
];

mainFiles.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      // Verificações básicas de sintaxe
      if (content.includes('import') && content.includes('require(')) {
        warnings.push(`Mistura de import/require em ${file}`);
      }
      console.log(`✅ ${file}`);
    } catch (error) {
      issues.push(`Erro ao ler ${file}: ${error.message}`);
    }
  }
});

// Relatório final
console.log('\n' + '='.repeat(50));
console.log('📊 RELATÓRIO DE SAÚDE DO PROJETO');
console.log('='.repeat(50));

if (issues.length === 0) {
  console.log('🎉 Nenhum problema crítico encontrado!');
} else {
  console.log(`❌ ${issues.length} problema(s) crítico(s) encontrado(s):`);
  issues.forEach((issue, index) => {
    console.log(`   ${index + 1}. ${issue}`);
  });
}

if (warnings.length > 0) {
  console.log(`\n⚠️  ${warnings.length} aviso(s):`);
  warnings.forEach((warning, index) => {
    console.log(`   ${index + 1}. ${warning}`);
  });
}

// Sugestões de correção
if (issues.length > 0 || warnings.length > 0) {
  console.log('\n🔧 SUGESTÕES DE CORREÇÃO:');
  console.log('1. Execute: npm install em backend/ e frontend/');
  console.log('2. Copie .env.example para .env e configure as variáveis');
  console.log('3. Verifique se todas as dependências estão instaladas');
  console.log('4. Execute os testes: npm test');
}

console.log('\n✨ Verificação concluída!');

// Exit code
process.exit(issues.length > 0 ? 1 : 0);