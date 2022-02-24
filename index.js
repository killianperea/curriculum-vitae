import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export class ExportHtmlToPDF {

    constructor() {
        this._generatePdf();
    }

    _getTemplateHtml() {
        console.log("Loading template file in memory")
        try {
            const invoicePath = resolve("cv/index.html");
            return readFileSync(invoicePath, { encoding: 'utf8' });
        } catch (err) {
            return new Error("Could not load html template");
        }
    }

    async _generatePdf() {
        const cv = this._getTemplateHtml();

        const browser = await puppeteer.launch({
            headless: true
        });

        const page = await browser.newPage();

        await page.setContent(cv, { waitUntil: 'domcontentloaded' });

        // Add Fonts
        await page.addStyleTag({
           url: 'https://fonts.googleapis.com/css?family=Heebo'
        });

        // Add CSS
        await page.addStyleTag({
            path: 'cv/css/index.css'
        });

        await page.addStyleTag({
            path: 'cv/css/left-side.css',
        });

        await page.addStyleTag({
            path: 'cv/css/right-side.css',
        });

        await page.evaluateHandle('document.fonts.ready');

        // We use pdf function to generate the pdf in the same folder as this file.
        await page.pdf({
            path: 'Curriculum_Vitae_Killian_Perea_Ruiz.pdf',
            format: 'A4',
            printBackground: true,
            margin: {
                left: '0px',
                top: '0px',
                right: '0px',
                bottom: '0px'
            }
        });

        await browser.close();

        console.log("PDF Generated");
    }
}


new ExportHtmlToPDF();