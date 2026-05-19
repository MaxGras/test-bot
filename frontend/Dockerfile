FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install dependencies
RUN npm install || pnpm install || yarn install

# Copy source code
COPY . .

# Expose port
EXPOSE 5173

# Run dev server with hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
