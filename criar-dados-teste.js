const API_BASE_URL = 'http://localhost:3001/api';

async function createTestData() {
    console.log('🔧 Criando dados de teste para o dashboard...\n');
    
    // Criar ONG pendente
    try {
        console.log('📝 Criando ONG pendente...');
        const ongData = {
            nome_fantasia: "Instituto Esperança",
            razao_social: "Instituto Esperança de Assistência Social",
            cnpj: "98.765.432/0001-10",
            email: "contato@institutoesperanca.org.br",
            telefone: "(11) 99999-8888",
            website: "https://institutoesperanca.org.br",
            sede: {
                logradouro: "Rua da Esperança, 123",
                bairro: "Centro",
                cidade: "São Paulo",
                uf: "SP",
                cep: "01234-567"
            },
            areas_cobertura: ["Centro", "Vila Madalena"],
            causas: ["Educação", "Assistência Social"],
            proposito: "Promover educação e assistência social para comunidades carentes",
            status: "pending"
        };
        
        const ongResponse = await fetch(`${API_BASE_URL}/ongs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ongData)
        });
        
        if (ongResponse.ok) {
            console.log('✅ ONG pendente criada com sucesso!');
        } else {
            console.log('❌ Erro ao criar ONG:', ongResponse.status);
        }
    } catch (error) {
        console.log('❌ Erro ao criar ONG:', error.message);
    }
    
    // Criar Comércio pendente
    try {
        console.log('📝 Criando Comércio pendente...');
        const comercioData = {
            nome_fantasia: "Padaria do Bairro",
            razao_social: "Padaria do Bairro Ltda",
            cnpj: "87.654.321/0001-09",
            email: "contato@padariabairro.com.br",
            telefone: "(11) 88888-7777",
            segmento: "Alimentação",
            responsavel_legal: "João Silva",
            endereco: {
                logradouro: "Rua das Flores, 456",
                bairro: "Vila Nova",
                cidade: "São Paulo",
                uf: "SP",
                cep: "02345-678"
            },
            horario_funcionamento: "06:00 às 20:00",
            contribuicoes: ["Doação de pães", "Desconto para famílias carentes"],
            proposito: "Apoiar a comunidade local com alimentação de qualidade",
            status: "pending"
        };
        
        const comercioResponse = await fetch(`${API_BASE_URL}/comercios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(comercioData)
        });
        
        if (comercioResponse.ok) {
            console.log('✅ Comércio pendente criado com sucesso!');
        } else {
            console.log('❌ Erro ao criar Comércio:', comercioResponse.status);
        }
    } catch (error) {
        console.log('❌ Erro ao criar Comércio:', error.message);
    }
    
    // Criar Família pendente
    try {
        console.log('📝 Criando Família pendente...');
        const familiaData = {
            nomeCompleto: "Ana Costa",
            cpf: "123.456.789-01",
            email: "ana.costa@email.com",
            telefone: "(11) 77777-6666",
            endereco: {
                logradouro: "Rua da Paz, 789",
                bairro: "Jardim Esperança",
                cidade: "São Paulo",
                uf: "SP",
                cep: "03456-789"
            },
            rendaFamiliar: "1 a 2 salários mínimos",
            adultos: 2,
            criancas: 3,
            necessidades: ["Alimentação", "Roupas", "Material escolar"],
            proposito: "Buscar apoio para educação dos filhos",
            status: "pending"
        };
        
        const familiaResponse = await fetch(`${API_BASE_URL}/familias`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(familiaData)
        });
        
        if (familiaResponse.ok) {
            console.log('✅ Família pendente criada com sucesso!');
        } else {
            console.log('❌ Erro ao criar Família:', familiaResponse.status);
        }
    } catch (error) {
        console.log('❌ Erro ao criar Família:', error.message);
    }
    
    // Criar Cidadão pendente
    try {
        console.log('📝 Criando Cidadão pendente...');
        const cidadaoData = {
            nomeCompleto: "Carlos Oliveira",
            cpf: "987.654.321-00",
            email: "carlos.oliveira@email.com",
            telefone: "(11) 66666-5555",
            endereco: {
                logradouro: "Av. da Solidariedade, 321",
                bairro: "Centro",
                cidade: "São Paulo",
                uf: "SP",
                cep: "04567-890"
            },
            profissao: "Professor",
            disponibilidade: ["Fins de semana", "Feriados"],
            interesses: ["Educação", "Meio ambiente"],
            proposito: "Contribuir com aulas de reforço para crianças",
            status: "pending"
        };
        
        const cidadaoResponse = await fetch(`${API_BASE_URL}/cidadaos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cidadaoData)
        });
        
        if (cidadaoResponse.ok) {
            console.log('✅ Cidadão pendente criado com sucesso!');
        } else {
            console.log('❌ Erro ao criar Cidadão:', cidadaoResponse.status);
        }
    } catch (error) {
        console.log('❌ Erro ao criar Cidadão:', error.message);
    }
    
    // Criar Item de Achados e Perdidos
    try {
        console.log('📝 Criando item de achados e perdidos...');
        const achadosPerdidosData = {
            title: "asdasdas",
            description: "Item de teste para achados e perdidos",
            category: "Outros",
            type: "lost",
            location: "dsadasdsa",
            neighborhood: "",
            reward: "",
            state: "",
            tags: [],
            contact_info: "teste@exemplo.com",
            city: "São Paulo"
        };

        const achadosResponse = await fetch(`${API_BASE_URL}/achados-perdidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-token' // Você pode precisar ajustar isso baseado na autenticação
            },
            body: JSON.stringify(achadosPerdidosData)
        });

        if (achadosResponse.ok) {
            const result = await achadosResponse.json();
            console.log('✅ Item de achados e perdidos criado com sucesso!');
            console.log('📅 Data de criação:', new Date(result.data.created_at.seconds * 1000).toLocaleString('pt-BR', {
                timeZone: 'America/Sao_Paulo',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }));
        } else {
            console.log('❌ Erro ao criar item de achados e perdidos:', achadosResponse.status);
            const errorText = await achadosResponse.text();
            console.log('Erro detalhado:', errorText);
        }
    } catch (error) {
        console.log('❌ Erro ao criar item de achados e perdidos:', error.message);
    }

    console.log('\n🎉 Dados de teste criados! Agora o dashboard terá itens pendentes para análise.');
    console.log('🔄 Atualize o dashboard para ver os novos registros pendentes.');
}

// Executar criação de dados
createTestData();