class Familia {
  constructor(data) {
    this.nomeCompleto = data.nomeCompleto;
    this.dataNascimento = data.dataNascimento;
    this.estadoCivil = data.estadoCivil;
    this.profissao = data.profissao;
    this.cpf = data.cpf;
    this.rg = data.rg;
    this.nis = data.nis || '';
    this.rendaFamiliar = data.rendaFamiliar;
    this.telefone = data.telefone;
    this.whatsapp = data.whatsapp || '';
    this.email = data.email || '';
    this.horarioContato = data.horarioContato;
    // Aceitar tanto formato antigo quanto novo
    if (typeof data.endereco === 'object' && data.endereco !== null) {
      this.endereco = {
        endereco: data.endereco.logradouro || data.endereco.endereco || '',
        logradouro: data.endereco.logradouro || '',
        bairro: data.endereco.bairro || data.bairro || '',
        pontoReferencia: data.endereco.pontoReferencia || data.pontoReferencia || '',
        tipoMoradia: data.endereco.tipoMoradia || data.tipoMoradia || '',
        latitude: data.endereco.latitude || null,
        longitude: data.endereco.longitude || null,
        cidade: 'Lagoa Santa',
        uf: 'MG'
      };
    } else {
      this.endereco = {
        endereco: data.endereco || '',
        bairro: data.bairro || '',
        pontoReferencia: data.pontoReferencia || '',
        tipoMoradia: data.tipoMoradia || '',
        cidade: 'Lagoa Santa',
        uf: 'MG'
      };
    }
    // Aceitar tanto formato antigo quanto novo
    if (typeof data.composicao === 'object' && data.composicao !== null) {
      this.composicao = {
        totalMembros: parseInt(data.composicao.totalMembros) || 1,
        criancas: parseInt(data.composicao.criancas) || 0,
        jovens: parseInt(data.composicao.jovens) || 0,
        adultos: parseInt(data.composicao.adultos) || 1,
        idosos: parseInt(data.composicao.idosos) || 0
      };
    } else {
      this.composicao = {
        totalMembros: parseInt(data.totalMembros) || 1,
        criancas: parseInt(data.criancas) || 0,
        jovens: parseInt(data.jovens) || 0,
        adultos: parseInt(data.adultos) || 1,
        idosos: parseInt(data.idosos) || 0
      };
    }
    this.necessidades = data.necessidades || [];
    this.tipo = 'familia';
    this.ativo = true;
    this.criadoEm = new Date();
    this.atualizadoEm = new Date();
  }

  validate() {
    const errors = [];
    
    // Validações obrigatórias apenas para campos essenciais
    if (!this.nomeCompleto?.trim()) errors.push('Nome do responsável é obrigatório');
    if (!this.rendaFamiliar?.trim()) errors.push('Renda familiar é obrigatória');
    
    // Validações opcionais para outros campos
    // if (!this.dataNascimento) errors.push('Data de nascimento é obrigatória');
    // if (!this.estadoCivil?.trim()) errors.push('Estado civil é obrigatório');
    // if (!this.profissao?.trim()) errors.push('Profissão é obrigatória');
    // if (!this.cpf?.trim()) errors.push('CPF é obrigatório');
    // if (!this.rg?.trim()) errors.push('RG é obrigatório');
    // if (!this.telefone?.trim()) errors.push('Telefone é obrigatório');
    // if (!this.horarioContato?.trim()) errors.push('Horário de contato é obrigatório');
    // if (!this.endereco?.endereco?.trim() && !this.endereco?.logradouro?.trim()) errors.push('Endereço é obrigatório');
    // if (!this.endereco?.bairro?.trim()) errors.push('Bairro é obrigatório');
    // if (!this.endereco?.tipoMoradia?.trim()) errors.push('Tipo de moradia é obrigatório');
    
    return errors;
  }
}

module.exports = Familia;