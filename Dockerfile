FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run prisma:generate
RUN npm run build

ENV PORT=3000
EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push && npm run start"]
