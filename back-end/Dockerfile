FROM node:20-alpine

WORKDIR /usr/src/app/back-end

# Installe les certificats CA pour les connexions HTTPS
RUN apk add --no-cache ca-certificates

# Copier les fichiers nécessaires
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

# Nodemon pour reload automatique
CMD ["npm", "run", "dev"]
