const { spawn } = require('child_process');
const path = require('path');

class BotController {
  /**
   * Valida pedido de ajuda usando o bot Python robusto
   */
  static async validateRequest(req, res) {
    try {
      const { category, description, urgency, visibility } = req.body;

      if (!category || !description) {
        return res.status(400).json({
          success: false,
          message: 'Categoria e descrição são obrigatórias'
        });
      }

      // Chama o bot Python robusto
      const result = await BotController.callRobustPythonBot({
        category,
        description,
        urgency: urgency || 'moderada',
        visibility: visibility || []
      });

      // Se não passou na validação, retorna erro detalhado
      if (!result.isValid) {
        return res.status(422).json({
          success: false,
          message: 'Pedido não passou na validação da IA',
          validation: {
            ...result,
            canPublish: result.isValid
          },
          canPublish: result.isValid
        });
      }

      res.json({
        success: true,
        message: 'Pedido validado com sucesso',
        data: {
          ...result,
          canPublish: result.isValid
        },
        canPublish: result.isValid
      });

    } catch (error) {
      console.error('Erro na validação do bot:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message,
        canPublish: false
      });
    }
  }

  /**
   * Chama o bot Python robusto
   */
  static callRobustPythonBot(formData) {
    return new Promise((resolve, reject) => {
      const pythonScript = path.join(__dirname, '../../solidar_bot_robust.py');
      
      const python = spawn('python', [pythonScript], {
        cwd: path.dirname(pythonScript)
      });

      let dataString = '';
      let errorString = '';

      // Send form data to Python script via stdin
      python.stdin.write(JSON.stringify(formData));
      python.stdin.end();

      python.stdout.on('data', (data) => {
        dataString += data.toString();
      });

      python.stderr.on('data', (data) => {
        errorString += data.toString();
      });

      python.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python script failed: ${errorString}`));
          return;
        }

        try {
          const result = JSON.parse(dataString.trim());
          resolve(result);
        } catch (parseError) {
          reject(new Error(`Failed to parse Python output: ${parseError.message}`));
        }
      });

      python.on('error', (error) => {
        reject(new Error(`Failed to start Python process: ${error.message}`));
      });
    });
  }

  /**
   * Endpoint de teste do bot robusto
   */
  static async testBot(req, res) {
    try {
      const testCases = [
        {
          name: 'Pedido válido',
          data: {
            category: 'Alimentos',
            description: 'Preciso urgentemente de ajuda com comida para minha família. Somos 4 pessoas, tenho 2 filhos pequenos de 3 e 5 anos. Estou desempregado há 3 meses.',
            urgency: 'critico'
          }
        },
        {
          name: 'Spam detectado',
          data: {
            category: 'Alimentos',
            description: 'dawdawdaw dawdawdaw preciso ajuda dawdawdaw',
            urgency: 'urgente'
          }
        },
        {
          name: 'Categoria incorreta',
          data: {
            category: 'Medicamentos',
            description: 'Preciso de comida para meus filhos, estamos com fome há dias',
            urgency: 'critico'
          }
        }
      ];

      const results = [];
      
      for (const testCase of testCases) {
        try {
          const result = await BotController.callRobustPythonBot(testCase.data);
          results.push({
            test: testCase.name,
            input: testCase.data,
            result: result,
            passed: result.isValid
          });
        } catch (error) {
          results.push({
            test: testCase.name,
            input: testCase.data,
            error: error.message,
            passed: false
          });
        }
      }

      res.json({
        success: true,
        message: 'Testes do bot robusto executados',
        results: results
      });

    } catch (error) {
      console.error('Erro no teste do bot:', error);
      res.status(500).json({
        success: false,
        message: 'Erro no teste do bot',
        error: error.message
      });
    }
  }

  /**
   * Análise detalhada de um pedido
   */
  static async analyzeRequest(req, res) {
    try {
      const { category, description, urgency, visibility } = req.body;

      const result = await BotController.callRobustPythonBot({
        category,
        description,
        urgency: urgency || 'moderada',
        visibility: visibility || []
      });

      res.json({
        success: true,
        analysis: {
          canPublish: result.isValid,
          riskScore: result.riskScore,
          confidence: result.confidence,
          summary: result.analysis,
          validations: result.validations,
          suggestions: result.suggestions
        }
      });

    } catch (error) {
      console.error('Erro na análise:', error);
      res.status(500).json({
        success: false,
        message: 'Erro na análise do pedido',
        error: error.message
      });
    }
  }
}

module.exports = BotController;