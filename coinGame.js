/**
 * Created by chentsu on 24.10.2016.
 */

var argv = require('minimist')(process.argv.slice(2));
var readline = require('readline');
var rl=readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.write('Угадайте какой стороной упадёт монета.\nВведите 1(орёл) или 2(решка). 0 - выход из программы.\n');

rl.on('line', function (inpt) {
    var coin= randCoin();
    inpt = parseInt(inpt);
    if (inpt===1 || inpt===2) {
        if (inpt === coin)
            console.log('Вы угадали!');
        else
            console.log('Вы не угадали.');
    }

    if (inpt===0)
        this.close();
    else
        console.log('\nВведите 1(орёл) или 2(решка). 0 - выход из программы.\n');
});

function randCoin() {
    return 1+Math.round(Math.random());
}