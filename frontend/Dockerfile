FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy sisa kode project
COPY . .

# Expose port Vite default
EXPOSE 5173

# Jalankan server development
CMD ["npm", "run", "dev", "--", "--host"]