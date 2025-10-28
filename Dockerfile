FROM node:24.10.0-alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

COPY package.json */package-lock.json* ./

# Instalar dependências baseado no lockfile presente
RUN npm install

# Copiar o restante dos arquivos do projeto
COPY . .

EXPOSE 3000

# Container em idle
CMD ["tail", "-f", "/dev/null"]