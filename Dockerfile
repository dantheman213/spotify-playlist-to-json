FROM node:12.3.1-slim

# Install latest chrome dev package that will allow this version of Chromium/Pupeteer work together.
RUN  apt-get update \
     && apt-get install -y wget \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y google-chrome-unstable --no-install-recommends \
     && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/app
COPY . .

RUN mkdir -p /var/log/jobs
RUN npm install

ENTRYPOINT [ "npm", "start" ]
