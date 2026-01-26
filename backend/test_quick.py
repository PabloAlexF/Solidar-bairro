import json
import sys
import os

# Adicionar o diretório do bot ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from solidar_bot_robust import SolidarBotRobust

def test_quick():
    bot = SolidarBotRobust()
    
    # Teste com pedido simples
    test_data = {
        'category': 'Alimentos',
        'description': 'Preciso de ajuda',
        'urgency': 'critico'
    }
    
    result = bot.validate_request(test_data)
    
    print(f"Pode publicar: {result['isValid']}")
    print(f"Confiança: {result['confidence']}%")
    print(f"Risco: {result['riskScore']}%")
    print(f"Análise: {result['analysis']}")
    
    if result['suggestions']:
        print("Sugestões:")
        for i, s in enumerate(result['suggestions'], 1):
            print(f"  {i}. {s['message']}")
    else:
        print("Nenhuma sugestão")

if __name__ == '__main__':
    test_quick()