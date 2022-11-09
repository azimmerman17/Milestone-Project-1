const suits = ['spades', 'diamonds', 'clubs', 'hearts'];
const faceValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
let ai = {score: 0, dealer: false, hand: [], playPoints: 0, handPoints: 0, cribPoints: 0}
let player = {score: 0, dealer: false, hand: [], playPoints: 0, handPoints: 0, cribPoints: 0}
let crib = []
let playRound = {numPlayedCards: 0, setCards: [], count: 0, goPts: 1, playedCards:[]}
const btns = {
	aiCards: document.querySelectorAll('.ai-card'),
	playerCards: document.querySelectorAll('.player-card'),
	deckBtn: document.querySelector('#deck'),
	infoBtn: document.querySelector('#infoBtn'),
	playArea: document.querySelectorAll('.play-Card')
}

//builds an unshuffled deck for the game !!USE LISTENER TO SHUFFLE DECK WHEN USER CLICKS START GAME!!
let deck = getDeck()

initiate()

//startGame() //eventlistener function?
//intiateRound()

function getDeck() {
	let deck =[]
	for (let i = 0; i < suits.length; i++) {
		for(let j = 0; j < faceValues.length; j++) {
			let card = {faceValue: faceValues[j], suit: suits[i], loc: 'deck'};
			deck.push(card)

			// assigns values to handle straights (card.rank) and counting (gameValue)
			switch (card.faceValue) {
			 	case 'A':
					card.gameValue = 1
			 		card.rank = 1
                    card.hex = '1'
			 		break;
                case '10':
                    card.gameValue = 10
			 		card.rank = 10
                    card.hex = 'A'
                    break
			 	case 'J':
					card.gameValue = 10
			 		card.rank = 11
                    card.hex = 'B'
			 		break;
				case 'Q':
					card.gameValue = 10
					card.rank = 12
                    card.hex = 'D'
					break;
				case 'K':
					card.gameValue = 10
					card.rank = 13
                    card.hex = 'E'
					break;
				default:
					card.gameValue = card.faceValue/1
					card.rank = card.gameValue/1
                    card.hex = card.faceValue
					break;		
			};
            //unicode for the card 'text' content.  Unicodes found here: https://www.htmlsymbols.xyz/games-symbols/playing-cards
            switch (card.suit) {
                case 'spades':
                    card.hexcode = '&#x1F0A' + card.hex
					card.color = 'black'
                    break
                case 'diamonds':
                    card.hexcode = '&#x1F0C' + card.hex
					card.color = 'red'
                    break
                case 'clubs':
                    card.hexcode = '&#x1F0D' + card.hex
					card.color = 'black'
                    break
                case 'hearts':
                    card.hexcode = '&#x1F0B' + card.hex
					card.color = 'red'
            
            }
        }
	};
	return deck;
};

function getDealer() {
	let dealer = null
	if (player.dealer === true) {
		dealer = player
	} else {dealer = ai}
	return dealer
}

function getNonDealer() {
	let nonDealer = null
	if (player.dealer === false) {
		nonDealer = player
	} else {nonDealer = ai}
	return nonDealer
}

//shuffles the deck when needed -always need to calls a deck varible
function shuffle(deck) {
	for (let i = 0; i < 1000; i++) {
		let card1 = Math.floor(Math.random() * 52)
		let card2 = Math.floor(Math.random() * 52)
		let temp = deck[card1]

		deck[card1] = deck[card2]
		deck[card2] = temp
	};
	return deck
};

//function to cut the deck
function cutDeck() {
    let cut = Math.floor(Math.random() * 52) //Bonus Time: Listener to allow user to pick card
    tempDeck = deck.slice(0,cut)
    deckCut = deck.slice(cut)

    let newDeck = deckCut.concat(tempDeck)
    return newDeck
}

//start game -while loop to END GAME
function initiate() {
	let options = {once: true}
	btns.infoBtn.addEventListener('click', (() => {
		let txt = document.querySelector('#info1')
			txt.innerHTML = 'Click Deck to Set Dealer'
		btns.infoBtn.style.visibility = 'hidden'
		setDealer()
	}), options)	
}

//cut cards to see who deals first
//p1 cuts  //p2 cuts  //low card deals --same card redo
function setDealer() {
	let dealer = 'null'
	let nonDealer ='null'
	let options = {once: true}
	btns.deckBtn.addEventListener('click', (() => {
		let cut = Math.floor(Math.random() * 52) 
		while (cut <10 || cut > 48) {
			cut = Math.floor(Math.random() * 52)
		}
		let playerCard = deck[cut]
		let aiCard = deck[Math.floor(Math.random() * cut)]
		
		if (playerCard.rank < aiCard.rank) {
		player.dealer = true
		let dealerTxt = document.getElementById('playerDealer')
				dealerTxt.innerHTML = '&#127315'
		} else if (playerCard.rank > aiCard.rank) {
			ai.dealer = true
			dealer = ai
			nonDealer =player
			let dealerTxt = document.getElementById('aiDealer')
				dealerTxt.innerHTML = '&#127315'
		} else {
			shuffle(deck)
			setDealer()
		} 
		let aiCut = document.getElementById('aiCard0')
			aiCut.innerHTML = aiCard.hexcode
			aiCut.style.color = aiCard.color
		let playerCut = document.getElementById('playerCard0')
			playerCut.innerHTML = playerCard.hexcode
			playerCut.style.color = playerCard.color
			btns.infoBtn.style.visibility = 'visible'
			btns.infoBtn.innerHTML = 'DEAL'
			let txt = document.querySelector('#info1')
			txt.innerHTML = 'Low card deals first'
			startGame()
		}),options)
}

//need to add loop 
function startGame () {
	//  while (ai.score < 121 || player.score < 121) {
		let options = {once: true}
		deck = getDeck()
		btns.infoBtn.addEventListener('click', (() => {
			shuffle(deck)
			dealCards(deck)
		}), options)
	
	// }
}

// deals cards - 6 cards each - pass in the play deck
function dealCards(deck) {
	let dealer = getDealer()
	let nonDealer = getNonDealer()
	while (dealer.hand.length < 6) {
		nonDealer.hand.push(deck[0])
		deck.shift()
		dealer.hand.push(deck[0])
		deck.shift()
	}
	displayHands(player.hand)
	displayHands(ai.hand)
	buildCrib(deck)
}

function displayHands(hand) {
	for(let i = 0; i <hand.length; i++) {
		if(hand === ai.hand) {
			hand[i].loc = 'ai'
			btns.aiCards[i].innerHTML = ('&#x1F0A0')
			btns.aiCards[i].style.color = 'blue'
		} else {
			hand[i].loc = 'player'
			btns.playerCards[i].innerHTML = hand[i].hexcode
			btns.playerCards[i].style.color = hand[i].color
		}
	}
}

function displayCard(card) {
	let place = document.getElementById(`play-Card${playRound.numPlayedCards}`)
		place.innerHTML = card.hexcode
		place.style.color = card.color
}

function buildCrib(deck) { 
	let selectedCount = 0
	btns.infoBtn.style.visibility = 'visible'
	btns.infoBtn.innerHTML = 'CONFIRM'
	let txt = document.querySelector('#info1')
		txt.innerHTML = `Select 2 cards for crib`
	for (let i = 0; i < btns.playerCards.length; i++) {
		btns.playerCards[i].addEventListener('click', (() => {
			if(player.hand[i].loc === 'player' && selectedCount < 2) {
				player.hand[i].loc = 'crib'
				btns.playerCards[i].style.color = 'green'
				selectedCount += 1
			} else {
				player.hand[i].loc = 'player'
				btns.playerCards[i].style.color = player.hand[i].color
				selectedCount -= 1
			}
			}))
		
	}
		btns.infoBtn.addEventListener('click', (() => {
			if (selectedCount === 2) {
			confirmCrib()
			selectedCount = 100
			setStarterCard(deck)
			}
		}))	
	//}	
}
function confirmCrib() {
	let dealer = getDealer()	
	playerCribDiscard()
	aiCribDiscard()
	if (dealer === player) {
		const cribDiv = document.getElementById('playerCrib')
		cribDiv.innerHTML = '&#x1F0A0'
	} else {
		const cribDiv = document.getElementById('aiCrib')
		cribDiv.innerHTML = '&#x1F0A0'	
	}			
	
}

function playerCribDiscard() {
	for (let i = 0; i < player.hand.length; i++) {
		if (player.hand[i].loc === 'crib') {
			crib.push(player.hand[i])	
			
		} 
	}
	player.hand = buildNewHand(player.hand)
	displayHands(player.hand)
	btns.playerCards[4].style.visibility = 'hidden'
	btns.playerCards[5].style.visibility = 'hidden'
}

function aiCribDiscard() {
	if (crib.length < 4) {
		let discard =  Math.floor(Math.random() * 6)
		crib.push(ai.hand[discard])
		ai.hand[discard].loc = 'crib'
		let discard1 = Math.floor(Math.random() * 6)
		while (discard === discard1) {
			discard1 = Math.floor(Math.random() * 6)	
		}
		crib.push(ai.hand[discard1])
		ai.hand[discard1].loc = 'crib'
		ai.hand = buildNewHand(ai.hand)
		displayHands(ai.hand)
		btns.aiCards[5].style.visibility = 'hidden'
		btns.aiCards[4].style.visibility = 'hidden'
	}
}

function buildNewHand(hand) {
	newHand = []
	for (let i = 0; i < hand.length; i++) {
		if (hand[i].loc != 'crib') {
			newHand.push(hand[i])
		}
	}
	return newHand
}

function setStarterCard(deck) {
	btns.infoBtn.innerHTML = 'CUT DECK'
	let txt = document.querySelector('#info1')
			txt.innerHTML = ''
	let dealer = getDealer()
	let options = {once: true}
	btns.infoBtn.addEventListener('click',(() => {
			deck = cutDeck()
			let card = deck[0];
			btns.deckBtn.innerHTML = deck[0].hexcode
			btns.deckBtn.style.color = deck[0].color
			deck[0].loc = 'starter'
			if (card.faceValue === 'J') {
				dealer.score += 1
				dealer.playPoints += 1
				let txt = document.querySelector('#info1')
				txt.innerHTML = `His heels for 1`
				updateScore(dealer)
			}	
			playPhase()
	}), options)
	
}

function playPhase() {
	console.log('playPhase')
	btns.infoBtn.innerHTML = playRound.count
	let dealer = getDealer()
	let nonDealer = getNonDealer()
	nonDealer.go = false
	dealer.go = false
	nonDealer.turn = true
	for (let i = 0; i < btns.playerCards.length; i++) {   ////dfbjsdoifjbspodifjbposidjbpoisgdjbosdgbpoisdgfpoisdfgubpsoigubsogub-
		btns.playerCards[i].addEventListener('click', function () {
			console.log(i)
			playerPlay(i)
		})
	}
	//while (playRound.playedCards < 8) {
		if(player.turn === true) {
			playCard(player)
		} else {playCard(ai)}
	//}
}

function playCard(turn) {	
	if (playRound.numPlayedCards === 8) {
		scoreLastCard()
	 	countHands()
	 }
	if (ai.go === true && player.go === true) {
		resetPlay(turn)
	}		
	let canPlay = checkGo(turn)
	if  (canPlay === false) {
		turn.go = true
	}
	if (player.turn === true){
		playerTurn()
	} else {
		 aiTurn()
	}
}

//check to see if there is a vaild play
function checkGo(turn) {
	canPlay = false
	for (let i = 0; i < turn.hand.length; i++) {
		 if (turn.hand[i].gameValue + playRound.count <= 31 && turn.hand.loc !== 'played') {
		 	canPlay = true
		} else {
			turn.go = true
		}
	}
	return canPlay
}

function playerTurn() {
	//player.turnCount += 1
	if (player.go === false) {
		let options = {once: true}
		// for (let i = 0; i < btns.playerCards.length; i++) {
		// 	btns.playerCards[i].addEventListener('click', function () {
		// 		playerPlay(i)
		// 	})
		// }
	} else {
		scoreGo(ai)
		changeTurn()
		playCard(ai)
	
	}
}

function playerPlay(i) { 
		console.log('click')
	if(player.hand[i].gameValue + playRound.count <= 31) {
		playRound.count += player.hand[i].gameValue
		//btns.playerCards[i].style.visibility = 'hidden'
		btns.playerCards[i].remove()
		//player.hand[i].loc = 'played'
		
		playRound.setCards.push(player.hand[i])
		playRound.playedCards.push(player.hand[i])
		btns.infoBtn.innerHTML = playRound.count
		displayCard(player.hand[i])
		playRound.numPlayedCards += 1

		//player.hand.splice(i,1)
		console.log('hand', player.hand)
		console.log(btns.playerCards)
		changeTurn()
		playCard(ai)
	}
	else {playerTurn()}


}

function aiTurn() {
	console.log('aiTurn')   ///need to remove cards from ai hand to reduce the 
	if (ai.go === false) {
		let card = Math.floor(Math.random() * ai.hand.length)
		while (ai.hand[card].gameValue + playRound.count > 31) {
			card = Math.floor(Math.random() * ai.hand.length)
		}
		playRound.count += ai.hand[card].gameValue
		btns.aiCards[card].style.visibility = 'hidden'
		playRound.setCards.push(ai.hand[card])
		btns.infoBtn.innerHTML = playRound.count
		displayCard(ai.hand[card])
		ai.hand.splice(card,1)
		console.log(ai.hand)
		playRound.numPlayedCards += 1
		changeTurn()
		playCard(player)
	}	else {
		scoreGo(player)
		changeTurn()
		playCard(player)
	}
}

function changeTurn() {
	if (player.turn === true) {
		ai.turn = true
		player.turn = false
	} else {
		ai.turn = false
		player.turn = true
	}
};

function resetPlay(turn) {
	playRound.count = 0
	playRound.setCards = []
	playRound.goPts = 1
	player.go = false 
	ai.go = false
	playCard(turn)
}



function countHands() {
	for (let i = 0; i < btns.playArea.length;i++) {
		btns.playArea[i].innerHTML = ''
	}
	let dealer = getDealer()
	let nonDealer = getNonDealer()
	scoreHand(nonDealer)
	scoreHand(dealer)
	scoreCrib(dealer)
	 
}



// select card
//check if vaild card
//score
//change turns



// let options = {once: true}



	// play cards
		//non dealer starts
		// keep track of turns
		// have logic in for pairs, 3x, 4x, straights (nonconsecutive)
		//cut off at 31 and award GO - both players playout until GO
		// award POINTS as you go
		// loop around until all cards played
			// if player has no cards- say Go and other player finishes

	//count cards
		//non dealer goes first
		//look for all combinations of POINTS - probably need to have the cards reorder for straights
		// fifteens?? we'll figure it out, watch out for duplicates 
		//flush of 4 or 5
		//starter card gets used
		//right jack - ignore starter card - maybe look for flush and jack, 
		//then add the starter card (+1 to flush if starter = suit)

	//crib to dealer
		//same as above although, no flush of 4,
		//award POINTS to dealers

	// start new round
//....
	//end game as soon as A PLAYER points >= 121
	//skunk = loss/win with 90 or less  (2 wins/loses)
	// 2x skunk = loos/wins with 60 or loss (4 wins/loses)

	//stats to track
		//best hand (avg)
		//best crib (avg)
		//best play (avg)
		//W-L
		//skunks


		//CPU  start with straight randoms  (easy)
		//CPU if time add logic - calculates best hand/play - google is your friend (normal)
		//Self count points in hand & crib-  not in play -  add muggings for missed points (hard)