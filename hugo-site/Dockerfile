# Stage 1: Build the Hugo site
FROM hugomods/hugo:latest AS builder

# Set the working directory inside the container
WORKDIR /src

# Copy the entire project into the container
COPY . .

# Install Hugo modules (if any)
RUN hugo mod get -u

# Build the site with minification
RUN hugo build --destination /public

# Stage 2: Serve the site using Nginx
FROM nginx:alpine AS final

# Copy the generated site from the builder stage to Nginx's html directory
COPY --from=builder /src/public /usr/share/nginx/html

# Expose port 80 to serve the site
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
