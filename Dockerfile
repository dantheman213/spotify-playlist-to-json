FROM buildkite/puppeteer:latest

WORKDIR /opt/app
COPY . .

RUN mkdir -p /var/log/jobs
RUN npm install

ENTRYPOINT [ "npm", "start" ]
