### BASE
FROM node:20-alpine as builder

# Project information as Label
LABEL name="Congenital Heart Disease (CHD)"

# Workflow directory
WORKDIR /app

COPY . .

# Install dependencies and build the project
RUN npm install
RUN npm run dev

# Bundle static assets with nginx
FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production
# Copy built assets from `builder` image
COPY --from=builder /app/build /usr/share/nginx/html
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
