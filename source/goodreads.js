const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Array untuk menyimpan data kutipan
let quotes = [];

// Fungsi untuk mendapatkan data dari halaman web
async function scrapeData(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Mendapatkan semua kutipan yang ada di halaman web
    $('.quoteText').each((i, el) => {
      const regex = /,|“|”|-|―|\r|\n/g
      const author = $(el).find('span').eq(0).text().trim().replace(regex, '');
      $(el).children().remove()
      const text = $(el).text().trim().replace(regex, '').trim()
      quotes.push({
        author,
        text
      });
    });

    // Menyimpan hasil scrape ke dalam file CSV
    const domain = url.match(/\/\/(.*?)\//)[1];
    const csvWriter = createCsvWriter({
      path: `./results/${domain}.csv`,
      header: [{
          id: 'author',
          title: 'Author'
        },
        {
          id: 'text',
          title: 'Text'
        }
      ],
    });
    await csvWriter.writeRecords(quotes);
    console.log(`Data dari ${domain} berhasil disimpan ke dalam file CSV.`);
  } catch (error) {
    console.error(error);
  }
}

// List URL situs web yang akan discrape
const urls = [
  'https://www.goodreads.com/quotes',
];

// Loop untuk menjalankan fungsi scrapeData untuk setiap URL
for (const url of urls) {
  scrapeData(url);
}