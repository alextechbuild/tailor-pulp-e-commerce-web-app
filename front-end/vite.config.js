// Importe la fonction 'defineConfig' de Vite, qui aide à bénéficier d'une autocomplétion et validation pour la config  
import { defineConfig } from 'vite'

// Importe le plugin React optimisé avec SWC (un compilateur ultra-rapide), pour supporter React dans Vite  
import react from '@vitejs/plugin-react-swc' 

import fs from 'fs';

import path from 'path'

// Chemins relatifs vers les certs backend
const keyPath = path.resolve(__dirname, '../back-end/certs/localhost+2-key.pem')
const certPath = path.resolve(__dirname, '../back-end/certs/localhost+2.pem')

// Exporte la configuration Vite, enveloppée avec defineConfig pour une meilleure expérience dev  
export default defineConfig(({ mode }) => {  
  
  const isDev = mode === 'development'

  return {

    define: {
      global: 'window'
    },

    // Active le plugin React avec SWC dans Vite (support JSX, Fast Refresh, etc.)  
    plugins: [react()],  

    server: isDev ? {  
      
      host: true,   // ← écoute sur toutes les interfaces
      https: {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      },
      // Configure le serveur de développement pour écouter sur le port 3000 au lieu du port par défaut 5173  
      port: 3000,
      strictPort: true

    } : undefined,  
  }
});
