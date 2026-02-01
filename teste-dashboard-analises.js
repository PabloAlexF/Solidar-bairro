const API_BASE_URL = 'http://localhost:3001/api';

async function testDashboardAnalysis() {
    console.log('🎯 Teste Final: Verificando análises no dashboard\n');
    
    // 1. Estado inicial
    console.log('📊 Estado inicial:');
    const familias = await fetch(`${API_BASE_URL}/familias`).then(r => r.json());
    const familiasData = familias.data || familias || [];
    
    const pending = familiasData.filter(f => f.status === 'pending');
    const analyzed = familiasData.filter(f => f.status === 'analyzed' || f.status === 'ativo');
    
    console.log(`   Total: ${familiasData.length}`);
    console.log(`   Pendentes: ${pending.length}`);
    console.log(`   Analisadas: ${analyzed.length}`);
    
    if (pending.length === 0) {
        console.log('\n✅ Não há famílias pendentes para testar');
        return;
    }
    
    console.log('\n📋 Famílias pendentes:');
    pending.forEach((f, i) => {
        console.log(`   ${i+1}. ${f.nomeCompleto} (ID: ${f.id})`);
    });
    
    // 2. Simular análise de cada família pendente
    console.log('\n🔄 Simulando análises...');
    
    for (const familia of pending) {
        console.log(`\n📝 Analisando: ${familia.nomeCompleto}`);
        
        try {
            // Simular o que o dashboard faz
            const response = await fetch(`${API_BASE_URL}/familias/${familia.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'analyzed' })
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log(`   ✅ Análise concluída - Status: ${result.data.status}`);
            } else {
                console.log(`   ❌ Erro na análise: ${response.status}`);
            }
            
        } catch (error) {
            console.log(`   ❌ Erro: ${error.message}`);
        }
    }
    
    // 3. Verificar resultado final
    console.log('\n🔍 Verificando resultado final...');
    const finalFamilias = await fetch(`${API_BASE_URL}/familias`).then(r => r.json());
    const finalData = finalFamilias.data || finalFamilias || [];
    
    const finalPending = finalData.filter(f => f.status === 'pending');
    const finalAnalyzed = finalData.filter(f => f.status === 'analyzed' || f.status === 'ativo');
    
    console.log(`\n📈 Resultado final:`);
    console.log(`   Total: ${finalData.length}`);
    console.log(`   Pendentes: ${finalPending.length}`);
    console.log(`   Analisadas: ${finalAnalyzed.length}`);
    
    // 4. Verificar se dashboard mostraria dados corretos
    console.log('\n🎯 Dados que o dashboard mostraria:');
    console.log(`   📊 Estatísticas:`);
    console.log(`      - Total de famílias: ${finalData.length}`);
    console.log(`      - Famílias pendentes: ${finalPending.length}`);
    console.log(`      - Taxa de análise: ${Math.round((finalAnalyzed.length / finalData.length) * 100)}%`);
    
    if (finalPending.length === 0) {
        console.log('\n🎉 SUCESSO: Todas as análises foram concluídas!');
        console.log('✅ O dashboard não mostrará itens pendentes');
        console.log('✅ As notificações serão limpas');
        console.log('✅ O progresso será 100%');
    } else {
        console.log('\n⚠️  Ainda há itens pendentes:');
        finalPending.forEach(f => {
            console.log(`   - ${f.nomeCompleto}`);
        });
    }
    
    console.log('\n🏁 Teste concluído!');
}

// Executar teste
testDashboardAnalysis();