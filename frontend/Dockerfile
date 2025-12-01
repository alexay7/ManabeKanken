# Use an official Bun runtime as a parent image
FROM oven/bun:1 AS build

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json bun.lock ./

RUN bun install

#Install serve
RUN bun add -g serve

# Bundle app source
COPY . .

# Build the app
RUN bun run build

# Final runtime image
FROM oven/bun:1 AS runtime
WORKDIR /usr/src/app

# Copy built assets (support both Vite 'dist' and CRA 'build')
COPY --from=build /usr/src/app/dist ./dist

COPY /env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

EXPOSE 3000

# Install a static server in the runtime image
RUN bun add -g serve

