class Cidadao {
  constructor(data) {
    this.nome = data.nome;
    this.email = data.email;
    this.telefone = data.telefone;
    this.dataNascimento = data.dataNascimento;
    this.ocupacao = data.ocupacao;
    this.cpf = data.cpf;
    this.rg = data.rg;
    this.endereco = data.endereco;
    this.senha = data.senha || data.password;
    this.tipo = 'cidadao';
    this.ativo = true;
    this.criadoEm = new Date();
    this.atualizadoEm = new Date();
  }

  validate() {
    const errors = [];

    if (!this.nome?.trim()) {
      errors.push('Nome é obrigatório');
    }

    if (!this.email?.trim()) {
      errors.push('E-mail é obrigatório');
    }

    if (!this.telefone?.trim()) {
      errors.push('Telefone é obrigatório');
    }

    if (!this.senha?.trim()) {
      errors.push('Senha é obrigatória');
    } else if (this.senha.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }

    return errors;
  }
}

module.exports = Cidadao;