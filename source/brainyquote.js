const axios = require('axios')
const cheerio = require('cheerio')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

// URL dari situs yang akan di-scrape
const urls = []
for (let i = 1; i <= 8; i++) {
    urls.push('https://www.brainyquote.com/topics/inspirational-quotes' + (i > 1 ? '_' + 1 : ''))
}

const config = {
    path: 'results/brainyquote.csv',
    header: [{
            id: 'author',
            title: 'author'
        },
        {
            id: 'text',
            title: 'text'
        },
    ],
    append: false
}
// Menyimpan hasil ke dalam file CSV
const csvWriter = createCsvWriter(config)

csvWriter.writeRecords([])
urls.map(url =>
    // Mengirim permintaan GET ke URL
    axios.get(url)
    .then(response => {
        // Membuat objek Cheerio dari respon HTML
        const $ = cheerio.load(response.data)

        // Mencari tag <div> dengan kelas "qll-bg"
        const divs = $('#quotesList .grid-item')

        // Mengambil teks dari setiap tag <div> yang ditemukan
        const quotes = divs.map((i, div) => {
            const author = $(div).find('.bq-aut').text().trim()
            const text = $(div).find('.b-qt').text().trim()
            if (!author || !text) return null
            return {
                author,
                text
            }
        }).get()

        const csvWriter = createCsvWriter({
            ...config,

            append: true
        })
        csvWriter.writeRecords(quotes)
            .then(() => console.log('Data berhasil disimpan ke dalam file CSV'))
            .catch(error => console.log('Gagal menyimpan data ke dalam file CSV. Error:', error.message));
    })
    .catch(error => {
        console.log('Gagal melakukan scraping. Error:', error.message)
    }))