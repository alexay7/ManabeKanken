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

EXPOSE 3000

# Install a static server in the runtime image
RUN bun add -g serve

# Start serving whichever output exists
CMD ["sh", "-c", "if [ -d dist ]; then serve -s dist -l 3000; else serve -s build -l 3000; fi"]

