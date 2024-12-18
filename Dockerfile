# Step 1: Use the official Node.js image as the base
FROM node:14

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy the application code
COPY . .

# Step 5: Expose port 8080 for Cloud Run
EXPOSE 8080

# Step 6: Start the application
CMD ["npm", "start"]
