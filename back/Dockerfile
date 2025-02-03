# Use Node.js official image as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm ci
RUN npm install -g @nestjs/cli

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port the app runs on
EXPOSE 8081

# Command to run the application
CMD ["npm", "run", "start:prod"]