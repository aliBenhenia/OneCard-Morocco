 # Use official Node.js image  
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install -f

COPY . .

# Build Next.js app
# RUN npm run build

# Expose port 3000
# EXPOSE 3000

# Start app
CMD [ "npm", "run", "dev" ]