const cheerio = require('cheerio');
const random = require('random');
const puppeteer = require('puppeteer');

const maxPageCount = 10;

class SpotifyScraper {
    #cacheAlbumArt = new Map();
    #browser = null;
    pageCount = 1;

    async getPlaylist(id) {
        const startTime = new Date();
        console.log(`Task started at ${startTime.toLocaleString()}`);
        console.log('Starting headless browser...');
        this.#browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});

        this.#browser.on('targetcreated', () => {
            this.pageCount += 1;
        });
        this.#browser.on('targetdestroyed', () => {
            this.pageCount -= 1;
        });

        const page = await this.#browser.newPage();
        await page.setCacheEnabled(false);
        await page.setViewport({
            width: random.int(1200, 1920),
            height: random.int(800, 1080)
        });

        const spotifyUrl = 'https://open.spotify.com/playlist/' + id;
        console.log('Navigating to ' + spotifyUrl);
        await page.goto(spotifyUrl);

        console.log('Navigating to bottom of page until scrolling stops to collect all songs for playlist; this will take awhile...');
        await this.checkPlaylistScrollForNewSongs(page);

        // TODO: make this a debugging enabled option
        // await page.screenshot({
        //     path: '/var/log/jobs/jobs_' + (new Date().getTime()) + '.png',
        //     fullPage: true
        // });

        const trackRows = await (page.$$('.tracklist-name'));
        console.log('Found ' + trackRows.length + ' tracks!');
        console.log(`Retrieving metadata took ${(new Date() - startTime) / 1000} seconds.`);

        const html = await page.evaluate(() => document.documentElement.outerHTML);
        const $ = cheerio.load(html);

        const coverArt = $('.cover-art-image')
            .first()
            .css('background-image')
            .replace('url(','')
            .replace(')','')
            .replace(/"/gi, "");

        const playlist = {
            name: $('.mo-info-name').first().text() || null,
            url: spotifyUrl,
            coverArt,
            tracks: []
        };

        const promises = [];
        const rows = $('.tracklist-row');
        for (const row of rows) {
            while (this.pageCount > maxPageCount) {
                console.log(`waiting for ${Math.abs(this.pageCount - maxPageCount)} other page(s) to finish before continuing`);
                await SpotifyScraper.sleep(random.int(100, 400));
            }

            promises.push(new Promise(async (resolve) => {
                const artists = [];
                $(row).find($('.tracklist-row__artist-name-link')).each((i, elem) => {
                    artists.push({
                        name: $(elem).text() || null,
                        url: 'https://open.spotify.com' + $(elem).attr('href') || null
                    });
                });

                try {
                    const albumElem = $(row).find($('.tracklist-row__album-name-link'));
                    const albumUrl = 'https://open.spotify.com' + albumElem.attr('href') || null;
                    playlist.tracks.push({
                        artists,
                        album: {
                            name: albumElem.first().text() || null,
                            url: albumUrl,
                            coverArt: await this.getAlbumCoverArt(albumUrl)
                        },
                        song: {
                            title: $(row).find($('.tracklist-name')).first().text() || null,
                            duration: $(row).find($('.tracklist-duration')).first().text() || null
                        }
                    });
                } catch (e) {
                    console.log(`ERROR: Grabbing data from single row...` + e.toString());
                }

                resolve();
            }));

            await SpotifyScraper.sleep(random.int(50, 150));
        }

        await Promise.all(promises);
        await page.close();
        await this.#browser.close();

        const endTime = new Date();
        console.log(`Task finished at ${endTime.toLocaleString()} and took ${(endTime - startTime) / 1000} seconds.`);

        return playlist;
    }

    async getAlbumCoverArt(albumUrl) {
        if (this.#cacheAlbumArt.has(albumUrl)) {
            const cachedItem = this.#cacheAlbumArt.get(albumUrl);
            console.log(`Grabbed covertArt from cache: ${cachedItem}`);

            return cachedItem;
        }

        let coverArt = null;
        const page = await this.#browser.newPage();
        await page.setCacheEnabled(false);
        await page.setViewport({
            width: random.int(1200, 1920),
            height: random.int(800, 1080)
        });

        try {
            await page.goto(albumUrl, {
                waitUntil: 'networkidle2'
            });

            const html = await page.evaluate(() => document.documentElement.outerHTML);
            const $ = cheerio.load(html);

            coverArt = $('.cover-art-image')
                .first()
                .css('background-image')
                .replace('url(','')
                .replace(')','')
                .replace(/"/gi, "");
            this.#cacheAlbumArt.set(albumUrl, coverArt);
            console.log(`Grabbed covertArt from web: ${coverArt}`);

            page.close();
        } catch (e) {
            console.log(e.toString());
        }

        return coverArt;
    }

    async checkPlaylistScrollForNewSongs(page) {
        await page.focus('body');
        // click just above the album art area in y-position and anywhere along the middle of the x position
        // in line where they would meet
        await page.mouse.click(random.int(242, 1200), random.int(65, 85), {
            delay: random.int(50, 250)
        });

        let lastCount = -1, currentCount = 0;
        while (lastCount !== currentCount) {
            await this.scrollPageToBottom(page);
            await page.waitFor(random.int(500, 2000));

            if (lastCount === -1) {
                lastCount = await (page.$$('.tracklist-name')).length;
            } else {
                lastCount = currentCount;
                currentCount = await (page.$$('.tracklist-name')).length;
            }
        }
    }

    async scrollPageToBottom(page) {
        for (let i = 1; i < random.int(5, 15); i++) {
            for(let j = 0; j < random.int(20, 100); j++) {
                await page.keyboard.press('PageDown');
                await page.keyboard.press('ArrowDown');
            }
            await page.waitFor(random.int(1, 5) * random.int(100, 150));
        }
    }

    init() {
        // https://github.com/cheeriojs/cheerio/issues/1191
        cheerio.prototype[Symbol.iterator] = function* () {
            for (let i = 0; i < this.length; i += 1) {
                yield this[i];
            }
        };
    }

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = SpotifyScraper;
