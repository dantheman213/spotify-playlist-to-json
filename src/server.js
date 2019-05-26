'use strict';

const cheerio = require('cheerio');
const random = require('random');
const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const port = 3000;

app.get('/playlist/:id', (req, res) => {
    (async () => {
        console.log('Starting headless browser...');
        const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        const page = await browser.newPage();
        await page.setViewport({
            width: 1200,
            height: 800
        });

        const spotifyUrl = 'https://open.spotify.com/playlist/' + req.params.id;
        console.log('Navigating to ' + spotifyUrl);
        await page.goto(spotifyUrl);

        console.log('Navigating to bottom of page until scrolling stops to collect all songs for playlist; this will take awhile...');
        await checkPlaylistScrollForNewSongs(page);
        await page.screenshot({
            path: '/var/log/jobs/jobs_' + (new Date().getTime()) + '.png',
            fullPage: true
        });

        const trackRows = await (page.$$('.tracklist-name'));
        console.log('Found ' + trackRows.length + ' tracks!');

        const html = await page.evaluate(() => document.documentElement.outerHTML);
        const $ = cheerio.load(html);

        const tracks = [];

        $('.tracklist-row').each( (i, elem) => {
            const title = $(elem).find($('.tracklist-name')).first().text();
            const artist = $(elem).find($('.tracklist-row__artist-name-link')).first().text();

            tracks.push({
                title,
                artist
            });
        });

        await browser.close();
        console.log('Operation complete!');
        res.json(tracks);
    })();
});

async function checkPlaylistScrollForNewSongs(page) {
    await page.focus('body');
    await page.mouse.click(942, 120, {
        delay: random.int(50, 250)
    });

    let lastCount = -1, currentCount = 0;
    while (lastCount !== currentCount) {
        await scrollPageToBottom(page);
        await page.waitFor(8000);

        if (lastCount === -1) {
            lastCount = await (page.$$('.tracklist-name')).length;
        } else {
            lastCount = currentCount;
            currentCount = await (page.$$('.tracklist-name')).length;
        }
    }
}

async function scrollPageToBottom(page) {
    for (let i = 1; i < random.int(10, 20); i++) {
        await page.keyboard.press('PageDown');
        await page.keyboard.press('ArrowDown');
        await page.waitFor(random.int(1, 10) * random.int(100, 500));
    }
}

app.listen(port, () => console.log(`App listening on port ${port}!`));
