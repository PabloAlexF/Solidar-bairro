class Comercio {
  constructor(data) {
    this.nomeComercio = data.nomeComercio;
    this.cnpj = data.cnpj;
    this.email = data.email;
    this.telefone = data.telefone;
    this.endereco = data.endereco;
    this.categoria = data.categoria;
    this.descricao = data.descricao;
    this.horarioFuncionamento = data.horarioFuncionamento || {};
    this.tipo = 'comercio';
    this.ativo = true;
    this.verificado = false;
    this.criadoEm = new Date();
    this.atualizadoEm = new Date();
  }

  validate() {
    const errors = [];
    
    if (!this.nomeComercio?.trim()) errors.push('Nome do comércio é obrigatório');
    if (!this.cnpj?.trim()) errors.push('CNPJ é obrigatório');
    if (!this.email?.trim()) errors.push('Email é obrigatório');
    if (!this.telefone?.trim()) errors.push('Telefone é obrigatório');
    
    // Validação simplificada de endereço
    if (!this.endereco) {
      errors.push('Endereço é obrigatório');
    }
    
    return errors;
  }
}

module.exports = Comercio;