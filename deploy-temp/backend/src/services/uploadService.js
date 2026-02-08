const firebase = require('../config/firebase');
const multer = require('multer');
const path = require('path');

class UploadService {
  constructor() {
    this.storage = firebase.getStorage();
    this.bucket = this.storage.bucket();
  }

  // Configuração do multer para upload em memória
  getMulterConfig() {
    return multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.doc', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        
        if (allowedTypes.includes(ext)) {
          cb(null, true);
        } else {
          cb(new Error('Tipo de arquivo não permitido. Use PDF, DOC ou DOCX.'));
        }
      }
    });
  }

  // Upload de arquivo para Firebase Storage
  async uploadFile(file, folder = 'documentos') {
    try {
      const fileName = `${folder}/${Date.now()}-${file.originalname}`;
      const fileUpload = this.bucket.file(fileName);

      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      return new Promise((resolve, reject) => {
        stream.on('error', reject);
        stream.on('finish', async () => {
          try {
            // Tornar o arquivo público
            await fileUpload.makePublic();
            
            // Obter URL pública
            const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${fileName}`;
            
            resolve({
              fileName,
              publicUrl,
              originalName: file.originalname
            });
          } catch (error) {
            reject(error);
          }
        });

        stream.end(file.buffer);
      });
    } catch (error) {
      throw new Error(`Erro no upload: ${error.message}`);
    }
  }

  // Upload múltiplos arquivos
  async uploadMultipleFiles(files, folder = 'documentos') {
    const uploads = [];
    
    for (const file of files) {
      const result = await this.uploadFile(file, folder);
      uploads.push(result);
    }
    
    return uploads;
  }
}

module.exports = new UploadService();