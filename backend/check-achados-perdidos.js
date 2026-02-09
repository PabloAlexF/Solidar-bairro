const { db } = require('./src/config/firebase');

async function checkAchadosPerdidos() {
  try {
    console.log('=== VERIFICANDO ITENS DE ACHADOS E PERDIDOS ===');

    const collection = db.collection('achados_perdidos');
    const snapshot = await collection.orderBy('created_at', 'desc').limit(5).get();

    console.log(`Total de documentos encontrados: ${snapshot.size}`);
    console.log('');

    snapshot.forEach((doc, index) => {
      const data = doc.data();
      console.log(`=== ITEM ${index + 1} ===`);
      console.log('ID:', doc.id);
      console.log('Título:', data.title);
      console.log('Descrição:', data.description);
      console.log('Categoria:', data.category);
      console.log('Tipo:', data.type);
      console.log('Usuário ID:', data.user_id);
      console.log('Localização:', data.location);
      console.log('Contato:', data.contact_info);
      console.log('Imagem URL:', data.image_url);
      console.log('Recompensa:', data.reward);
      console.log('Tags:', data.tags);
      console.log('Status:', data.status);
      console.log('Data ocorrência:', data.date_occurrence);
      console.log('Data criação:', data.created_at?.toDate ? data.created_at.toDate().toISOString() : data.created_at);
      console.log('Data atualização:', data.updated_at?.toDate ? data.updated_at.toDate().toISOString() : data.updated_at);
      console.log('');
    });

    // Verificar se há campos obrigatórios faltando
    console.log('=== VERIFICAÇÃO DE CAMPOS OBRIGATÓRIOS ===');
    snapshot.forEach((doc, index) => {
      const data = doc.data();
      const missingFields = [];

      if (!data.title) missingFields.push('title');
      if (!data.description) missingFields.push('description');
      if (!data.category) missingFields.push('category');
      if (!data.type) missingFields.push('type');
      if (!data.contact_info) missingFields.push('contact_info');
      if (!data.user_id) missingFields.push('user_id');

      if (missingFields.length > 0) {
        console.log(`Item ${index + 1} (${doc.id}): Faltando campos: ${missingFields.join(', ')}`);
      } else {
        console.log(`Item ${index + 1} (${doc.id}): Todos os campos obrigatórios presentes ✓`);
      }
    });

  } catch (error) {
    console.error('Erro ao verificar achados e perdidos:', error);
  }
}

checkAchadosPerdidos();
