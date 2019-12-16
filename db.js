const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const converter = require('json-2-csv');
const fs = require('fs');

function creatAccount(numeroConta) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var acc = {
            conta: numeroConta,
            saldo: 0,
            dataCriacao: new Date(),
            status: "Normal",
        };
        dbo.collection("Contas").insertOne(acc, function (err, res) {
            if (err) throw err;
            console.log("conta criada");
            db.close();
        })
    })
}

function createTransaction(numeroConta, valor, descricao) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var trans = {
            conta: numeroConta,
            valor: valor,
            dataCriacao: new Date(),
            descricao: descricao,
        };
        dbo.collection("Transacoes").insertOne(trans, function (err, res) {
            if (err) throw err;
            console.log("transacao efetuada");
            triggerAccUpdate(numeroConta, valor, descricao);
            db.close();
        })
    })
}

function triggerAccUpdate(numeroConta, valor, descricao) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var query = {conta: numeroConta};
        dbo.collection("Contas").findOne(query, function (err, res) {
            if (err) throw err;
            var saldo = 0;
            if (descricao === "Deposito") {
                saldo = res.saldo + valor;
            } else {
                saldo = res.saldo - valor;
            }
            var values = { $set: {saldo: saldo} };
            dbo.collection("Contas").updateOne(query, values, function (err, res) {
                if (err) throw err;
                console.log("Saldo Atualizado");
                db.close();
            })
        })
    })
}

function updateAcc(numeroConta, descricao) {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var query = {conta: {$eq: numeroConta}};
        var values = { $set: {status: descricao} };
        dbo.collection("Contas").updateOne(query, values, function (err, res) {
            if (err) throw err;
            console.log("Descricao Atualizada");
            db.close();
        });

    })
}

function exp(){
    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        const cursor = await dbo.collection('Contas').find().project({conta: 1, saldo: 1, _id: 0}).toArray();

        let json2csvCallback = function (err, csv) {
            if (err) throw err;
            fs.writeFile('file.csv', csv, function (err) {
                if (err) throw err;
                console.log("saved to file.csv");
            })
        };

        converter.json2csv(cursor, json2csvCallback);

        db.close();
    })
}

module.exports.updateAcc = updateAcc;
module.exports.createAcc = creatAccount;
module.exports.createTran = createTransaction;
module.exports.exp = exp;

exp();