 # Node.js image
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3001


# Start backend server in src
CMD ["node", "src/server.js"]
