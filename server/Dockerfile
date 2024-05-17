#FROM node:18-alpine
#FROM node:lts-hydrogen
FROM node:18.16.1

WORKDIR /app

COPY ["package.json", "yarn.lock*", "./"]
RUN yarn --pure-lockfile

COPY . .

RUN yarn build

EXPOSE 3000
CMD yarn start
