class Cidadao {
  constructor(data) {
    this.nome = data.nome;
    this.email = data.email;
    this.telefone = data.telefone;
    this.endereco = {
      cep: data.cep,
      rua: data.rua,
      numero: data.numero,
      complemento: data.complemento || '',
      bairro: data.bairro,
      cidade: data.cidade,
      estado: data.estado
    };
    this.tipo = 'cidadao';
    this.ativo = true;
    this.criadoEm = new Date();
    this.atualizadoEm = new Date();
  }

  validate() {
    const errors = [];
    
    if (!this.nome?.trim()) errors.push('Nome é obrigatório');
    if (!this.email?.trim()) errors.push('Email é obrigatório');
    if (!this.telefone?.trim()) errors.push('Telefone é obrigatório');
    if (!this.endereco.cep?.trim()) errors.push('CEP é obrigatório');
    if (!this.endereco.rua?.trim()) errors.push('Rua é obrigatória');
    if (!this.endereco.numero?.trim()) errors.push('Número é obrigatório');
    if (!this.endereco.bairro?.trim()) errors.push('Bairro é obrigatório');
    if (!this.endereco.cidade?.trim()) errors.push('Cidade é obrigatória');
    if (!this.endereco.estado?.trim()) errors.push('Estado é obrigatório');
    
    return errors;
  }
}

module.exports = Cidadao;