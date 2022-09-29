var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var jwt = require('jsonwebtoken');
var pug = require('pug');
var compression = require('compression');

const spreadsheetsModels = require('./src/spreadsheets/spreadsheets.models');

require('dotenv').config();

var app = express();

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cookieParser());
app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use('/public', express.static('./public'));

console.log(process.env.PORT);
var port = process.env.PORT || 8080;

app.get('/:linkrutgon', async(req, res) => {
    let spreadsheetId = "1CmpEujfmtoF19ePYBikrdcKcJKurqsnxJ1VpXJz-Cso";
    let dataSheets = await spreadsheetsModels.getSpreadsheet(spreadsheetId, "'Rút gọn link'!A:B");
    for (value in dataSheets) {
        let url = 'https://link.banhoctap.dev/' + req.params.linkrutgon;
        console.log(url);
        console.log(dataSheets[value].at(1));
        if(dataSheets[value].at(1) == url) 
            return res.redirect(dataSheets[value].at(0));
    }
    return res.redirect('/');
});

app.get('/', (req, res) => {
    return res.redirect('https://banhoctap.dev');
});

app.use((req, res, next) => {
    let html = pug.renderFile('public/404.pug', {
        message: 'OOps! Page not found',
        href: 'Quay về trang chủ',
        redirect: '/'
    });
	res.send(html);
});

//set public folder as static folder for static files
app.use(express.static('/public'));

app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
