/*!
 * Piwik - free/libre analytics platform
 *
 * Opt-out form tests
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

// NOTE: this test actually tests safari-specific opt out form behavior, since phantomjs' user-agent string
//       is similar to Safari's
describe("OptOutForm", function () {
    const siteUrl = "/tests/resources/overlay-test-site-real/index.html",
        safariUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A",
        chromeUserAgent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36";

    it("should display correctly when embedded in another site", async function () {
        page.setUserAgent(chromeUserAgent);
        await page.goto(siteUrl);

        const element = await page.jQuery('iframe#optOutIframe');
        expect(await element.screenshot()).to.matchImage('loaded');
    });

    it("should reload the iframe when clicking the opt out checkbox and display an empty checkbox", async function () {
        await page.evaluate(function () {
            $('iframe#optOutIframe').contents().find('input#trackVisits').click();
        });
        await page.waitForNetworkIdle(); // TODO: will this work for iframes?

        const element = await page.jQuery('iframe#optOutIframe');
        expect(await element.screenshot()).to.matchImage('opted-out');
    });

    it("should correctly show the checkbox unchecked after reloading after opting-out", async function () {
        page.setUserAgent(chromeUserAgent);
        await page.goto(siteUrl);

        const element = await page.jQuery('iframe#optOutIframe');
        expect(await element.screenshot()).to.matchImage('opted-out-reload');
    });

    it("should correctly show display opted-in form when cookies are cleared", async function () {
        await page.clearCookies();

        page.setUserAgent(safariUserAgent);
        await page.goto(siteUrl);

        const element = await page.jQuery('iframe#optOutIframe');
        expect(await element.screenshot()).to.matchImage('safari-loaded');
    });

    it("should correctly set opt-out cookie on safari", async function () {
        await page.evaluate(function () {
            $('iframe#optOutIframe').contents().find('input#trackVisits').click();
        });
        await page.waitForNetworkIdle();
        await page.goto(siteUrl); // reload to check that cookie was set

        const element = await page.jQuery('iframe#optOutIframe');
        expect(await element.screenshot()).to.matchImage('safari-opted-out');
    });
});