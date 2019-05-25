'use strict';

const random = require('random');
const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    (async () => {
        const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        const page = await browser.newPage();
        await page.setViewport({
            width: 1200,
            height: 800
        });
        await page.goto('https://open.spotify.com/playlist/2wSNKxLM217jpZnkAgYZPH');
        await checkPlaylistScrollForNewSongs(page);
        await page.screenshot({
            path: '/var/log/jobs/jobs_' + new Date().getTime() + '.png',
            fullPage: true
        });

        const tracks = [];
        const trackElems = await (page.$$('.tracklist-name'));
        for (const elem of trackElems) {
            const track = await page.evaluate(el => el.innerHTML, elem);
            tracks.push(track);
        }
        await browser.close();
        console.log('Found ' + tracks.length + ' tracks!');
        console.log(JSON.stringify(tracks));
    })();

    res.json({status: 'ok. scheduled.'});
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
