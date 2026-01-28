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
    
    if (!this.nome?.trim()) errors.push('Nome da ONG é obrigatório');
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

module.exports = ONG;