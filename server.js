const express = require("express");
const bodyParser = require('body-parser');
const fs = require('fs');
const md5 = require('md5');

const app = express();
const jsonParser = bodyParser.json();

app.use(express.static(__dirname + '/client'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client/index.html");
});

app.post("/save", jsonParser, (req, res) => {
    const data = req.body;
    const { markup } = data;
    const hash = md5(markup);
    const fileName = `document_${hash}.html`;

    fs.writeFileSync(`storage/${fileName}`, markup);
    res.send({ id: hash });
});

app.get('/download', (req, res) => {
    const { id } = req.query;
    const pathToFile = `${__dirname}/storage/document_${id}.html`;

    res.download(pathToFile);
})

app.listen(3000, () => {
    console.log("Application started and Listening on port 3000");
});
