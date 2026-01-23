# 1. Gunakan Node.js
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json dan install dependencies
COPY package*.json ./
# Install dependency
RUN npm install 

# 4. Copy seluruh source code
COPY . .

# 5. Generate Prisma Client
RUN npx prisma generate || true

# 6. Build TypeScript ke JavaScript
RUN npm run build 

# 7. Expose port (Ini dokumentasi saja, port asli diatur di docker-compose)
EXPOSE 3000 3001 3002 3003

# 8. Jalankan aplikasi dari folder dist
CMD ["node", "dist/index.js"]