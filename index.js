const fs   = require('fs');
const http = require('http');
const url  = require('url');
const replaceTemplate = require('./modules/replaceTemplate.js');

/////////////////////////////////////
// Files


// Blocking, Synchonis way
let   textIn        = ``;
const encoding      = `utf-8`;
const inNamePath    = `./txt/input.txt`;
const outNamePath   = `./txt/output.txt`;
const startNamePath = `./txt/start.txt`;


// textIn = fs.readFileSync(inNamePath, encoding);
// console.log (textIn);

// const textOut = `This is what we know about avacado: ${textIn}\ncreated ${Date.now()}`;
// console.log (textOut);
// fs.writeFileSync(outNamePath, textOut);
// console.log ('File Written');


// Non-Blocking, Asyncronis way
// fs.readFile(startNamePath, encoding, (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, encoding, (err, data2) => {
//         console.log(data2);
//         fs.readFile(`./txt/append.txt`, encoding, (err, data3) => {
//             console.log (data3);
//             fs.writeFile(`./txt/final.txt`, `${data2}\n${data3}`, encoding, err => {
//                 console.log ('Your file has been writeen');
//             })
//         });
//     });
// });

///////////////////////////////////////////
// Server


const tempOverview  = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard  = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const tempProduct  = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const data    = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer( (req,res) => {
    const { query, pathname } = url.parse(req.url, true);
    
    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html'} );

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard,el)).join('');
        const output = tempOverview.replace(`{%PRODUCT_CARDS%}`, cardsHtml);
        res.end(output);

    // Product page
    } else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html'} );
        const product = dataObj[query.id];
        const output  = replaceTemplate(tempProduct,product);
        res.end(output);

    // API
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json'} );
        res.end(data);

    // Not Found
    } else {
        res.writeHead(404,{
            'Content-type': 'text/html',
            'my-own-header': 'Hello World'
        });
        res.end("<h1>Page not found</h1>");
    }
    
});

server.listen(8000, '127.0.0.1', () => {
    console.log ("Listening to requests on port 8000");
});   // listen on localHost
