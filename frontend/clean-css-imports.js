const fs = require('fs');
const path = require('path');

// Função para processar arquivos recursivamente
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      processFile(filePath);
    }
  });
}

// Função para processar um arquivo individual
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Lista de imports CSS específicos para remover
    const cssImportsToRemove = [
      /import\s+['"]\.\.\?\/styles\/pages\/[^'"]+\.css['"];?\s*\n?/g,
      /import\s+['"]\.\.\?\/styles\/components\/[^'"]+\.css['"];?\s*\n?/g,
      /import\s+['"]\.\.\?\/styles\/responsive\/[^'"]+\.css['"];?\s*\n?/g,
      /import\s+['"]\.\/[^'"]+\.css['"];?\s*\n?/g,
      /import\s+['"]\.\.\?\/[^'"]*\.css['"];?\s*\n?/g
    ];
    
    // Exceções - manter estes imports
    const keepImports = [
      'leaflet/dist/leaflet.css',
      './styles/index.css'
    ];
    
    cssImportsToRemove.forEach(regex => {
      const matches = content.match(regex);
      if (matches) {
        matches.forEach(match => {
          // Verificar se não é um import que devemos manter
          const shouldKeep = keepImports.some(keep => match.includes(keep));
          if (!shouldKeep) {
            content = content.replace(match, '');
            modified = true;
          }
        });
      }
    });
    
    if (modified) {
      // Limpar linhas vazias extras
      content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
      fs.writeFileSync(filePath, content);
      console.log(`Atualizado: ${filePath}`);
    }
  } catch (error) {
    console.error(`Erro ao processar ${filePath}:`, error.message);
  }
}

// Processar diretórios
const srcDir = path.join(__dirname, 'src');
processDirectory(srcDir);

console.log('Limpeza de imports CSS concluída!');