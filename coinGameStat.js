/**
 * Created by chentsu on 27.10.2016.
 */

var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');

var logFile = './logs/coinGameLog';
var wins=0;
// var losses=0;

if ( argv.help ) {
    console.log('\tUsage:\tnode coinGameStat.js LogFile\n\tWhere:\tLogFile - path to the log file for analysis');
    process.exit();
}
else {
    if (argv._[0])
        logFile = argv._[0];

    if ( !fs.existsSync(logFile) ){
        console.log('Не вижу файл логов ',logFile);
        process.exit();
    //    throw 'Не могу открыть файл логов: '+logFile;
    }

    var logs = fs.readFileSync(logFile).toString().replace(/\s+/g,'').slice(0,-1).split(','); //регулярка вырезает все служебные и пробельные символы, slice(0,-1) возвращает строку без последнего символа
    for ( var j=0; j<logs.length-2; j+=2)
    {
        if ( logs[j]===logs[j+1])
            wins++;
    }

    console.log('Сыграно %s игр. Побед %s%.\nВсего побед %s, проигрышей %s.',logs.length/2,(100*wins/(logs.length/2)).toFixed(2),wins,logs.length/2-wins);
}