# Website Crawler & Clone
This Node.js script automates the process of crawling and cloning websites for offline viewing or backup purposes. It recursively visits all accessible links within a specified depth from the starting URL, saving the complete structure of the website locally. This tool is particularly useful for archiving, testing, and educational purposes.

## Features
- Deep Crawling: Recursively crawls a website up to a specified depth.
- Selective Saving: Ignores images and non-HTML resources to focus on the webpage structure.
- Concurrency Control: Manages multiple asynchronous requests efficiently to speed up the crawling process.
- Error Handling: Gracefully handles and logs errors encountered during the crawl and clone process.
- Customizable Output: Saves the website's structure in a user-defined directory with options for naming and organizing saved files.

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
- Node.js (version 12 or newer)
- npm (Node Package Manager)

## This script uses several third-party packages:
- website-scraper: For downloading websites.
- axios: For making HTTP requests.
- moment: For date and time formatting.
- cheerio: For parsing and manipulating HTML.
- fs-extra: For filesystem operations with extra functions.
- url: For URL resolution and parsing.
- colors: For colored output in the console.

# Installation
- Clone this repository or download the script to your local machine.
```bash
git clone https://github.com/cdw1p/website-crawler-app.git
```
- Navigate to the script's directory and run npm install to install the required dependencies.
```bash
cd website-crawler-app
npm install
```

## Usage
To start crawling and cloning a website, run the script with the following command:
```bash
node script.js [startUrl] [projectNamespace]
```
- [startUrl]: The URL of the website you wish to clone. This is a required argument.
- [projectNamespace]: An optional argument to specify a namespace for the project. If omitted, the hostname of the startUrl will be used.

## Configuration
The script's behavior can be customized by modifying the following configurations in the code:
- maxDepth: Controls the depth of the crawl. The default value is 3.
- outputDirectory: Specifies the directory where the website will be cloned. By default, it uses output/[projectNamespace].
- urlFilter: Determines which URLs should be included in the clone. By default, it matches URLs that include the startUrl.

# Contributing
Contributions to improve the script are welcome. Please feel free to fork the repository, make your changes, and submit a pull request.

# License
This script is released under the MIT License. See the LICENSE file for more details.