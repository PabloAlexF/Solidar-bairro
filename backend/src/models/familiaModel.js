class Familia {
  constructor(data) {
    this.nomeCompleto = data.nomeCompleto;
    this.cpf = data.cpf;
    this.telefone = data.telefone;
    this.email = data.email;
    this.tipoCadastro = data.tipoCadastro;
    this.endereco = {
      endereco: data.endereco,
      bairro: data.bairro,
      pontoReferencia: data.pontoReferencia,
      cidade: 'Lagoa Santa',
      uf: 'MG'
    };
    this.composicao = {
      numeroPessoas: parseInt(data.numeroPessoas) || 1,
      criancas: parseInt(data.criancas) || 0,
      adolescentes: parseInt(data.adolescentes) || 0,
      adultos: parseInt(data.adultos) || 0,
      idosos: parseInt(data.idosos) || 0,
      gestantes: data.gestantes || false,
      pessoasDeficiencia: data.pessoasDeficiencia || false,
      familiaChefiadaMulher: data.familiaChefiadaMulher || false,
      situacaoRua: data.situacaoRua || false
    };
    this.situacaoSocioeconomica = {
      rendaFamiliar: data.rendaFamiliar,
      semEmpregoFormal: data.semEmpregoFormal || false,
      recebeBeneficio: data.recebeBeneficio || false,
      situacaoFamilia: data.situacaoFamilia
    };
    this.necessidades = data.necessidades || [];
    this.vulnerabilidade = data.vulnerabilidade || 'baixa';
    this.status = 'ativa';
    this.criadoEm = new Date();
    this.atualizadoEm = new Date();
  }

  validate() {
    const errors = [];
    
    if (!this.nomeCompleto?.trim()) errors.push('Nome do responsável é obrigatório');
    if (!this.telefone?.trim()) errors.push('Telefone é obrigatório');
    if (!this.tipoCadastro?.trim()) errors.push('Tipo de cadastro é obrigatório');
    if (!this.endereco?.endereco?.trim()) errors.push('Endereço é obrigatório');
    if (!this.endereco?.bairro?.trim()) errors.push('Bairro é obrigatório');
    if (!this.composicao?.numeroPessoas || this.composicao.numeroPessoas < 1) errors.push('Número de pessoas deve ser pelo menos 1');
    if (!this.situacaoSocioeconomica?.rendaFamiliar?.trim()) errors.push('Renda familiar é obrigatória');
    
    return errors;
  }
}

module.exports = Familia;