/**
 * Created by chentsu on 28.10.2016.
 */

var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');

var logFile = './logs/blackJackGameLog';
var wins=0;
var playerblackjack=0;
var dealerblackjack=0;
var draws=0;
var losses=0;

if ( argv.help ) {
    console.log('\tUsage:\tnode blackJackStat.js [LogFile]\n\tWhere:\tLogFile - path to the log file for analysis.\n\tIf the logFile is not specified uses ./logs/blackJackGameLog');
    process.exit();
}
else {
    if (argv._[0])
        logFile = argv._[0];

    if ( !fs.existsSync(logFile) ){
        console.log('Не вижу файл логов ',logFile);
        process.exit();
    }

    var logs = fs.readFileSync(logFile).toString().split(',');
    for ( var j=0; j<logs.length; j+=2)
    {
        var dealerSum=getSumCards(logs[j].replace(/[\r\n]/g,'').split(' '));
        var playerSum=getSumCards(logs[j+1].replace(/[\r\n]/g,'').split(' '));

        if (playerSum > 21) {
            losses++;
        }
        else {
            if (dealerSum > 21) // мы уже проверили что у игрока сумма норм
            {
                wins++;
            }
            else if (playerSum == 21 && logs[j+1].split(' ').length == 2) {
                wins++;
                playerblackjack++
            }
            else if (playerSum > dealerSum) {
                wins++;
            }
            else if (playerSum < dealerSum) {
                losses++;
            }
            else {
                draws++;
            }
        }
    }

    console.log('Сыграно игр ',logs.length/2,'. Побед ',(100*wins/(logs.length/2)).toFixed(2),'%.' +
        '\nИгроку выпла BlackJack ',playerblackjack,' раз, диллеру ',dealerblackjack,' раз.' +
        '\nВсего побед ',wins,', проигрышей ',losses,', в ничью ',draws);
}

function getSumCards ( someCards )
{
    // функция вычисляет сумму карт в руке для игры "21" (BlackJack)
    var sum =0;

    for(var i=0, doMinus=false, haveA=false; i < someCards.length; i++ ) // doMinus - меняли стоимость туза
    {
        if ( (someCards[i] == 'A') && (sum+11 <= 21 ) && ( !haveA ))
        {
            sum = sum + 11;
            haveA = true;		// haveA=true - был туз==11;
        }
        else if ( (someCards[i] == 'A') )
        {
            sum++;
        }
        else if (someCards[i]=='J' || someCards[i]=='Q' || someCards[i]=='K')  /*someCards.charCodeAt(0) > 65*/
        {
            sum = sum + 10;
        }
        else
        {
            sum = sum + parseInt( someCards[i] );
        }

        if ( haveA && !doMinus && (sum > 21) )	// если был туз=11 и при добавлении еще одного случился перебор
        {
            sum = sum - 10;							 	// то меняем стоимость первого туза с 11 до 1
            doMinus = true;								// меняем один раз
        }
    }

    return sum;
}