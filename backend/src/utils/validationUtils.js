class ValidationUtils {
  /**
   * Valida CPF brasileiro
   * @param {string} cpf - CPF a ser validado (apenas números)
   * @returns {boolean} - true se válido, false se inválido
   */
  static validarCPF(cpf) {
    if (!cpf) return false;

    // Remove caracteres não numéricos
    const cpfNumerico = cpf.replace(/\D/g, '');

    // Verifica se tem 11 dígitos
    if (cpfNumerico.length !== 11) return false;

    // Verifica se todos os dígitos são iguais (CPF inválido)
    if (/^(\d)\1+$/.test(cpfNumerico)) return false;

    // Calcula primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfNumerico.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== parseInt(cpfNumerico.charAt(9))) return false;

    // Calcula segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfNumerico.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== parseInt(cpfNumerico.charAt(10))) return false;

    return true;
  }

  /**
   * Valida CNPJ brasileiro
   * @param {string} cnpj - CNPJ a ser validado (apenas números)
   * @returns {boolean} - true se válido, false se inválido
   */
  static validarCNPJ(cnpj) {
    if (!cnpj) return false;

    // Remove caracteres não numéricos
    const cnpjNumerico = cnpj.replace(/\D/g, '');

    // Verifica se tem 14 dígitos
    if (cnpjNumerico.length !== 14) return false;

    // Verifica se todos os dígitos são iguais (CNPJ inválido)
    if (/^(\d)\1+$/.test(cnpjNumerico)) return false;

    // Calcula primeiro dígito verificador
    const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let soma = 0;
    for (let i = 0; i < 12; i++) {
      soma += parseInt(cnpjNumerico.charAt(i)) * pesos1[i];
    }
    let resto = soma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;
    if (digito1 !== parseInt(cnpjNumerico.charAt(12))) return false;

    // Calcula segundo dígito verificador
    const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    soma = 0;
    for (let i = 0; i < 13; i++) {
      soma += parseInt(cnpjNumerico.charAt(i)) * pesos2[i];
    }
    resto = soma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;
    if (digito2 !== parseInt(cnpjNumerico.charAt(13))) return false;

    return true;
  }

  /**
   * Valida telefone brasileiro
   * @param {string} telefone - Telefone a ser validado
   * @returns {boolean} - true se válido, false se inválido
   */
  static validarTelefone(telefone) {
    if (!telefone) return false;

    const telefoneNumerico = telefone.replace(/\D/g, '');

    // Telefone fixo: 10 dígitos (2 DDD + 8 número)
    // Celular: 11 dígitos (2 DDD + 9 número)
    return telefoneNumerico.length >= 10 && telefoneNumerico.length <= 11;
  }

  /**
   * Valida email
   * @param {string} email - Email a ser validado
   * @returns {boolean} - true se válido, false se inválido
   */
  static validarEmail(email) {
    if (!email) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida RG (formato brasileiro)
   * @param {string} rg - RG a ser validado
   * @returns {boolean} - true se válido, false se inválido
   */
  static validarRG(rg) {
    if (!rg) return false;

    const rgNumerico = rg.replace(/\D/g, '');
    // RG deve ter pelo menos 7 dígitos
    return rgNumerico.length >= 7;
  }

  /**
   * Valida data de nascimento (idade mínima 16 anos)
   * @param {string|Date} dataNascimento - Data de nascimento
   * @returns {boolean} - true se válido, false se inválido
   */
  static validarDataNascimento(dataNascimento) {
    if (!dataNascimento) return false;

    const data = new Date(dataNascimento);
    const hoje = new Date();
    const idade = hoje.getFullYear() - data.getFullYear();
    const mes = hoje.getMonth() - data.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < data.getDate())) {
      return idade - 1 >= 16;
    }

    return idade >= 16;
  }

  /**
   * Valida senha (mínimo 8 caracteres, com maiúscula, minúscula e número)
   * @param {string} senha - Senha a ser validada
   * @returns {boolean} - true se válido, false se inválido
   */
  static validarSenha(senha) {
    if (!senha) return false;

    // Pelo menos 8 caracteres
    if (senha.length < 8) return false;

    // Pelo menos uma letra maiúscula
    if (!/[A-Z]/.test(senha)) return false;

    // Pelo menos uma letra minúscula
    if (!/[a-z]/.test(senha)) return false;

    // Pelo menos um número
    if (!/\d/.test(senha)) return false;

    return true;
  }

  /**
   * Valida nome completo (pelo menos nome e sobrenome)
   * @param {string} nome - Nome a ser validado
   * @returns {boolean} - true se válido, false se inválido
   */
  static validarNomeCompleto(nome) {
    if (!nome) return false;

    const partes = nome.trim().split(/\s+/);
    return partes.length >= 2 && partes.every(parte => parte.length >= 2);
  }

  /**
   * Valida endereço
   * @param {string|object} endereco - Endereço a ser validado
   * @returns {boolean} - true se válido, false se inválido
   */
  static validarEndereco(endereco) {
    if (!endereco) return false;

    if (typeof endereco === 'string') {
      return endereco.trim().length >= 10;
    }

    if (typeof endereco === 'object') {
      return endereco.endereco?.trim().length >= 10 ||
             endereco.logradouro?.trim().length >= 10;
    }

    return false;
  }
}

module.exports = ValidationUtils;
