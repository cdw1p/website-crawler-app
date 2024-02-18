const scrape = require('website-scraper')
const axios = require('axios')
const moment = require('moment')
const cheerio = require('cheerio')
const fs = require('fs-extra')
const URL = require('url').URL
const path = require('path')
require('colors')

/**
 * The namespace for the project.
 * @type {string}
 */
const startUrl = process.argv[2] || ''
const projectNamespace = process.argv[3] || (new URL(startUrl)).hostname
const visitedUrls = new Set()
const crawlPromises = []

/**
 * Represents a logger clone.
 */
class loggerClone {
  apply(registerAction) {
    registerAction('beforeStart', async ({ options }) => {
      console.log(`[${moment().format('HH:mm:ss')}] Starting Website Cloning...`.bold)
      return options
    })
    registerAction('afterFinish', async () => {
      console.log(`[${moment().format('HH:mm:ss')}] Finished Website Cloning...`.bold)
    })
    registerAction('getReference', async ({ resource }) => {
      console.log(`  - Get Reference: ${resource.url}`.cyan)
      return resource
    })
    registerAction('onResourceSaved', async ({ resource }) => {
      console.log(`[${moment().format('HH:mm:ss')}] Save Resource: ${resource.url}`.green)
      return resource
    })
    registerAction('error', async ({ error }) => {
      console.error(`[${moment().format('HH:mm:ss')}] Error: ${error.message}`.red)
    })
	}
}

/**
 * Clones a website by crawling its pages and saving them to the output directory.
 * @returns {Promise<boolean>} A promise that resolves to true if the website cloning is successful, or rejects with an error if it fails.
 */
const cloneWebsite = () => new Promise(async (resolve, reject) => {
  const outputDirectory = path.resolve(__dirname, `output/${projectNamespace}`)
  if (await fs.existsSync(outputDirectory)) {
    await fs.remove(outputDirectory)
  }
  const normalizeURL = Array.from(visitedUrls).map(url => {
    const filename = url.split('/').pop()
    const filenameExt = (filename.split('.').pop() === filename) ? 'html' : filename.split('.').pop()
    return { url, filename: (filenameExt === 'html') ? filename : `${filename}.${filenameExt}` }
  })
  const options = {
    urls: normalizeURL,
    directory: outputDirectory,
    filenameGenerator: 'bySiteStructure',
    maxDepth: 3,
    recursive: true,
    requestConcurrency: Infinity,
    maxRecursiveDepth: 3,
    prettifyUrls: true,
    ignoreErrors: true,
    urlFilter: (url) => {
      return url.match(new RegExp(startUrl, 'g'))
    },
    plugins: [ new loggerClone() ]
  }
  try {
    await scrape(options)
    resolve(true)
  } catch (error) {
    reject(error)
  }
})

/**
 * Crawls a website and retrieves all the links within a given depth.
 * @param {string} url - The URL of the website to crawl.
 * @param {number} [depth=0] - The depth of the crawl (default is 0).
 * @returns {Promise<void>} - A promise that resolves when the crawling is complete.
 */
const crawlWebsite = (url, depth = 0) => new Promise(async (resolve, reject) => {
  if (depth > 3 || visitedUrls.has(url)) {
    resolve()
    return
  }
  visitedUrls.add(url)
  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)
    const links = $('a').map((i, link) => $(link).attr('href')).get()
    links.forEach(link => {
      try {
        const absoluteLink = new URL(link, url).href.split('#')[0]
        const shouldLink = (new URL(absoluteLink)).origin === (new URL(url)).origin
        const notImages = !(absoluteLink.match(/\.(jpeg|jpg|gif|png|svg)$/))
      if (shouldLink && notImages && !(visitedUrls.has(absoluteLink))) {
          crawlPromises.push(crawlWebsite(absoluteLink, depth + 1))
        }
      } catch (error) { }
    })
    console.log(`  - Saved URL: ${url}`.yellow)
    resolve()
  } catch (error) {
    resolve()
  }
})

/**
 * Runs the website crawler app.
 * @param {string} url - The URL of the website to crawl.
 * @returns {Promise<void>} - A promise that resolves when the crawling and cloning process is complete.
 */
const run = async (url) => {
  try {
    console.log(`[${moment().format('HH:mm:ss')}] Starting Website Crawling...`.bold)
    await crawlWebsite(url)
    await Promise.all(crawlPromises)
    await cloneWebsite()
  } catch (error) {
    console.error(`Runtime Error: ${error.message}`.red)
  }
}

/**
 * Run main function
 */
run(startUrl)