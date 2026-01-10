class Cidadao {
  constructor(data) {
    this.nome = data.nome;
    this.email = data.email;
    this.telefone = data.telefone;
    this.dataNascimento = data.dataNascimento;
    this.ocupacao = data.ocupacao;
    this.cpf = data.cpf;
    this.rg = data.rg;
    this.endereco = data.endereco || '';
    this.disponibilidade = data.disponibilidade || [];
    this.interesses = data.interesses || [];
    this.proposito = data.proposito || '';
    this.senha = data.senha; // Campo para senha hasheada
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
    if (!this.dataNascimento) errors.push('Data de nascimento é obrigatória');
    if (!this.ocupacao?.trim()) errors.push('Ocupação é obrigatória');
    if (!this.cpf?.trim()) errors.push('CPF é obrigatório');
    if (!this.rg?.trim()) errors.push('RG é obrigatório');
    if (!this.endereco?.trim()) errors.push('Endereço é obrigatório');
    
    return errors;
  }
}

module.exports = Cidadao;