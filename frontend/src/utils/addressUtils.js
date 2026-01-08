// Utility functions for handling address objects safely

export const formatAddress = (endereco) => {
  if (!endereco) return 'Endereço não informado';
  
  // If endereco is already a string, return it
  if (typeof endereco === 'string') return endereco;
  
  // If endereco is an object, format it properly
  if (typeof endereco === 'object') {
    const parts = [];
    
    if (endereco.rua) parts.push(endereco.rua);
    if (endereco.numero) parts.push(endereco.numero);
    if (endereco.bairro) parts.push(endereco.bairro);
    if (endereco.cidade) parts.push(endereco.cidade);
    if (endereco.estado) parts.push(endereco.estado);
    
    return parts.length > 0 ? parts.join(', ') : 'Endereço não informado';
  }
  
  return 'Endereço não informado';
};

export const formatLocation = (endereco, cidade, estado) => {
  if (typeof endereco === 'object' && endereco) {
    return `${endereco.bairro || 'Local'}, ${endereco.cidade || 'Cidade'} - ${endereco.estado || 'Estado'}`;
  }
  
  if (typeof endereco === 'string') {
    return endereco;
  }
  
  if (cidade && estado) {
    return `${cidade}, ${estado}`;
  }
  
  return 'Localização não informada';
};

export const formatNeighborhood = (endereco, bairro) => {
  if (typeof endereco === 'object' && endereco?.bairro) {
    return endereco.bairro;
  }
  
  if (typeof endereco === 'string') {
    return endereco;
  }
  
  return bairro || 'Bairro não informado';
};

// Safe render function to prevent React errors when objects are rendered directly
export const safeRenderAddress = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'object') {
    // If it's an address object, format it
    if (value.rua || value.bairro || value.cidade || value.estado) {
      return formatAddress(value);
    }
    
    // For other objects, return empty string to prevent React error
    return '';
  }
  
  return String(value);
};