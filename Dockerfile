FROM node:24.10.0-alpine

WORKDIR /app

COPY package.json */package-lock.json* ./

# Instalar dependências baseado no lockfile presente
RUN npm install

# Copiar o restante dos arquivos do projeto
COPY . .

# Altera .env se existir, substituindo SEQUELIZE_HOST=localhost por SEQUELIZE_HOST=postgres
RUN if [ -f .env ]; then sed -i 's/SEQUELIZE_HOST = localhost/SEQUELIZE_HOST = postgres/g' .env; fi

EXPOSE 3000

# Container em idle
CMD ["tail", "-f", "/dev/null"]