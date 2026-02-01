// Script para verificar se o backend está rodando
export const checkBackendStatus = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/health', {
      method: 'GET',
      timeout: 5000
    });
    
    if (response.ok) {
      console.log('✅ Backend está rodando em http://localhost:3001');
      return { status: 'online', message: 'Backend conectado' };
    }
  } catch (error) {
    console.error('❌ Backend não está rodando');
    console.log('📋 Para iniciar o backend:');
    console.log('1. Abra um terminal na pasta backend/');
    console.log('2. Execute: npm install');
    console.log('3. Execute: npm start');
    console.log('4. O servidor deve iniciar em http://localhost:3001');
    
    return { 
      status: 'offline', 
      message: 'Backend offline. Inicie o servidor em localhost:3001',
      instructions: [
        'cd backend/',
        'npm install',
        'npm start'
      ]
    };
  }
};

// Verificar status na inicialização
if (process.env.NODE_ENV === 'development') {
  checkBackendStatus();
}

export default checkBackendStatus;