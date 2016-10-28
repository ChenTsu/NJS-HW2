/**
 * Created by chentsu on 24.10.2016.
 */

var doLog = false;
var logFile='./logs/coinGameLog';
// var argc = process.argv.length;
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var readline = require('readline');
var rl=readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

if ( argv.help /*|| argc<2*/) {
    rl.write('\tUsage:\tnode coinGame.js [--log] [LogFile]\n\tWhere:\t --log - Writes logging information into a default file ./logs/coinGameLog\n\tLogFile - Writes logging information into a logfile at the specified LogFile path (in this case --log option is not necessary)');
    rl.close();
}
else {
    if (argv.log){
        doLog=true;
        if ( !fs.statSync('./logs').isDirectory())
            fs.mkdir('./logs',function (err) {if (err)throw 'Не могу создать директорию: '+err;});
    }
    if(argv._[0]){ doLog=true; logFile=argv._[0];}

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

            if ( doLog ) {
                fs.appendFile(logFile, coin + ',' + inpt + ',', function (err) {
                    if (err) throw 'Не могу открыть для записи файл: ' + err;
                });
            }
        }

        if (inpt===0)
            this.close();
        else
            console.log('\nВведите 1(орёл) или 2(решка). 0 - выход из программы.\n');
    });
}