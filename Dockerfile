FROM node:13.8

# Create api directory
WORKDIR /usr/src/cart-api

# Install api dependencies
COPY package.json ./
RUN npm install

# Bundle api source
COPY . .

EXPOSE 5000

CMD [ "node", "server.js" ]