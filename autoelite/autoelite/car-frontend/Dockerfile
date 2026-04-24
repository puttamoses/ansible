# Stage 1 — Build React app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# .env.production is used by React during build
# It contains REACT_APP_API_URL=http://YOUR_NODE_IP:30500
COPY .env.production .env.production

COPY . .
RUN npm run build

# Stage 2 — Serve with Nginx
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
