/**
 * PROJECT CONTEXT BUNDLER (ESM)
 * Objetivo: Concatenar todo o código fonte em um único arquivo para análise.
 * Segurança: Ignora automaticamente node_modules, .git e arquivos sensíveis.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIGURAÇÃO
const CONFIG = {
  outputFile: '_project_context.txt',
  rootDir: '.', // Raiz do projeto
  ignore: [
    'node_modules', 
    '.git', 
    'dist', 
    '.vscode', 
    'package-lock.json', 
    'yarn.lock', 
    '.env', // CRÍTICO: Nunca expor segredos
    '.DS_Store'
  ],
  // Apenas arquivos de texto úteis
  extensions: ['.js', '.ts', '.html', '.css', '.scss', '.json', '.md', '.sql'] 
};

// LÓGICA
const bundleFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    // Verificar Ignorados
    if (CONFIG.ignore.some(ignored => filePath.includes(ignored))) return;

    if (stat.isDirectory()) {
      bundleFiles(filePath, fileList);
    } else {
      // Filtrar por extensão
      if (CONFIG.extensions.includes(path.extname(file))) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
};

// EXECUÇÃO
(() => {
  try {
    console.log('📦 Iniciando empacotamento do contexto...');
    const allFiles = bundleFiles(path.resolve(__dirname, CONFIG.rootDir));
    
    let content = `# PROJECT CONTEXT - Gerado em: ${new Date().toISOString()}\n\n`;

    allFiles.forEach(file => {
      const relativePath = path.relative(__dirname, file);
      const fileContent = fs.readFileSync(file, 'utf-8');
      
      content += `\n================================================================================\n`;
      content += `FILE: ${relativePath}\n`;
      content += `================================================================================\n`;
      content += `${fileContent}\n`;
    });

    const outputPath = path.resolve(__dirname, CONFIG.outputFile);
    fs.writeFileSync(outputPath, content);
    
    console.log(`✅ Sucesso! ${allFiles.length} arquivos compilados em: ${CONFIG.outputFile}`);
    
  } catch (error) {
    console.error('❌ Erro ao gerar bundle:', error.message);
  }
})();