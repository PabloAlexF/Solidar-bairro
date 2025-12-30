const fs = require('fs');
const path = require('path');

const pageImports = {
  'PrecisoDeAjuda.js': "import '../styles/pages/PrecisoDeAjudaModern.css';",
  'QueroAjudar.js': "import '../styles/pages/QueroAjudar.css';",
  'Register.js': "import '../styles/pages/Register.css';",
  'Login.js': "import '../styles/pages/Login.css';",
  'Pedidos.js': "import '../styles/pages/Pedidos.css';",
  'DetalhesNecessidade.js': "import '../styles/pages/DetalhesNecessidade.css';",
  'PedidoPublicado.js': "import '../styles/pages/PedidoPublicado.css';",
  'SobreTipos.js': "import '../styles/pages/SobreTipos.css';",
  'RegisterCidadao.js': "import '../styles/pages/CadastroFamilia.css';",
  'RegisterONG.js': "import '../styles/pages/CadastroFamilia.css';",
  'RegisterComercio.js': "import '../styles/pages/CadastroFamilia.css';",
  'CadastroFamilia.js': "import '../styles/pages/CadastroFamilia.css';",
  'PerfilFamilia.js': "import '../styles/pages/PerfilFamilia.css';",
  'AtualizarStatus.js': "import '../styles/pages/AtualizarStatus.css';",
  'PainelSocial.js': "import '../styles/pages/PainelSocial.css';",
  'Perfil.js': "import '../styles/pages/Perfil.css';"
};

const pagesDir = path.join(__dirname, 'src', 'pages');

Object.entries(pageImports).forEach(([filename, importStatement]) => {
  const filePath = path.join(pagesDir, filename);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Verifica se já tem o import
    if (!content.includes(importStatement)) {
      // Encontra a linha após os imports do React/Router
      const lines = content.split('\n');
      let insertIndex = 0;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('import') && (lines[i].includes('react') || lines[i].includes('react-router'))) {
          insertIndex = i + 1;
        } else if (lines[i].includes('import') && lines[i].includes('../')) {
          // Já tem imports de CSS, não adiciona
          return;
        } else if (!lines[i].includes('import') && lines[i].trim() !== '') {
          break;
        }
      }
      
      lines.splice(insertIndex, 0, importStatement);
      content = lines.join('\n');
      
      fs.writeFileSync(filePath, content);
      console.log(`Adicionado import CSS em ${filename}`);
    }
  }
});

console.log('Imports CSS restaurados!');