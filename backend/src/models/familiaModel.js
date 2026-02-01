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

    // Validações obrigatórias para famílias (mais flexíveis)
    if (!this.nomeCompleto?.trim()) {
      errors.push('Nome do responsável é obrigatório');
    } else if (!ValidationUtils.validarNomeCompleto(this.nomeCompleto)) {
      errors.push('Nome deve conter pelo menos nome e sobrenome (mínimo 2 caracteres cada)');
    }

    if (!this.rendaFamiliar?.trim()) {
      errors.push('Renda familiar é obrigatória');
    }

    // CPF opcional mas se informado deve ser válido
    if (this.cpf?.trim() && !ValidationUtils.validarCPF(this.cpf)) {
      errors.push('CPF inválido (se informado)');
    }

    // RG opcional mas se informado deve ter validação básica
    if (this.rg?.trim() && !ValidationUtils.validarRG(this.rg)) {
      errors.push('RG deve ter pelo menos 7 dígitos (se informado)');
    }

    // E-mail opcional mas se informado deve ser válido
    if (this.email?.trim() && !ValidationUtils.validarEmail(this.email)) {
      errors.push('E-mail deve ter um formato válido (se informado)');
    }

    // Telefone opcional mas se informado deve ser válido
    if (this.telefone?.trim() && !ValidationUtils.validarTelefone(this.telefone)) {
      errors.push('Telefone deve ter 10 ou 11 dígitos (se informado)');
    }

    // Validação de endereço obrigatória
    if (!ValidationUtils.validarEndereco(this.endereco)) {
      errors.push('Endereço deve ter pelo menos 10 caracteres');
    }

    // Validação de bairro obrigatório
    if (!this.endereco?.bairro?.trim()) {
      errors.push('Bairro é obrigatório');
    }

    // Validação de tipo de moradia obrigatório
    if (!this.endereco?.tipoMoradia?.trim()) {
      errors.push('Tipo de moradia é obrigatório');
    }

    // Validação de composição familiar
    const totalMembros = (this.composicao?.criancas || 0) +
                        (this.composicao?.jovens || 0) +
                        (this.composicao?.adultos || 0) +
                        (this.composicao?.idosos || 0);

    if (totalMembros === 0) {
      errors.push('Deve haver pelo menos 1 membro na família');
    }

    return errors;
  }
}

module.exports = Familia;