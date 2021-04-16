FROM node:12

# Create api directory
RUN mkdir -p /cart-api
WORKDIR /cart-api

# Install api dependencies
COPY package.json ./
RUN npm install

# Bundle api source
COPY . .

# Expose ports
EXPOSE 5000