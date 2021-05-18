const puppeteer = require('puppeteer')

const maxAttempts = 5
const waitOptions = {waitUntil: 'networkidle0', timeout: 90000}
const url = 'https://www.marketwatch.com/'

const run = async () => {
    let attempts = 0;

    let browser
    while (attempts < maxAttempts) {
        try {
            browser = await puppeteer.launch({headless: true})
            const page = await browser.newPage()
            await page.goto(url, waitOptions)

            const marketPerformance = await page.evaluate(() => document.querySelector('.markets__group').innerText);
            const eachCol = marketPerformance.split('\t').filter(it => it.trim())
            let email = `<html>
                                <head>
                                    <style>
                                    td {
                                        padding: 0 10px;
                                    }
                                    </style>   
                                </head>
                                <body>
                                    <table>`

            eachCol.forEach((it, idx) => {
                const mod = idx % 4
                if (mod === 0) {
                    email += `\n<tr><td>${it.trim()}</td>`
                } else if (mod === 1) {
                    email += `<td>${it.trim()}</td>`
                } else if (mod === 2) {
                    const color = it.startsWith('-') ? 'red' : 'green'
                    email += `<td style="color: ${color}">${it.trim()}</td>`
                } else if (mod === 3) {
                    const color = it.startsWith('-') ? 'red' : 'green'
                    email += `<td style="color: ${color}">${it.trim()}</td></tr>\n`
                }
            })

            email += '</table></body></html>'

            console.log(`${email}`)

            process.exit(0)
        } catch (e) {
            if (++attempts === maxAttempts) {
                throw e
            } else {
                console.error(`Attempt ${attempts} failed.`, e)
            }
        } finally {
            await browser.close()
        }
    }
}

const args = process.argv
if (args.length !== 2) {
    throw "Usage: node index.js"
}

try {
    run()
} catch (e) {
    throw e
}
