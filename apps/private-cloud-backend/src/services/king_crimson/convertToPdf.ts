import path from 'path';

/**
 * Converts raw HTML content to a PDF using Puppeteer.
 */
const convertHtmlToPdf = async (htmlContent: string, pdfPath: string): Promise<void> => {
    const absolutePdf = path.resolve(pdfPath);

    // Use dynamic import because puppeteer is an ESM-only module
    const puppeteer = await import('puppeteer');

    // Launch headless Chromium browser
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
        const page = await browser.newPage();

        // Set content and wait for network/styles to load
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0' as unknown as 'load',
        });

        // Emulate print media type so that print-specific CSS and @page rules are active
        await page.emulateMediaType('print');

        // Print page to PDF with Letter page size
        await page.pdf({
            path: absolutePdf,
            format: 'Letter',
            printBackground: true,
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
        });
    } finally {
        await browser.close();
    }
};

export default convertHtmlToPdf;
