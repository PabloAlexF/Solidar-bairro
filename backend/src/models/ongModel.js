class ONG {
  constructor(data) {
    this.nomeEntidade = data.nomeEntidade;
    this.cnpj = data.cnpj;
    this.razaoSocial = data.razaoSocial;
    this.areaTrabalho = data.areaTrabalho;
    this.descricaoAtuacao = data.descricaoAtuacao;
    this.responsavel = {
      nome: data.responsavelNome,
      cpf: data.responsavelCpf
    };
    this.contato = {
      telefone: data.telefone,
      email: data.email
    };
    this.endereco = {
      endereco: data.endereco,
      bairro: data.bairro,
      cidade: data.cidade,
      uf: 'MG',
      cep: data.cep
    };
    this.tipo = 'ong';
    this.ativo = false;
    this.verificado = false;
    this.statusVerificacao = 'aguardando';
    this.criadoEm = new Date();
    this.atualizadoEm = new Date();
  }

  validate() {
    const errors = [];
    
    if (!this.nomeEntidade?.trim()) errors.push('Nome da entidade é obrigatório');
    if (!this.cnpj?.trim()) errors.push('CNPJ é obrigatório');
    if (!this.razaoSocial?.trim()) errors.push('Razão social é obrigatória');
    if (!this.areaTrabalho?.trim()) errors.push('Área de trabalho é obrigatória');
    if (!this.descricaoAtuacao?.trim()) errors.push('Descrição da atuação é obrigatória');
    if (!this.responsavel.nome?.trim()) errors.push('Nome do responsável é obrigatório');
    if (!this.responsavel.cpf?.trim()) errors.push('CPF do responsável é obrigatório');
    if (!this.contato.telefone?.trim()) errors.push('Telefone é obrigatório');
    if (!this.contato.email?.trim()) errors.push('Email é obrigatório');
    if (!this.endereco.endereco?.trim()) errors.push('Endereço é obrigatório');
    if (!this.endereco.bairro?.trim()) errors.push('Bairro é obrigatório');
    if (!this.endereco.cidade?.trim()) errors.push('Cidade é obrigatória');
    if (!this.endereco.cep?.trim()) errors.push('CEP é obrigatório');
    
    return errors;
  }
}

module.exports = ONG;