# 🤖 Bot de Validação Solidar Bairro

Bot inteligente em Python para validação automática de pedidos de ajuda na plataforma Solidar Bairro.

## 📋 Funcionalidades

### Validações Implementadas

1. **Inteligência de Texto**
   - Detecta texto repetitivo (ex: "dawdawdaw")
   - Verifica palavras reais em português
   - Analisa estrutura de frases

2. **Correspondência de Categoria**
   - Valida se a descrição corresponde à categoria selecionada
   - Usa palavras-chave primárias e contextuais
   - Suporte para: Alimentos, Medicamentos, Emprego, Roupas, Contas

3. **Autenticidade de Urgência**
   - Verifica se o texto justifica o nível de urgência
   - Detecta contradições (ex: "sem pressa" em caso "crítico")
   - Níveis: crítico, urgente, moderada, tranquilo

## 🚀 Como Usar

### Via API (Recomendado)

```bash
# Iniciar o backend Node.js
cd backend
npm start

# Fazer requisição para validação
curl -X POST http://localhost:3001/api/bot/validate \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Alimentos",
    "description": "Preciso de ajuda com comida para minha família",
    "urgency": "urgente"
  }'
```

### Diretamente em Python

```python
from solidar_bot import SolidarBot

bot = SolidarBot()
result = bot.validate_request({
    'category': 'Alimentos',
    'description': 'Preciso de ajuda com comida para minha família',
    'urgency': 'urgente'
})

print(result)
```

## 🧪 Testes

```bash
# Executar testes do bot
cd backend
python test_bot.py

# Testar via API
curl http://localhost:3001/api/bot/test
```

## 📊 Exemplo de Resposta

```json
{
  "isValid": true,
  "validations": {
    "textIntelligence": {
      "isValid": true,
      "message": "Texto demonstra inteligência e coerência"
    },
    "categoryMatch": {
      "isValid": true,
      "message": "Categoria compatível com a descrição"
    },
    "urgencyAuthenticity": {
      "isValid": true,
      "message": "Urgência condiz com o conteúdo da descrição"
    }
  },
  "suggestions": [],
  "confidence": 100
}
```

## 🔧 Configuração

### Pré-requisitos
- Python 3.7+
- Node.js 16+ (para integração com backend)

### Instalação
```bash
# Instalar dependências Python (se necessário)
pip install -r requirements.txt

# Instalar dependências Node.js
cd backend
npm install
```

## 📁 Estrutura de Arquivos

```
backend/
├── solidar_bot.py          # Bot principal
├── test_bot.py             # Testes do bot
├── requirements.txt        # Dependências Python
├── src/
│   ├── controllers/
│   │   └── botController.js # Controller Node.js
│   └── routes/
│       └── botRoutes.js     # Rotas da API
└── README_BOT.md           # Esta documentação
```

## 🎯 Categorias Suportadas

| Categoria | Palavras-chave Primárias | Contexto |
|-----------|-------------------------|----------|
| **Alimentos** | comida, fome, cesta, alimentar | cozinhar, comer, nutrição |
| **Medicamentos** | remédio, medicamento, saúde | hospital, médico, farmácia |
| **Emprego** | trabalho, emprego, desempregado | vaga, currículo, salário |
| **Roupas** | roupa, vestir, agasalho | blusa, sapato, uniforme |
| **Contas** | conta, boleto, pagamento | aluguel, luz, água |

## 🚨 Níveis de Urgência

- **Crítico**: Requer palavras como "urgente", "crítico", "emergência"
- **Urgente**: Aceita "rápido", "logo", "necessário"
- **Moderada**: Flexível, sem restrições específicas
- **Tranquilo**: Deve conter "sem pressa", "quando possível"

## 🔄 Integração com Frontend

O frontend React usa o bot via API:

```javascript
import { validateRequest } from './AIAssistant';

const result = await validateRequest({
  category: 'Alimentos',
  description: 'Descrição do pedido...',
  urgency: 'urgente'
});
```

## 🐛 Troubleshooting

### Erro: "Python script failed"
- Verifique se Python está instalado e no PATH
- Confirme que o arquivo `solidar_bot.py` existe

### Erro: "Failed to parse Python output"
- Verifique se não há prints extras no código Python
- Confirme que a saída é um JSON válido

### Bot sempre retorna válido
- Verifique se as validações estão sendo executadas
- Execute `python test_bot.py` para testar diretamente

## 📈 Melhorias Futuras

- [ ] Integração com modelos de ML mais avançados
- [ ] Análise de sentimento
- [ ] Detecção de spam mais sofisticada
- [ ] Suporte a mais idiomas
- [ ] Cache de resultados
- [ ] Métricas de performance

## 🤝 Contribuição

Para contribuir com o bot:

1. Adicione novos casos de teste em `test_bot.py`
2. Implemente novas validações na classe `SolidarBot`
3. Atualize a documentação
4. Teste thoroughly antes de submeter

---

**Solidar Bairro** - Bot de Validação Inteligente 🤖💚