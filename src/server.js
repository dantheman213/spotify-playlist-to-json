'use strict';

const SpotifyScraper = require('./spotify.scraper');
const express = require('express');
const app = express();
const port = 3000;

app.get('/playlist/:id', (req, res) => {
    const spotifyId = req.params.id.indexOf('?') > -1 ? req.params.id.substr(0, req.params.id.indexOf('?')) : req.params.id;

    (async () => {
        const playlist = await SpotifyScraper.getPlaylist(spotifyId);
        res.json(playlist);
    })();
});

const server = app.listen(port, () => console.log(`App listening on port ${port}!`));
server.setTimeout(800 * 1000);

SpotifyScraper.init();
