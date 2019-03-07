const xlsx = require('xlsx');
const axios = require('axios');
const cheerio = require('cheerio');
const add_to_sheet = require('./add_to_sheet');

const workbook = xlsx.readFile('./xlsx/twitter.xlsx');
const ws = workbook.Sheets.twitter;
const records = xlsx.utils.sheet_to_json(ws);

const twitter = 'https://twitter.com/';

const crawler = async () => {
    add_to_sheet(ws, 'C1', 's', "팔로잉");
    add_to_sheet(ws, 'D1', 's', "팔로워");
    for (const [i, r] of records.entries()) {
        const res = await axios.get(twitter + r.계정);
        if (res.status === 200) {
            const html = res.data;
            const $ = cheerio.load(html);
            const following = $('.ProfileNav-item--following > a > span.ProfileNav-value').text();
            const followers = $('.ProfileNav-item--followers > a > span.ProfileNav-value').text();


            const newFollowing = 'C' + (i + 2);
            const newFollowers = 'D' + (i + 2);

            await add_to_sheet(ws, newFollowing, 'n', following);
            await add_to_sheet(ws, newFollowers, 'n', followers);

            console.log("working : ",records.length+"/"+(i+1));
        }
    };
    xlsx.writeFile(workbook, 'xlsx/result.xlsx')
}

module.exports = crawler;