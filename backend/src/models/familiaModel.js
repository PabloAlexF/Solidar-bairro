class Familia {
  constructor(data) {
    this.nomeCompleto = data.nomeCompleto;
    this.dataNascimento = data.dataNascimento;
    this.estadoCivil = data.estadoCivil;
    this.profissao = data.profissao;
    this.cpf = data.cpf;
    this.rg = data.rg;
    this.nis = data.nis || '';
    this.rendaFamiliar = data.rendaFamiliar;
    this.telefone = data.telefone;
    this.whatsapp = data.whatsapp || '';
    this.email = data.email || '';
    this.horarioContato = data.horarioContato;
    this.endereco = {
      endereco: data.endereco,
      bairro: data.bairro,
      pontoReferencia: data.pontoReferencia || '',
      tipoMoradia: data.tipoMoradia,
      cidade: 'Lagoa Santa',
      uf: 'MG'
    };
    this.composicao = {
      criancas: parseInt(data.criancas) || 0,
      jovens: parseInt(data.jovens) || 0,
      adultos: parseInt(data.adultos) || 1,
      idosos: parseInt(data.idosos) || 0
    };
    this.necessidades = data.necessidades || [];
    this.tipo = 'familia';
    this.ativo = true;
    this.criadoEm = new Date();
    this.atualizadoEm = new Date();
  }

  validate() {
    const errors = [];
    
    if (!this.nomeCompleto?.trim()) errors.push('Nome do responsável é obrigatório');
    if (!this.dataNascimento) errors.push('Data de nascimento é obrigatória');
    if (!this.estadoCivil?.trim()) errors.push('Estado civil é obrigatório');
    if (!this.profissao?.trim()) errors.push('Profissão é obrigatória');
    if (!this.cpf?.trim()) errors.push('CPF é obrigatório');
    if (!this.rg?.trim()) errors.push('RG é obrigatório');
    if (!this.rendaFamiliar?.trim()) errors.push('Renda familiar é obrigatória');
    if (!this.telefone?.trim()) errors.push('Telefone é obrigatório');
    if (!this.horarioContato?.trim()) errors.push('Horário de contato é obrigatório');
    if (!this.endereco?.endereco?.trim()) errors.push('Endereço é obrigatório');
    if (!this.endereco?.bairro?.trim()) errors.push('Bairro é obrigatório');
    if (!this.endereco?.tipoMoradia?.trim()) errors.push('Tipo de moradia é obrigatório');
    
    return errors;
  }
}

module.exports = Familia;