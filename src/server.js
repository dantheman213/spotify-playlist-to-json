'use strict';

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
        await page.screenshot({path: '/tmp/example.png'});

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

async function scrollPageToBottom(page, scrollStep = 250, scrollDelay = 100) {
    const lastPosition = await page.evaluate(
        async (step, delay) => {
            const getScrollHeight = (element) => {
                const { scrollHeight, offsetHeight, clientHeight } = element;
                return Math.max(scrollHeight, offsetHeight, clientHeight)
            };

            const position = await new Promise((resolve) => {
                let count = 0;
                const intervalId = setInterval(() => {
                    const { body } = document;
                    const availableScrollHeight = getScrollHeight(body);

                    window.scrollBy(0, step);
                    count += step;

                    if (count >= availableScrollHeight) {
                        clearInterval(intervalId);
                        resolve(count)
                    }
                }, delay)
            });

            return position
        },
        scrollStep,
        scrollDelay,
    );
    return lastPosition
}

app.listen(port, () => console.log(`App listening on port ${port}!`));
