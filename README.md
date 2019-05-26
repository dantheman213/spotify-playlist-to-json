# Spotify Playlist To JSON

Use headless Chrome to scrape Spotify playlists and convert playlist track data to a JSON array of objects.

## What you get

* Google Chrome (headless)
* NodeJS v10
* Spotify playlist -> JSON object app

## Prerequisites

### Minimum Software Required To Deploy Application

You **only** need these items to run the application on any supported device:

* [Docker](https://www.docker.com)
* [Compose](https://docs.docker.com/compose)

### For Development

TODO

#### Debugging

TODO

## Getting Started

### Build Docker image & run application

    docker-compose up --build -d

#### Start using the service

The application is now running. Please visit [http://localhost:3000/playlist/abc123](http://localhost:3000/playlist/abc123) but use a real Spotify playlist ID. You can get an ID by right clicking a playlist in Spotify, share via URL, paste the URL into a text editor, and then extract the ID from the URL to give to the application.

## Development

TODO

## Contribute

Community feedback is welcome. If you spot bugs or optimization issues in the code or believe that the README can be improved, feel free to submit a pull request. You're also welcome to submit a new issue as well that fully explains the problem and recommended solution.

## References

These are projects that I drew inspiration from or have bundled with this project.

* https://developers.google.com/web/updates/2017/04/headless-chrome
* https://github.com/GoogleChrome/puppeteer
* https://github.com/buildkite/docker-puppeteer
* https://github.com/cheeriojs/cheerio
