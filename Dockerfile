# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Install Hugo
RUN apk add --no-cache hugo

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port (if needed)
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]
