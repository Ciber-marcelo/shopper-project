FROM node:16

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos
COPY . .

EXPOSE 8080

# Comando para rodar a aplicação
CMD ["npm", "run", "dev"]