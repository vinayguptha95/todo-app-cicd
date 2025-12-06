FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy all necessary source files
COPY src/ ./src

# Set NODE_ENV
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Run the backend
CMD ["node", "src/index.js"]
