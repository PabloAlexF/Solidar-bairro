// Teste das classes de status
const getStatusClass = (status) => {
  const statusClasses = {
    'pending': 'status-warning',
    'analyzed': 'status-success',
    'active': 'status-success',
    'ativo': 'status-success',
    'approved': 'status-success',
    'rejected': 'status-error',
    'inactive': 'status-error',
    'inativo': 'status-error'
  };
  return statusClasses[status] || 'status-default';
};

console.log('🎨 Teste de mapeamento de classes de status:\n');

const testStatuses = ['active', 'ativo', 'analyzed', 'pending', 'rejected', 'inactive', 'unknown'];

testStatuses.forEach(status => {
  const cssClass = getStatusClass(status);
  const color = cssClass === 'status-success' ? '🟢' : 
                cssClass === 'status-warning' ? '🟡' : 
                cssClass === 'status-error' ? '🔴' : '⚪';
  
  console.log(`${color} Status: "${status}" → Classe: "${cssClass}"`);
});

console.log('\n✅ Teste concluído!');
console.log('\nSe você está vendo verde para "active", "ativo" e "analyzed", as classes estão corretas.');
console.log('Verifique se o CSS está sendo carregado no navegador (F12 → Elements → procure pelas classes).');