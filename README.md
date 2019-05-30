# Spotify Playlist To JSON

Turnkey solution to get any public Spotify playlist as JSON using Google Chrome (headless). No API key required.

## What you get

* REST web app
* Docker/Compose
* Google Chrome (headless)
* NodeJS v12

## Prerequisites

You **only** need these items to run the application on any supported device:

* [Docker](https://www.docker.com)
* [Compose](https://docs.docker.com/compose)

## Getting Started

### Build Docker image & run application

    docker-compose up --build -d

### Start using the service

The application is now running. Please visit [http://localhost:3000/playlist/abc123](http://localhost:3000/playlist/abc123) but use a real Spotify playlist ID.

You can get an ID by right clicking a playlist in Spotify, share via URL, paste the URL into a text editor, and then extract the ID from the URL to give to the application.

The app will return metadata such as title, artist(s), and album for all songs in the target playlist as an array of JSON objects.

#### Example

##### Target Playlist

https://open.spotify.com/playlist/3NcxM1LJJdua8AcRxtijNY

##### Application Request

http://localhost:3000/playlist/3NcxM1LJJdua8AcRxtijNY

##### Sample Application Response

    {
      "name": "Classic Rock HITS : 90s Rock 80s Rock 70s Rock  60s Rock Music  'Best Rock Songs",
      "url": "https://open.spotify.com/playlist/3NcxM1LJJdua8AcRxtijNY",
      "coverArt": "https://pl.scdn.co/images/pl/default/51a1f097ab4d02c1b06e72fede4cbb6fda36b94c",
      "tracks": [
        {
          "artists": [
            {
              "name": "AC/DC",
              "url": "https://open.spotify.com/artist/711MCceyCBcFnzjGY4Q7Un"
            }
          ],
          "album": {
            "name": "Back In Black",
            "url": "https://open.spotify.com/album/6mUdeDZCsExyJLMdAfDuwh",
            "coverArt": "https://i.scdn.co/image/52d83377fe9d7fc838deeb859499f3973adf903f"
          },
          "song": {
            "title": "Back In Black",
            "duration": "4:15"
          }
        },
        ...
      ]
    }

## How does it work?

The Docker image built contains a special copy of Chrome used for headless browsing (program interacting with a website) and a REST web app that will automate actions in the browser and pull out publicly available data for that playlist and provide it to a consumer as a JSON payload.

## Development

TODO

### Installation 

TODO

#### Debugging

TODO

## Contribute

Community feedback and teamwork is welcome. If you spot bugs or optimization issues in the code or believe that the README can be improved, feel free to submit a pull request. You're also welcome to submit a new issue as well that fully explains the problem and recommended solution.

## References

These are projects that I drew inspiration from or have bundled with this project.

* https://developers.google.com/web/updates/2017/04/headless-chrome
* https://github.com/GoogleChrome/puppeteer
* https://github.com/buildkite/docker-puppeteer
* https://github.com/cheeriojs/cheerio
