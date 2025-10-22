# Use Node.js official image with better crypto support
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

ENV CHOKIDAR_USEPOLLING=true

CMD ["npm", "run", "start:dev"]
