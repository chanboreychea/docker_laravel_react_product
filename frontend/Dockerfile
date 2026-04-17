FROM node:22-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Command will be overridden in docker-compose.yml to enable host access
CMD ["npm", "run", "dev", "--", "--host"]
