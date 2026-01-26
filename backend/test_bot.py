#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Teste do Bot de Validação - Solidar Bairro
"""

import json
from solidar_bot import SolidarBot

def test_bot():
    """Testa o bot com diferentes cenários"""
    bot = SolidarBot()
    
    test_cases = [
        {
            'name': 'Pedido válido - Alimentos',
            'data': {
                'category': 'Alimentos',
                'description': 'Preciso de ajuda com comida para minha família. Temos 3 filhos pequenos e estou desempregado há 2 meses.',
                'urgency': 'urgente'
            }
        },
        {
            'name': 'Pedido inválido - Texto repetitivo',
            'data': {
                'category': 'Alimentos',
                'description': 'dawdawdaw dawdawdaw dawdawdaw',
                'urgency': 'critico'
            }
        },
        {
            'name': 'Categoria incompatível',
            'data': {
                'category': 'Medicamentos',
                'description': 'Preciso de comida para meus filhos, estamos com fome',
                'urgency': 'moderada'
            }
        },
        {
            'name': 'Urgência inconsistente',
            'data': {
                'category': 'Contas',
                'description': 'Preciso pagar o aluguel quando possível, sem pressa',
                'urgency': 'critico'
            }
        }
    ]
    
    print(\"🤖 Testando Bot de Validação Solidar Bairro\\n\")\n    print(\"=\" * 60)\n    \n    for i, test_case in enumerate(test_cases, 1):\n        print(f\"\\n📋 Teste {i}: {test_case['name']}\")\n        print(\"-\" * 40)\n        \n        result = bot.validate_request(test_case['data'])\n        \n        print(f\"✅ Válido: {result['isValid']}\")\n        print(f\"🎯 Confiança: {result['confidence']}%\")\n        \n        if result['suggestions']:\n            print(\"💡 Sugestões:\")\n            for suggestion in result['suggestions']:\n                print(f\"   - {suggestion['message']}\")\n        \n        print(\"\\n🔍 Validações:\")\n        for key, validation in result['validations'].items():\n            status = \"✅\" if validation['isValid'] else \"❌\"\n            print(f\"   {status} {key}: {validation['message']}\")\n    \n    print(\"\\n\" + \"=\" * 60)\n    print(\"🎉 Testes concluídos!\")\n\nif __name__ == '__main__':\n    test_bot()