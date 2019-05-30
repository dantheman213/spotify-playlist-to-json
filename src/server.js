'use strict';

const SpotifyScraper = require('./spotify.scraper');
const express = require('express');
const app = express();
const port = 3000;

app.get('/playlist/:id', (req, res) => {
    const spotifyId = req.params.id.indexOf('?') > -1 ? req.params.id.substr(0, req.params.id.indexOf('?')) : req.params.id;

    (async () => {
        const tracks = await SpotifyScraper.getPlaylist(spotifyId);
        res.json(tracks);
    })();
});

const server = app.listen(port, () => console.log(`App listening on port ${port}!`));
server.setTimeout(500 * 1000);

SpotifyScraper.init();
