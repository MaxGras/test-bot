FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install dependencies
RUN npm install || pnpm install || yarn install

# Copy source code
COPY . .

# Copy and make entrypoint executable
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Expose port
EXPOSE 5173

# Run dev server with hot reload
ENTRYPOINT ["/app/entrypoint.sh"]
