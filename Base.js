const { re } = require('prettier');
const puppeteer = require('puppeteer')
const Downloader = require('./Downloader');


const xlsx = require("xlsx");



describe('My First Automation using Puppetee', 
()=> {
    it('will launch the Chrome Browser', 
    async function()
    {
       
        const Browser = await puppeteer.launch({
            headless: false,
             slowMo: 250,
              devtools: false,
              args: ['--start-maximized']}) //devtool opens html of page, slowMo slows down page opening


        const page = await Browser.newPage()
        console.log('1st I will open google and browse "Germany" and save the 5th Image');
       
        await page.goto('https://www.google.de/' , {waitUntil: 'networkidle2', timeout: 0}) // opening google
        await page.setViewport({ width: 1450, height: 768});
        await autoScroll(page);
        
        await page.waitForSelector('#L2AGLb > div'),{waitUntil: 'networkidle2', timeout: 0};
        await page.click('#L2AGLb > div');
        await delay(1000); //calling delay method
        
        await page.waitForSelector('input[name=q]');

        // await page.type('input[name=search]', 'Adenosine triphosphate');
        await page.$eval('input[name=q]', el => el.value = 'Germany');

       
        const googlesearchBtn = await page.$x('/html/body/div[1]/div[3]/form/div[1]/div[1]/div[3]/center/input[1]')
        await googlesearchBtn[0].click() 
        await delay(4000); //calling delay method
       
        const imageBtn = await page.$x('//*[@id="hdtb-msb"]/div[1]/div/div[4]/a')
        await imageBtn[0].click() 
        await delay(2000); //calling delay method')
        
        const fifthImage = await page.$x('//*[@id="islrg"]/div[1]/div[5]/a[1]/div[1]/img')
        await fifthImage[0].click() 
        await delay(2000); //calling delay method')
       
       
        const IMAGE_SELECTOR = '#Sva75c > div > div > div.pxAole > div.tvh9oe.BIB1wf > c-wiz > div > div.OUZ5W > div.zjoqD > div.qdnLaf.isv-id > div > a > img';
        const imageHref = await page.evaluate((sel) => {
            return document.querySelector(sel).getAttribute(('src').replace('/'), '');
        },IMAGE_SELECTOR);

        Downloader.download(imageHref,function(filename)
        {
            console.log("Downloading completed for " + filename);

        });
    
       await Browser.close();
       await delay(2000);
       console.log('Now I will open google and copy details of News');
  
       await newsData();
       
       

       

       



      



        


    });
   
});
function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }
 async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}


async function newsData()
    {
        
        const Browser = await puppeteer.launch({
            headless: false,
             slowMo: 250,
              devtools: false,
              args: ['--start-maximized']}) 
    
    
       
       const page = await Browser.newPage()
    
       await page.goto('https://www.google.de/' , {waitUntil: 'networkidle2', timeout: 0}) // opening google
        await page.setViewport({ width: 1450, height: 768});
        await autoScroll(page);
       
        await page.waitForSelector('#L2AGLb > div'),{waitUntil: 'networkidle2', timeout: 0};
        await page.click('#L2AGLb > div');
        await delay(1000); //calling delay method
        
        await page.waitForSelector('input[name=q]');
    
        
        await page.$eval('input[name=q]', el => el.value = 'Germany News');
        const googlesearchBtn = await page.$x('/html/body/div[1]/div[3]/form/div[1]/div[1]/div[3]/center/input[1]')
        await googlesearchBtn[0].click() 
        await delay(4000); //calling delay method
       
        
    
        
        const newsBtn = await page.$x('//*[@id="rso"]/div[1]/div/div[1]/div/div/div[1]/div/a/h3')
        await newsBtn[0].click() 
        await delay(4000); //calling delay method
    
    
        var fifthNews = '#bodyContent > div.col2.left > div:nth-child(4) > div > a > div.teaserImg > img';
        await page.focus(fifthNews);
        await delay(2000); //calling delay method
    
        const fifthNewsImg = await page.$x('//*[@id="bodyContent"]/div[3]/div[6]/div/a/div[1]/img')
        await fifthNewsImg[0].click() 
        await delay(3000); 
      
        
        
       
        const title = await page.$eval('.col3 h1', h1=>h1.textContent);
        
        let result = await page.$$eval('.smallList', names => names.map(name => name.innerText));
        //console.log(result);
    
        const arrayofList = result.toString();
    
        const date = arrayofList.substring(0,15);
    
        const authorName = arrayofList.substring(arrayofList.search("Author"),arrayofList.search("Keywords"));
        //console.log("Title " + title);
       // console.log(date);
       // console.log(authorName);
    
        const scrappingData = [];
        const data = [title,date,authorName];
        scrappingData.push(data);
        console.log(scrappingData);
    
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.aoa_to_sheet(scrappingData);
        xlsx.utils.book_append_sheet(wb,ws);
        xlsx.writeFile(wb,"FifthNewsData.xlsx");
    
        await Browser.close();
    
      
      
    
}


