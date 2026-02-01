const API_BASE_URL = 'http://localhost:3001/api';

async function createMoreTestData() {
    console.log('🔧 Criando mais dados pendentes para teste completo...\n');
    
    // Criar mais famílias pendentes
    const familias = [
        {
            nomeCompleto: "Roberto Silva",
            cpf: "111.222.333-44",
            email: "roberto.silva@email.com",
            telefone: "(11) 55555-4444",
            endereco: {
                logradouro: "Rua das Palmeiras, 100",
                bairro: "Vila Nova",
                cidade: "São Paulo",
                uf: "SP",
                cep: "05678-901"
            },
            rendaFamiliar: "Até 1 salário mínimo",
            adultos: 1,
            criancas: 2,
            necessidades: ["Alimentação", "Medicamentos"],
            proposito: "Preciso de ajuda para cuidar dos meus filhos",
            status: "pending"
        },
        {
            nomeCompleto: "Fernanda Lima",
            cpf: "555.666.777-88",
            email: "fernanda.lima@email.com",
            telefone: "(11) 44444-3333",
            endereco: {
                logradouro: "Av. Brasil, 500",
                bairro: "Centro",
                cidade: "São Paulo",
                uf: "SP",
                cep: "06789-012"
            },
            rendaFamiliar: "2 a 3 salários mínimos",
            adultos: 2,
            criancas: 1,
            necessidades: ["Material escolar", "Roupas"],
            proposito: "Busco apoio educacional para minha filha",
            status: "pending"
        }
    ];
    
    // Criar cidadãos pendentes
    const cidadaos = [
        {
            nomeCompleto: "Pedro Santos",
            cpf: "222.333.444-55",
            email: "pedro.santos@email.com",
            telefone: "(11) 33333-2222",
            endereco: {
                logradouro: "Rua da Amizade, 200",
                bairro: "Jardim São Paulo",
                cidade: "São Paulo",
                uf: "SP",
                cep: "07890-123"
            },
            profissao: "Engenheiro",
            disponibilidade: ["Sábados", "Domingos"],
            interesses: ["Construção", "Reforma"],
            proposito: "Quero ajudar com reformas em casas de famílias carentes",
            status: "pending"
        },
        {
            nomeCompleto: "Julia Oliveira",
            cpf: "666.777.888-99",
            email: "julia.oliveira@email.com",
            telefone: "(11) 22222-1111",
            endereco: {
                logradouro: "Rua das Flores, 300",
                bairro: "Vila Esperança",
                cidade: "São Paulo",
                uf: "SP",
                cep: "08901-234"
            },
            profissao: "Médica",
            disponibilidade: ["Fins de semana"],
            interesses: ["Saúde", "Prevenção"],
            proposito: "Oferecer consultas gratuitas para a comunidade",
            status: "pending"
        }
    ];
    
    // Criar famílias
    for (const familia of familias) {
        try {
            const response = await fetch(`${API_BASE_URL}/familias`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(familia)
            });
            
            if (response.ok) {
                console.log(`✅ Família criada: ${familia.nomeCompleto}`);
            } else {
                console.log(`❌ Erro ao criar família ${familia.nomeCompleto}: ${response.status}`);
            }
        } catch (error) {
            console.log(`❌ Erro: ${error.message}`);
        }
    }
    
    // Criar cidadãos
    for (const cidadao of cidadaos) {
        try {
            const response = await fetch(`${API_BASE_URL}/cidadaos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cidadao)
            });
            
            if (response.ok) {
                console.log(`✅ Cidadão criado: ${cidadao.nomeCompleto}`);
            } else {
                console.log(`❌ Erro ao criar cidadão ${cidadao.nomeCompleto}: ${response.status}`);
            }
        } catch (error) {
            console.log(`❌ Erro: ${error.message}`);
        }
    }
    
    console.log('\n🎉 Dados adicionais criados!');
    console.log('📊 Verificando estado final...\n');
    
    // Verificar estado final
    const endpoints = [
        { name: 'Famílias', url: '/familias' },
        { name: 'Cidadãos', url: '/cidadaos' }
    ];
    
    for (const endpoint of endpoints) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint.url}`);
            const data = await response.json();
            const items = data.data || data || [];
            const pending = items.filter(item => item.status === 'pending').length;
            const total = items.length;
            
            console.log(`📈 ${endpoint.name}: ${total} total, ${pending} pendentes`);
        } catch (error) {
            console.log(`❌ Erro ao verificar ${endpoint.name}: ${error.message}`);
        }
    }
}

// Executar
createMoreTestData();