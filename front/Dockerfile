# Step 1: Build the React app
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to install dependencies
COPY package.json yarn.lock ./

# Install the dependencies
RUN yarn install

# Copy the rest of the app's source code
COPY . ./

# Build the React app
RUN yarn build

# Step 2: Serve the app using Nginx
FROM nginx:alpine

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output to the Nginx's default public directory
COPY --from=build /app/out /usr/share/nginx/html

# Expose port 80 to access the app
EXPOSE 8080

# Start Nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]