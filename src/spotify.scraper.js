const cheerio = require('cheerio');
const random = require('random');
const puppeteer = require('puppeteer');

class SpotifyScraper {
    static async getPlaylist(id) {
        const startTime = new Date();
        console.log(`Task started at ${startTime.toLocaleString()}`);
        console.log('Starting headless browser...');
        const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        const page = await browser.newPage();
        await page.setCacheEnabled(false);
        await page.setViewport({
            width: 1200,
            height: 800
        });

        const spotifyUrl = 'https://open.spotify.com/playlist/' + id;
        console.log('Navigating to ' + spotifyUrl);
        await page.goto(spotifyUrl);

        console.log('Navigating to bottom of page until scrolling stops to collect all songs for playlist; this will take awhile...');
        await SpotifyScraper.checkPlaylistScrollForNewSongs(page);
        await page.screenshot({
            path: '/var/log/jobs/jobs_' + (new Date().getTime()) + '.png',
            fullPage: true
        });

        const trackRows = await (page.$$('.tracklist-name'));
        console.log('Found ' + trackRows.length + ' tracks!');

        const html = await page.evaluate(() => document.documentElement.outerHTML);
        const $ = cheerio.load(html);

        const tracks = [];

        $('.tracklist-row').each((i, elem) => {
            const title = $(elem).find($('.tracklist-name')).first().text() || null;
            const album = $(elem).find($('.tracklist-row__album-name-link')).first().text() || null;

            const artists = [];
            const artistElems = $(elem).find($('.tracklist-row__artist-name-link'));
            if (artistElems != null && artistElems.length > 0) {
                $(artistElems).each((i, elem) => {
                    artists.push($(elem).text());
                });
            }

            tracks.push({
                title,
                artists,
                album
            });
        });

        await page.close();
        await browser.close();

        const endTime = new Date();
        console.log(`Task finished at ${endTime.toLocaleString()} and took ${(endTime - startTime) / 1000} seconds.`);

        return tracks;
    }

    static async checkPlaylistScrollForNewSongs(page) {
        await page.focus('body');
        await page.mouse.click(242, 92, {
            delay: random.int(50, 250)
        });

        let lastCount = -1, currentCount = 0;
        while (lastCount !== currentCount) {
            await SpotifyScraper.scrollPageToBottom(page);
            await page.waitFor(1000);

            if (lastCount === -1) {
                lastCount = await (page.$$('.tracklist-name')).length;
            } else {
                lastCount = currentCount;
                currentCount = await (page.$$('.tracklist-name')).length;
            }
        }
    }

    static async scrollPageToBottom(page) {
        for (let i = 1; i < random.int(5, 15); i++) {
            for(let j = 0; j < random.int(20, 100); j++) {
                await page.keyboard.press('PageDown');
                await page.keyboard.press('ArrowDown');
            }
            await page.waitFor(random.int(1, 5) * random.int(100, 150));
        }
    }
}

module.exports = SpotifyScraper;
