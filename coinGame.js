/**
 * Created by chentsu on 24.10.2016.
 */

var doLog = false;
// var argc = process.argv.length;
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var readline = require('readline');
var rl=readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

if ( argv.help /*|| argc<2*/) {
    rl.write('\tUsage:\tnode coinGame.js [LogFile]\n\tWhere:\tLogFile - path to log file.');
    rl.close();
}
else {
    if(argv._[0]) doLog=true;

    rl.write('Угадайте какой стороной упадёт монета.\nВведите 1(орёл) или 2(решка). 0 - выход из программы.\n');

    rl.on('line', function (inpt) {
        var coin=1+Math.round(Math.random());
        inpt = parseInt(inpt);
        if (inpt===1 || inpt===2)
        {
            if (inpt === coin)
                console.log('Вы угадали!');
            else
                console.log('Вы не угадали.');

            if ( doLog )
                fs.appendFile(argv._[0],coin+','+inpt+',',function (err) {if (err) throw 'Не могу открыть для записи файл: '+err;});
        }

        if (inpt===0)
            this.close();
        else
            console.log('\nВведите 1(орёл) или 2(решка). 0 - выход из программы.\n');
    });
}