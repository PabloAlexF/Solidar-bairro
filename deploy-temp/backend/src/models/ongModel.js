const ValidationUtils = require('../utils/validationUtils');

class ONG {
  constructor(data) {
    this.nome = data.nome;
    this.cnpj = data.cnpj;
    this.email = data.email;
    this.telefone = data.telefone;
    this.endereco = data.endereco;
    this.areasAtuacao = data.areasAtuacao || [];
    this.descricao = data.descricao;
    this.responsavel = data.responsavel || {};
    this.tipo = 'ong';
    this.ativo = false;
    this.verificado = false;
    this.statusVerificacao = 'aguardando';
    this.criadoEm = new Date();
    this.atualizadoEm = new Date();
  }

  validate() {
    const errors = [];

    // Validações obrigatórias para ONGs
    if (!this.nome?.trim()) {
      errors.push('Nome da ONG é obrigatório');
    } else if (this.nome.trim().length < 3) {
      errors.push('Nome da ONG deve ter pelo menos 3 caracteres');
    }

    // CNPJ obrigatório
    if (!this.cnpj?.trim()) {
      errors.push('CNPJ é obrigatório');
    } else if (this.cnpj.replace(/\D/g, '').length !== 14) {
      errors.push('CNPJ deve ter 14 dígitos');
    }

    if (!this.email?.trim()) {
      errors.push('E-mail é obrigatório');
    } else if (!ValidationUtils.validarEmail(this.email)) {
      errors.push('E-mail deve ter um formato válido');
    }

    if (!this.telefone?.trim()) {
      errors.push('Telefone é obrigatório');
    } else if (!ValidationUtils.validarTelefone(this.telefone)) {
      errors.push('Telefone deve ter 10 ou 11 dígitos');
    }

    // Validação de endereço obrigatória
    if (!ValidationUtils.validarEndereco(this.endereco)) {
      errors.push('Endereço deve ter pelo menos 10 caracteres');
    }

    // Validações opcionais mas recomendadas
    if (this.descricao?.trim() && this.descricao.trim().length < 10) {
      errors.push('Descrição deve ter pelo menos 10 caracteres (se informada)');
    }

    return errors;
  }
}

module.exports = ONG;