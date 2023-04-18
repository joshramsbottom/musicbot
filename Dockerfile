FROM node:18.4-bullseye-slim
RUN apt update && apt install ffmpeg -y
ENV NODE_ENV production
RUN npm install -g pnpm
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
USER node
COPY --chown=node:node . .
CMD [ "node", "index.js" ]
