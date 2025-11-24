FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first for better cache
COPY package*.json ./
COPY .env .env

# Copy prisma folder (for migration and generate)
COPY prisma ./prisma

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Generate Prisma client and build Next.js
RUN npx prisma generate
RUN npm run build

# Set environment and expose port
ENV PORT=3000
EXPOSE 3000

# Run migration and start app
CMD ["sh", "-c", "npx prisma db push && npm run start"]