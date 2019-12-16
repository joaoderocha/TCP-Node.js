const Net = require('net');
const port = 8080;
const EventEmitter = require('events');
const db = require('./db');

const acptedOptions = {
  cc(data){
      db.createAcc(data["conta"]);
  },
  dp(data){
      db.createTran(data["conta"],data["valor"],data["descricao"]);
  },
  sq(data){
      db.createTran(data["conta"],data["valor"],data["descricao"]);
  },
  bc(data){
      db.updateAcc(data["conta"]);
  },
};



const handler = socket => {

    socket.on('end', () => {
        console.log("Desconectou");
    });

    socket.on('data', function (data) {
        let jsonData = JSON.parse(data);
        let op = acptedOptions[jsonData["op"]];
        if (op){
            op(jsonData);
        } else if (op === -1){
            socket.on('end', function () {
                console.log("Desligado");
            })
        }
    });

    socket.on('end', function () {
        db.exp();
    })
};

const server = Net.createServer(handler);
server.listen(port);














/*
const http = require('http');
const fs = require('fs');
const db = require('./db.js');


const acceptedUrls = {
    home(request, response) {
        if (request.method === 'GET') {
            response.writeHead(200, {'Content-Type': 'text/html'});
            fs.createReadStream(__dirname + "/html/home.html").pipe(response);
        } else if (request.method === 'POST') {
            var body = '';
            console.log(request);
            request.on('data', function (data) {
                //db.createAcc()
            });
        }
    },
    createAccount(request, response) {
        if (request.method === 'GET') {
            response.writeHead(200, {'Content-Type': 'text/html'});
            fs.createReadStream(__dirname + "/html/createAccount.html").pipe(response);
        } else if (request.method === 'POST') {

        }
    },
    user(request, response) {
        if (request.method === 'GET') {
            response.writeHead(200, {'Content-Type': 'text/html'});
            fs.createReadStream(__dirname + "/html/user.html").pipe(response);
        }
    }
};


var server = http.createServer(function (request, response) {
    var url = request.url.replace('/','').split('?')[0];
    const page = acceptedUrls[url];
    if (page){
        page(request,response);
    }
});

server.listen(8080);*/
