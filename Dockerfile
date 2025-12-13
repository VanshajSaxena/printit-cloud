# ---------- Build stage ----------
FROM node:22-bookworm-slim AS builder

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock ./
COPY .yarn .yarn
COPY .yarnrc.yml ./

RUN yarn install --immutable

COPY . .

RUN yarn build

# ---------- Runtime stage ----------
FROM node:22-bookworm-slim

WORKDIR /app

# Copy only what we need to run
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/.yarn .yarn
COPY --from=builder /app/.yarnrc.yml ./

RUN corepack enable \ 
  && yarn install --immutable \
  && yarn cache clean --all

EXPOSE 3000

CMD ["node", "dist/main"]
