'use strict';

const SpotifyScraper = require('./spotify.scraper');
const express = require('express');
const app = express();
const port = 3000;

const jobs = new Map();

app.get('/playlist/query/:id', (req, res) => {
    const spotifyPlaylistId = req.params.id.indexOf('?') > -1 ? req.params.id.substr(0, req.params.id.indexOf('?')) : req.params.id;

    if (jobs.has(spotifyPlaylistId)) {
        res.status(400).json({found: true, status: 'playlist already exists in memory. try getting result instead.'});
        return;
    }

    jobs.set(spotifyPlaylistId, false);

    (async (spotifyPlaylistId) => {
        const s = new SpotifyScraper();
        s.init();
        const playlist = await s.getPlaylist(spotifyPlaylistId);
        jobs.set(spotifyPlaylistId, playlist);
    })(spotifyPlaylistId);

    res.json({
        resultId: spotifyPlaylistId
    });
});

app.get('/playlist/result/:id', (req, res) => {
    const resultId = req.params.id;
    if (resultId !== '') {
        if (jobs.has(resultId)) {
            const job = jobs.get(resultId);
            if (!job) {
                res.json({found: true, status: 'downloading'});
            } else {
                res.json({found: true, status: 'complete', payload: job});
            }
            return;
        }
    }

    res.json({found: false, status: null, payload: null});
});

app.delete('/playlist/result/:id', (req, res) => {
    const resultId = req.params.id;
    if (resultId !== '') {
        if (jobs.has(resultId)) {
            if (jobs.get(resultId) === false) {
                res.status(400).json({found: true, status: 'can not delete while job is in progress'});
            } else {
                jobs.delete(resultId);
                res.json({found: true, status: 'deleted successfully'});
            }
            return;
        }
    }

    res.json({found: false, status: null});
});

const server = app.listen(port, () => console.log(`App listening on port ${port}!`));
server.setTimeout(800 * 1000);
