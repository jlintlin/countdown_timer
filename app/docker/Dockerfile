# Multi-stage Dockerfile for Countdown Timer App
# Author: Jie Lin, Ph.D.
# Copyright © 2025 TLIN INVESTMENTS LLC
# All Rights Reserved.

# Development stage
FROM node:20-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy configuration files
COPY config ./config
COPY postcss.config.js ./

# Copy source code
COPY src ./src
COPY index.html ./

# Expose Vite dev server port range (5173-5183)
EXPOSE 5173-5183

# Start development server with host flag for Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy configuration files
COPY config ./config
COPY postcss.config.js ./

# Copy source code
COPY src ./src
COPY index.html ./

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

