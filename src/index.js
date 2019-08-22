const getChrome = require("./getChrome");
const puppeteer = require("puppeteer-core");

exports.handler = async (event, context, callback) => {
    
    // For keeping the browser launch
    context.callbackWaitsForEmptyEventLoop = false;
    
    const chrome = await getChrome();

    const browser = await puppeteer.connect({
       browserWSEndpoint: chrome.endpoint
    });

    const headers = {
        "User-Agent" : "prerendercloud"
    };

    var encodedTargetUrl = "https://www.google.co.uk";

    if(typeof event.queryStringParameters !== "undefined"){
        encodedTargetUrl = encodeURI(event.queryStringParameters.url)
    }

    const page = await browser.newPage();
    const response = await page.goto(encodedTargetUrl, {
        waitUntil: ["domcontentloaded", "networkidle0"]

    });

    try {
        callback(null, {
            statusCode: await response.status(),
            headers,
            body: await response.text()
        });
    
        browser.close();

    }catch(e){
        callback(e); 
    }

};
