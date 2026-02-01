const API_BASE_URL = 'http://localhost:3001/api';

async function testDashboardAPIs() {
    console.log('🔍 Testando APIs do Dashboard...\n');
    
    const endpoints = [
        { name: 'ONGs', url: '/ongs' },
        { name: 'Comércios', url: '/comercios' },
        { name: 'Famílias', url: '/familias' },
        { name: 'Cidadãos', url: '/cidadaos' }
    ];
    
    for (const endpoint of endpoints) {
        try {
            console.log(`📡 Testando ${endpoint.name}...`);
            const response = await fetch(`${API_BASE_URL}${endpoint.url}`);
            
            if (!response.ok) {
                console.log(`❌ ${endpoint.name}: Erro ${response.status}`);
                continue;
            }
            
            const data = await response.json();
            const items = data.data || data || [];
            const pending = items.filter(item => item.status === 'pending').length;
            const total = items.length;
            
            console.log(`✅ ${endpoint.name}: ${total} total, ${pending} pendentes`);
            
            // Mostrar alguns exemplos se houver dados
            if (items.length > 0) {
                const example = items[0];
                const name = example.nome_fantasia || example.nomeCompleto || example.full_name || 'N/A';
                console.log(`   📋 Exemplo: ${name} (Status: ${example.status || 'N/A'})`);
            }
            
        } catch (error) {
            console.log(`❌ ${endpoint.name}: Erro de conexão - ${error.message}`);
        }
        console.log('');
    }
    
    console.log('🏁 Teste concluído!');
}

// Executar teste
testDashboardAPIs();