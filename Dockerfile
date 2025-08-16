# ---------- Build stage ----------
FROM node:18-alpine AS builder
WORKDIR /app

# Install deps
COPY package*.json ./
# use ci if lockfile exists, else install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source
COPY . .

# (Optional) Build-time public envs (uncomment ARGs you need)
# ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# ARG NEXT_PUBLIC_RAZORPAY_KEY_ID
# ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# ENV NEXT_PUBLIC_RAZORPAY_KEY_ID=$NEXT_PUBLIC_RAZORPAY_KEY_ID

# Build Next.js
RUN npm run build

# ---------- Runtime stage ----------
FROM node:18-alpine
WORKDIR /app

# Copy only what’s needed to run
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Default Next.js port
EXPOSE 3000

# Start in production
CMD ["npm", "start"]
