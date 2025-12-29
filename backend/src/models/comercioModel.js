class Comercio {
  constructor(data) {
    this.nomeEstabelecimento = data.nomeEstabelecimento;
    this.cnpj = data.cnpj;
    this.razaoSocial = data.razaoSocial;
    this.tipoComercio = data.tipoComercio;
    this.descricaoAtividade = data.descricaoAtividade;
    this.responsavel = {
      nome: data.responsavelNome,
      cpf: data.responsavelCpf
    };
    this.contato = {
      telefone: data.telefone,
      email: data.email || ''
    };
    this.endereco = {
      endereco: data.endereco,
      bairro: data.bairro,
      cidade: data.cidade,
      uf: data.uf || 'MG'
    };
    this.tipo = 'comercio';
    this.ativo = true;
    this.verificado = false;
    this.criadoEm = new Date();
    this.atualizadoEm = new Date();
  }

  validate() {
    const errors = [];
    
    if (!this.nomeEstabelecimento?.trim()) errors.push('Nome do estabelecimento é obrigatório');
    if (!this.cnpj?.trim()) errors.push('CNPJ é obrigatório');
    if (!this.razaoSocial?.trim()) errors.push('Razão social é obrigatória');
    if (!this.tipoComercio?.trim()) errors.push('Tipo de comércio é obrigatório');
    if (!this.responsavel.nome?.trim()) errors.push('Nome do responsável é obrigatório');
    if (!this.responsavel.cpf?.trim()) errors.push('CPF do responsável é obrigatório');
    if (!this.contato.telefone?.trim()) errors.push('Telefone é obrigatório');
    if (!this.endereco.endereco?.trim()) errors.push('Endereço é obrigatório');
    if (!this.endereco.bairro?.trim()) errors.push('Bairro é obrigatório');
    if (!this.endereco.cidade?.trim()) errors.push('Cidade é obrigatória');
    
    return errors;
  }
}

module.exports = Comercio;