const firebase = require('../config/firebase');
const authService = require('./authService');

class FamiliaService {
  constructor() {
    this.db = firebase.getDb();
    this.auth = firebase.getAuth();
    this.collection = 'familias';
  }

  async createFamilia(data) {
    console.log('Dados recebidos para família:', JSON.stringify(data, null, 2));

    // Validação - aceita tanto nomeCompleto quanto nome
    const nome = data.nomeCompleto || data.nome;
    if (!nome?.trim()) {
      throw new Error('Nome da família é obrigatório');
    }

    // Hash da senha se fornecida
    let hashedPassword = null;
    if (data.senha || data.password) {
      const senha = data.senha || data.password;
      console.log('Senha fornecida:', senha);
      hashedPassword = await authService.hashPassword(senha);
      console.log('Senha hasheada:', hashedPassword ? 'OK' : 'FALHOU');
    } else {
      console.log('Nenhuma senha fornecida');
    }

    // Calcular total de membros da família
    const criancas = parseInt(data.criancas) || 0;
    const jovens = parseInt(data.jovens) || 0;
    const adultos = parseInt(data.adultos) || 1;
    const idosos = parseInt(data.idosos) || 0;
    const totalMembros = criancas + jovens + adultos + idosos;
    
    console.log('Debug composição familiar:');
    console.log('  Crianças:', criancas);
    console.log('  Jovens:', jovens);
    console.log('  Adultos:', adultos);
    console.log('  Idosos:', idosos);
    console.log('  Total:', totalMembros);

    const familiaData = {
      // Dados pessoais do responsável
      nomeCompleto: nome,
      dataNascimento: data.dataNascimento || '',
      estadoCivil: data.estadoCivil || '',
      profissao: data.profissao || '',
      cpf: data.cpf || '',
      rg: data.rg || '',
      nis: data.nis || '',
      
      // Dados de contato
      telefone: data.telefone || '',
      whatsapp: data.whatsapp || data.telefone || '',
      email: data.email || '',
      horarioContato: data.horarioContato || '',
      
      // Dados de endereço
      endereco: {
        logradouro: data.endereco || '',
        bairro: data.bairro || data.endereco?.bairro || 'São Benedito',
        pontoReferencia: data.pontoReferencia || '',
        tipoMoradia: data.tipoMoradia || '',
        latitude: data.endereco?.latitude || -19.768,
        longitude: data.endereco?.longitude || -43.85
      },
      
      // Composição familiar
      composicao: {
        totalMembros: totalMembros,
        criancas: criancas,
        jovens: jovens,
        adultos: adultos,
        idosos: idosos
      },
      
      // Dados socioeconômicos
      rendaFamiliar: data.rendaFamiliar || 'Sem renda',
      necessidades: data.necessidades || [],
      
      // Dados do sistema
      vulnerability: data.vulnerability || 'Média',
      status: data.status || 'ativo',
      tipo: 'familia',
      ativo: true,
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };

    // Adicionar senha apenas se existir
    if (hashedPassword) {
      familiaData.senha = hashedPassword;
    }

    // Salvar no Firestore
    const docRef = await this.db.collection(this.collection).add(familiaData);
    return { id: docRef.id, ...familiaData };
  }

  async getFamilias() {
    const snapshot = await this.db.collection(this.collection).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getFamiliaById(id) {
    const doc = await this.db.collection(this.collection).doc(id).get();
    if (!doc.exists) {
      throw new Error('Família não encontrada');
    }
    return { id: doc.id, ...doc.data() };
  }

  async updateFamilia(id, data) {
    const updateData = Object.keys(data).reduce((acc, key) => {
      if (data[key] !== undefined && data[key] !== null) {
        acc[key] = data[key];
      }
      return acc;
    }, {});
    
    updateData.atualizadoEm = new Date();
    
    await this.db.collection(this.collection).doc(id).update(updateData);
    return { id, ...updateData };
  }

  async deleteFamilia(id) {
    await this.db.collection(this.collection).doc(id).delete();
  }

  async getFamiliasByBairro(bairro) {
    const snapshot = await this.db.collection(this.collection).get();
    const allFamilias = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`✅ ${allFamilias.length} famílias carregadas do banco`);
    return allFamilias;
  }

  async getStatsByBairro(bairro) {
    const familias = await this.getFamiliasByBairro(bairro);
    
    const stats = {
      total: familias.length,
      pessoas: 0,
      criancas: 0,
      idosos: 0,
      altaVuln: 0,
      pendentes: 0,
      atendidos: 0
    };

    familias.forEach(f => {
      stats.pessoas += f.composicao?.totalMembros || 0;
      stats.criancas += f.composicao?.criancas || 0;
      stats.idosos += f.composicao?.idosos || 0;
      if (f.vulnerability === 'Alta') stats.altaVuln++;
      if (f.status === 'pendente') stats.pendentes++;
      if (f.status === 'atendido') stats.atendidos++;
    });

    return stats;
  }
}

module.exports = new FamiliaService();