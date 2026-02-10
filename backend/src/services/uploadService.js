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
        fileSize: 10 * 1024 * 1024, // 10MB para mídia
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.avi'];
        const ext = path.extname(file.originalname).toLowerCase();

        if (allowedTypes.includes(ext)) {
          cb(null, true);
        } else {
          cb(new Error('Tipo de arquivo não permitido. Use PDF, DOC, DOCX, imagens ou vídeos.'));
        }
      }
    });
  }

  // Configuração específica para mídia do chat
  getChatMediaConfig() {
    return multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, cb) => {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/avi'];

        if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Tipo de arquivo não permitido. Use apenas imagens ou vídeos.'));
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