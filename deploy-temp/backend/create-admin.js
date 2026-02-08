const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const firebase = require('./src/config/firebase');

async function createAdminUser() {
  try {
    console.log('🔐 Criando usuário administrador...');

    const db = firebase.getDb();

    // Gerar senha segura
    const adminPassword = crypto.randomBytes(12).toString('base64').slice(0, 16);
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const adminData = {
      nome: 'Administrador Sistema',
      email: 'solidarbrasil@gmail.com',
      senha: hashedPassword,
      tipo: 'admin',
      role: 'admin',
      status: 'verified',
      created_at: new Date().toISOString(),
      permissions: [
        'manage_ongs',
        'manage_comercios', 
        'manage_familias',
        'manage_cidadaos',
        'view_dashboard',
        'approve_entities',
        'reject_entities'
      ]
    };

    // Verificar se admin já existe
    const existingAdmin = await db.collection('admins')
      .where('email', '==', adminData.email)
      .get();

    if (!existingAdmin.empty) {
      console.log('⚠️  Usuário admin já existe!');
      console.log('📧 Email:', adminData.email);
      return;
    }

    // Criar admin
    const docRef = await db.collection('admins').add(adminData);
    
    console.log('✅ Usuário administrador criado com sucesso!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Senha:', adminPassword);
    console.log('🆔 ID:', docRef.id);
    console.log('');
    console.log('⚠️  IMPORTANTE: Salve essas credenciais em local seguro!');
    console.log('⚠️  A senha não será exibida novamente.');
    console.log('');
    console.log('🌐 Acesse: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createAdminUser().then(() => process.exit(0));
}

module.exports = { createAdminUser };