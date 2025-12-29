class Familia {
  constructor(data) {
    this.nome = data.nome;
    this.endereco = data.endereco;
    this.telefone = data.telefone;
    this.email = data.email;
    this.membros = data.membros || [];
    this.necessidades = data.necessidades || [];
    this.status = data.status || 'ativa';
  }

  validate() {
    const errors = [];
    
    if (!this.nome?.trim()) errors.push('Nome é obrigatório');
    if (!this.endereco?.trim()) errors.push('Endereço é obrigatório');
    if (!this.telefone?.trim()) errors.push('Telefone é obrigatório');
    if (!this.email?.trim()) errors.push('Email é obrigatório');
    
    return errors;
  }
}

module.exports = Familia;