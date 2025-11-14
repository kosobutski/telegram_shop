FROM node:20-alpine AS deps-prod
WORKDIR /app
COPY package.json yarn.lock* ./
RUN yarn install --production --frozen-lockfile

FROM deps-prod AS build
RUN yarn install --frozen-lockfile
COPY . .
RUN npx prisma generate
RUN yarn build

FROM node:20-alpine AS prod

WORKDIR /app

COPY --from=build /app/package.json ./
COPY --from=deps-prod /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/prisma ./prisma

CMD sh -c "npx prisma migrate deploy && node dist/shared/seed.js || true && yarn start"