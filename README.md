# Spotify Playlist To JSON

Quickly and easily get any Spotify playlist metadata in JSON returned via HTTP API . No Spotify API key required.

## How Does It Work?

This app will load a full Chrome browser with no GUI (headless) into memory and load the playlist web page into it. The
app will scroll to the very bottom allowing all the lazily loaded AJAX items to be downloaded. At this point go through
all the HTML and pull out the necessary metadata. Open all song requests to get album/song cover arts. 
Returns a friendly JSON response for you or your app to consume.

## Getting Started

### Prerequisites

Make sure you have these installed:

* [Docker](https://www.docker.com)
* [Docker-Compose](https://docs.docker.com/compose)

### Download and run web service

```
git clone git@github.com:dantheman213/spotify-playlist-to-json.git
cd spotify-playlist-to-json/
docker-compose up --build -d
```

### Find Spotify Playlists you want to ingest

Look for Spotify playlists that you are interested in and get the Spotify Playlist ID. This can be done in many ways.
You can get an ID by right clicking a playlist in Spotify, select the "share via URL menu" option, paste the URL 
into a text editor, and then extract the ID from the URL to give to the application. This can also be automated
programmatically.

Here is an example:

https://open.spotify.com/playlist/3NcxM1LJJdua8AcRxtijNY

### Send queries to web service via HTTP API

Here is an example:

http://localhost:3000/playlist/query/3NcxM1LJJdua8AcRxtijNY

### Get status and results

Here is an example:

http://localhost:3000/playlist/result/3NcxM1LJJdua8AcRxtijNY

#### Sample Application Response

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

## Contribute

Community feedback and teamwork is welcome. If you spot bugs or optimization issues in the code or believe that the README can be improved, feel free to submit a pull request. You're also welcome to submit a new issue as well that fully explains the problem and recommended solution.

## References

* https://developers.google.com/web/updates/2017/04/headless-chrome

* https://github.com/GoogleChrome/puppeteer

* https://github.com/buildkite/docker-puppeteer

* https://github.com/cheeriojs/cheerio
