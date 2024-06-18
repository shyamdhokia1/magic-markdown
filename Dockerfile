# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7


ARG NODE_VERSION=18.0.0

# Use the official Node.js Alpine image as the base
FROM node:${NODE_VERSION}-alpine

# Set the working directory
WORKDIR /app

# Copy the build directory to the container
COPY . /app/

# Install serve globally
RUN npm install express --save

# Expose the port your application runs on (change 5000 if your app runs on a different port)
EXPOSE 3002

# Start the server
CMD ["node", "server.js"]  