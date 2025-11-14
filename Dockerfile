FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first to leverage Docker layer cache
COPY package*.json ./

# Install all dependencies (including devDependencies) to build TypeScript
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

# Run in production mode
ENV NODE_ENV=production

# Copy only runtime artifacts from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Start the built app
CMD ["node", "dist/server.js"]