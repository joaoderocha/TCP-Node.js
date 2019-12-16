const Net = require('net');
const port = 8080;
const readLine = require('readline');
const EventEmitter = require('events');
const menu = 'Digite a opcao desejada:\n' +
    'cc - Criar Conta\n' +
    'dp - Deposito\n' +
    'sq - Saque\n' +
    'bc - Bloquear/Desbloquear a conta\n';

const client = new Net.Socket();
const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

function optionsListener(line) {
    let option = acptedOptions[line];
    if (option){
        rl.removeListener('line', () => {});
        option(client, line);
    }
}

function callback() {
    console.log(menu);
    rl.once('line', optionsListener)
}

const acptedOptions = {
    cc(client, data){
        console.log('Digite o numero da conta: ');
        rl.once('line', function (line) {
            var obj = {op: data, conta: line};
            client.write(JSON.stringify(obj));
            callback();
        });
    },
    dp(client, data){
        console.log('Digite o valor do Deposito e o numero da conta: ');
        rl.once('line', function (line) {
            let str = line.split(' ');
            var obj = {op: data, descricao: "Deposito", valor: str[0], conta: str[1]};
            client.write(JSON.stringify(obj));
            callback();
        });
    },
    sq(client, data){
        console.log('Digite o valor do Saque e o numero da conta: ');
        rl.once('line', function (line) {
            let str = line.split(' ');
            var obj = {op: data, descricao: "Saque", valor: str[0], conta: str[1]};
            client.write(JSON.stringify(obj));
            callback();
        });
    },
    bc(client, data){
        console.log('Digite numero da conta e o status que deseja dar a ela: ');
        rl.once('line', function (line) {
            let str = line.split(' ');
            var obj = {op: data, conta: str[0], descricao: str[1]};
            client.write(JSON.stringify(obj));
            callback();
        });
    },
};


client.connect( port, function() {
    client.addListener('data', data => {
        console.log(data.toString());
    });
    callback();
});
