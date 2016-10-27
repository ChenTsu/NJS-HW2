var argv = require('minimist')(process.argv.slice(2));
var syncprompt = require('prompt-sync')();
var fs = require('fs');
var readline = require('readline');
var rl=readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function getCard (  )
{
	//функция возвращает случайную карту из массива
	var cards = ['6','7','8','9','10','J','Q','K','A'];
	return cards[ Math.floor( Math.random()*cards.length ) ];
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

function handStatus ( )
{
	return ( "-------------------------------------------------\nУ дилера "+ dealerCards.join(' ') + " сумма " + getSumCards(dealerCards) +  "\nУ вас "+ playerCards.join(' ') + " сумма " + getSumCards(playerCards));
}

function playerMoreCards ( ) // добавляем карты если нужно игроку
{
	var playerNext = true;
	do  
	{
		if (  (getSumCards(playerCards)<21)  && playerNext)
		{
			console.log(handStatus());
			playerNext = 1===Number(syncprompt("Ещё карту? (1 - взять ещё, что-либо другое - нет). "));
			if ( playerNext )
			{
				playerCards.push ( getCard() );
			}
		}
		else
		{
			playerNext = false;
		}
	}while ( playerNext ); //  набираем карты пока  нужны
}

function dealerMoreCards () // добавляем карты если нужно дилеру
{
	var dealerNext = true;
	do
	{
		if ( getSumCards(dealerCards)<17 )
		{
			dealerCards.push(getCard());
		}
		else
		{
			dealerNext = false;
		}
	}while ( dealerNext ); //  набираем карты пока  нужны
}

/*************************************************************************
						тело программы
*************************************************************************/
if ( argv.help /*|| argc<2*/) {
	rl.write('\tUsage:\tnode blackJack.js [LogFile]\n\tWhere:\tLogFile - path to log file.');
	rl.close();
}
else {
	// получаем первые карты
	var dealerCards = [];
	var playerCards = [];
	var moreGame = true;
	var dealerSum = 0;
	var playerSum = 0;

	console.log('\nИгра BlackJack "21" приветствует Вас.\n');

	while (moreGame) {
		dealerCards = [getCard()];
		playerCards = [getCard(), getCard()];
		dealerSum = 0;
		playerSum = 0;

		playerMoreCards();		//		добавляем карты игроку	//
		playerSum = getSumCards(playerCards);	// считаем суммы карт игрока, а то вызовы функий слишком громоздки в записи

		if (playerSum > 21) {
			console.log(handStatus() + "\nСожалеем. Вы проиграли! У вас перебор.");
		}
		else {
			// если у игрока сумма норм, добавляем карты дилеру //
			dealerMoreCards();
			dealerSum = getSumCards(dealerCards); // считаем суммы карт дилера, а то вызовы функий слишком громоздки в записи


			if (dealerSum > 21) // мы уже проверили что у игрока сумма норм
			{
				console.log(handStatus() + "\nПоздравляем! Вы выиграли! У дилера перебор.");
			}
			else if (playerSum == 21 && playerCards.length == 2) {
				console.log(handStatus() + "\nПоздравляем! У вас BlackJack! Вы выиграли!");
			}
			else if (playerSum > dealerSum) {
				console.log(handStatus() + "\nПоздравляем! Вы выиграли!");
			}
			else if (playerSum < dealerSum) {
				console.log(handStatus() + "\nСожалеем. Вы проиграли!");
			}
			else {
				console.log(handStatus() + "\nОчков поровну. Никто не выиграл.");
			}
		}
		if(argv._[0]) {
			if ( fs.statSync(argv._[0]).size>0 )
				fs.appendFileSync(argv._[0],',');
			fs.appendFileSync(argv._[0], dealerCards.join(' ') + ',' + playerCards.join(' ') /*,function (err) {if (err) throw 'Не могу открыть для записи файл: '+err;}*/);
		}
		moreGame = 1 === Number(syncprompt("\nХотите играть ещё раз? (1 - играть ещё, что-либо другое - нет). "));
	}

	console.log('Игра BlackJack "21"\nДо встречи. ');
	process.exit();
}