/**
 * Created by chentsu on 24.10.2016.
 */

var argc = process.argv.length;
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var readline = require('readline');
var rl=readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

if ( argv.help /*|| argc<2*/) {
    rl.write('Usage:\t node coinGame.js [LogFile]\nWhere:\tLogFile - path to log file.');
}
else {
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
}

function randCoin() {
    return 1+Math.round(Math.random());
}