# Root Dockerfile for the fullstack AI accounting app
FROM node:24-alpine AS base
WORKDIR /app

# Install root dependencies and workspace packages
COPY package.json .
COPY backend/package.json backend/
COPY frontend/package.json frontend/
RUN npm install

# Build frontend static files
COPY frontend ./frontend
RUN cd frontend && npm run build

# Build backend server
COPY backend ./backend
RUN cd backend && npm run build

# Production image
FROM node:24-alpine AS runner
WORKDIR /app
COPY --from=base /app/backend/dist ./backend/dist
COPY --from=base /app/backend/package.json ./backend/package.json
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/frontend/dist ./frontend/dist
COPY --from=base /app/backend/.env.example ./backend/.env.example

WORKDIR /app/backend
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/index.js"]
