const cheerio = require("cheerio");
const axios = require("axios");

let timestamp = new Date();
let date = timestamp.getDate() + ("0" + (timestamp.getMonth() + 1)).slice(-2) + timestamp.getFullYear();
//const siteUrl = "https://www.terviseamet.ee/et/uudised/Covid-19-andmed-27032020";
let url = "https://www.terviseamet.ee/et/uudised/Covid-19-andmed-" + date;

let title = "";
let texts = "";
let content = "";

const fetchData = async () => {

    try {
        let result = await axios.get(url);
        return cheerio.load(result.data);
    } catch (err) {
        try{
            date = (timestamp.getDate()-1) + ("0" + (timestamp.getMonth() + 1)).slice(-2) + timestamp.getFullYear();
            url = "https://www.terviseamet.ee/et/uudised/Covid-19-andmed-" + date;
            result = await axios.get(url);
            return cheerio.load(result.data);
        } catch (err){
            throw (err);
        }
    }

};

exports.handler = async () => {
    
    var $ = '';
    try{
        $ = await fetchData();
    } catch (err){
        console.log(err);
        return
    }
    
    title = $('.content > .title').text();
    texts = $('.field-item p').text();
    content = texts.substr(0, texts.indexOf("Nendest:")).trim();

    
    return {
        date,
        title,
        content,
        url,
    };
};

exports.handler();
