FROM buildkite/puppeteer:latest

WORKDIR /opt/app
COPY . .

RUN npm install

ENTRYPOINT [ "npm", "start" ]
