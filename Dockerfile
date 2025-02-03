# Step 1: Build stage
FROM node:23-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Production stage (no TypeScript needed in runtime)
FROM node:23-alpine

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package.json package-lock.json ./
RUN npm install --only=production

EXPOSE 3000
CMD ["node", "dist/server.js"]
