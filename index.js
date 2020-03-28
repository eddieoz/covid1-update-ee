const cheerio = require("cheerio");
const axios = require("axios");

let d = new Date();
let today = d.getDate() + ("0" + (d.getMonth() + 1)).slice(-2) + d.getFullYear();
let siteUrl = "https://www.terviseamet.ee/et/uudised/Covid-19-andmed-" + today;

let title = "";
let texts = "";
let parsedTexts = "";

const fetchData = async () => {

    try {
        let result = await axios.get(siteUrl);
        return cheerio.load(result.data);
    } catch (err) {
        try{
            today = (d.getDate()-1) + ("0" + (d.getMonth() + 1)).slice(-2) + d.getFullYear();
            siteUrl = "https://www.terviseamet.ee/et/uudised/Covid-19-andmed-" + today;
            result = await axios.get(siteUrl);
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
    parsedTexts = texts.substr(0, texts.indexOf("Nendest:")).trim();

    
    return {
        title,
        parsedTexts,
    };
};
