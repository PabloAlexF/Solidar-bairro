const API_BASE_URL = 'http://localhost:3001/api';

async function testAnalysisFlow() {
    console.log('🔍 Testando fluxo de análise completo...\n');
    
    // 1. Verificar dados atuais
    console.log('📊 Estado atual dos dados:');
    const familias = await fetch(`${API_BASE_URL}/familias`).then(r => r.json());
    const familiasData = familias.data || familias || [];
    
    console.log(`   Famílias total: ${familiasData.length}`);
    familiasData.forEach((f, i) => {
        console.log(`   ${i+1}. ${f.nomeCompleto} - Status: ${f.status}`);
    });
    
    // 2. Encontrar família pendente
    const pendingFamily = familiasData.find(f => f.status === 'pending');
    if (!pendingFamily) {
        console.log('\n❌ Nenhuma família pendente encontrada para testar análise');
        return;
    }
    
    console.log(`\n🎯 Testando análise da família: ${pendingFamily.nomeCompleto}`);
    console.log(`   ID: ${pendingFamily.id}`);
    console.log(`   Status atual: ${pendingFamily.status}`);
    
    // 3. Simular análise (PUT para alterar status)
    try {
        console.log('\n📝 Enviando análise...');
        const updateResponse = await fetch(`${API_BASE_URL}/familias/${pendingFamily.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'analyzed' })
        });
        
        if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            console.log(`❌ Erro na análise: ${updateResponse.status} - ${errorText}`);
            return;
        }
        
        const updateResult = await updateResponse.json();
        console.log('✅ Análise enviada com sucesso!');
        console.log(`   Resposta: ${JSON.stringify(updateResult, null, 2)}`);
        
    } catch (error) {
        console.log(`❌ Erro ao enviar análise: ${error.message}`);
        return;
    }
    
    // 4. Verificar se mudança foi aplicada
    console.log('\n🔄 Verificando se análise foi aplicada...');
    try {
        const checkResponse = await fetch(`${API_BASE_URL}/familias/${pendingFamily.id}`);
        if (!checkResponse.ok) {
            console.log(`❌ Erro ao verificar: ${checkResponse.status}`);
            return;
        }
        
        const updatedFamily = await checkResponse.json();
        const familyData = updatedFamily.data || updatedFamily;
        
        console.log(`   Status anterior: ${pendingFamily.status}`);
        console.log(`   Status atual: ${familyData.status}`);
        
        if (familyData.status === 'analyzed') {
            console.log('✅ SUCESSO: Análise foi concluída e salva!');
        } else {
            console.log('❌ FALHA: Status não foi alterado');
        }
        
    } catch (error) {
        console.log(`❌ Erro ao verificar resultado: ${error.message}`);
    }
    
    // 5. Verificar estado final de todas as famílias
    console.log('\n📊 Estado final dos dados:');
    const finalFamilias = await fetch(`${API_BASE_URL}/familias`).then(r => r.json());
    const finalData = finalFamilias.data || finalFamilias || [];
    
    finalData.forEach((f, i) => {
        const statusIcon = f.status === 'pending' ? '⏳' : f.status === 'analyzed' ? '✅' : '❓';
        console.log(`   ${i+1}. ${f.nomeCompleto} - ${statusIcon} ${f.status}`);
    });
    
    const pendingCount = finalData.filter(f => f.status === 'pending').length;
    const analyzedCount = finalData.filter(f => f.status === 'analyzed' || f.status === 'ativo').length;
    
    console.log(`\n📈 Resumo:`);
    console.log(`   Pendentes: ${pendingCount}`);
    console.log(`   Analisadas: ${analyzedCount}`);
    console.log(`   Total: ${finalData.length}`);
}

// Executar teste
testAnalysisFlow();