FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY server.js ./
COPY public ./public

# Create audio directory (will be mounted as volume)
RUN mkdir -p public/audio

# Expose port
EXPOSE 8088

# Start the application
CMD ["node", "server.js"]
