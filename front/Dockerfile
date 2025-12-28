FROM node:lts-alpine AS deps
WORKDIR /app
run apk add curl

# Copy package manifests
COPY package.json yarn.lock ./

# Install dependencies with Yarn
RUN yarn install --frozen-lockfile

# 2. Rebuild the source code only when needed
FROM node:lts-alpine AS builder
WORKDIR /app

# Copy source code and dependencies
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Build the Next.js application
RUN yarn build


# 3. Production image, copy all the files and run next
FROM node:lts-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
# Use port 8080 for Next.js
ENV PORT=8080

# Copy necessary artifacts from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/.env ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Expose port 8080
EXPOSE 8080

# Start the Next.js application on port 8080
CMD ["yarn", "start", "--hostname", "0.0.0.0"]