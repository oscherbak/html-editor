const express = require("express");
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const jsonParser = bodyParser.json();

app.use(express.static(__dirname + '/client'));
app.use("/storage", express.static(__dirname + "/storage"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client/index.html");
});

app.get("/documents", (req, res) => {
    var files = fs.readdirSync('storage').filter(fn => fn.endsWith('.html')) || [];

    res.status(200).send({
        files: files.map((fileName) => fileName.replace('.html', ''))
    });
})

app.post("/save", jsonParser, (req, res) => {
    const data = req.body;
    const { markup, fileName } = data;

    if (fileName) {
        fs.writeFileSync(`storage/${fileName}.html`, markup);
        res.send('ok');
    } else {
        res.status(400).send({
            message: 'provide fileName'
        });
    }
});

// app.get('/download', (req, res) => {
//     const pathToFile = `${__dirname}/storage/document.html`;
//
//     res.download(pathToFile);
// })

app.listen(3000, () => {
    console.log("Application started and Listening on port 3000");
});
