# Use the official Node.js image as the base image
FROM node:22

# Set the working directory inside the container
WORKDIR /usr/src/app

RUN corepack enable

# Copy package.json and package-lock.json to the working directory
COPY package.json yarn.lock ./

COPY .yarn .yarn

COPY .yarnrc.yml ./

# Install the application dependencies
RUN yarn install --immutable

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN yarn build

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]
