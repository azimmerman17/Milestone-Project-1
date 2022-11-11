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
	infoBtn: document.getElementById('info-btn'),
	playArea: document.querySelectorAll('.play-card')
};

//builds an unshuffled deck for the game !!USE LISTENER TO SHUFFLE DECK WHEN USER CLICKS START GAME!!
let deck = getDeck()

initiate()


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
            
            };
        };
	};
	return deck
};

function getDealer() {
	let dealer = null
	if (player.dealer === true) {
		dealer = player
	} else {dealer = ai}
	return dealer
};

function getNonDealer() {
	let nonDealer = null
	if (player.dealer === false) {
		nonDealer = player
	} else {nonDealer = ai}
	return nonDealer
};

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
};

//start game -while loop to END GAME
function initiate() {
	let options = {once: true}
	btns.infoBtn.addEventListener('click', (() => {
		let txt = document.querySelector('#info1')
			txt.innerHTML = 'Click Deck to Set Dealer'
		btns.infoBtn.style.visibility = 'hidden'
		setDealer()
	}), options)	
};

//cut cards to see who deals first
//p1 cuts  //p2 cuts  //low card deals --same card redo (automated)
function setDealer() {
	let dealer = 'null'
	let nonDealer ='null'
	let options = {once: true}
	btns.deckBtn.addEventListener('click', (() => {
		let cut = Math.floor(Math.random() * 52) 
		while (cut <10 || cut > 48) {
			cut = Math.floor(Math.random() * 52)
		};
		let playerCard = deck[cut]
		let aiCard = deck[Math.floor(Math.random() * cut)]
		
		if (playerCard.rank < aiCard.rank) {
		player.dealer = true
		let dealerTxt = document.getElementById('player-dealer')
				dealerTxt.innerHTML = '&#127315'
		} else if (playerCard.rank > aiCard.rank) {
			ai.dealer = true
			dealer = ai
			nonDealer =player
			let dealerTxt = document.getElementById('ai-dealer')
				dealerTxt.innerHTML = '&#127315'
		} else {
			shuffle(deck)
			setDealer()
		};
		let aiCut = document.getElementById('ai-card0')
			aiCut.innerHTML = aiCard.hexcode
			aiCut.style.color = aiCard.color
		let playerCut = document.getElementById('player-card0')
			playerCut.innerHTML = playerCard.hexcode
			playerCut.style.color = playerCard.color
			btns.infoBtn.style.visibility = 'visible'
			btns.infoBtn.innerHTML = 'DEAL'
			let txt = document.querySelector('#info1')
			txt.innerHTML = 'Low card deals first'
			startRound()
		}),options)
};

function changeDealer() {
	let aiDealer = document.getElementById('ai-dealer')
	let playerDealer = document.getElementById('player-dealer')
	if (player.dealer === true) {
		player.dealer = false
		ai.dealer = true
		playerDealer.innerHTML = ''
		aiDealer.innerHTML = '&#127315'
	
	} else {
		player.dealer = true
		ai.dealer = false
		playerDealer.innerHTML = '&#127315'
		aiDealer.innerHTML = ''
	}

}

//need to add loop 
function startRound () {
	//  while (ai.score < 121 || player.score < 121) {
		let options = {once: true}
		deck = getDeck()
		btns.infoBtn.addEventListener('click', (() => {
			shuffle(deck)
			dealCards(deck)
		}), options)
	
	// }
};

function newRound() {
	let infoDiv = document.getElementById('info-div')
	btns.infoBtn = document.createElement('button')
	btns.infoBtn.id = 'info-btn'
	btns.infoBtn.innerHTML = 'DEAL'
	let txt = document.createElement('p')
		txt.className = 'info-p'
		txt.id = 'info1'
	infoDiv.append(btns.infoBtn, txt)
	playRound = {numPlayedCards: 0, setCards: [], count: 0, goPts: 1, playedCards:[]}
	crib = []
	player.hand = []
	ai.hand =[]
	changeDealer()
	startRound()
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
	};
	displayHands(player.hand)
	displayHands(ai.hand)
	buildCrib(deck)
};

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
		};
	};
};

function displayCard(card) {
	let place = document.getElementById(`play-card${playRound.numPlayedCards}`)
		place.innerHTML = card.hexcode
		place.style.color = card.color
};

function displayCrib() {
	for (i = 0; i < crib.length; i++) {
		btns.playArea[i+2].innerHTML = crib[i].hexcode
		btns.playArea[i+2].style.color = crib[i].color
	}
	if (player.dealer === true) {
		const cribDiv = document.getElementById('player-crib')
		cribDiv.innerHTML = ''
	} else {
		const cribDiv = document.getElementById('ai-crib')
		cribDiv.innerHTML = ''	
	}
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
		
	};
		btns.infoBtn.addEventListener('click', (() => {
			if (selectedCount === 2) {
			confirmCrib()
			selectedCount = 100
			setStarterCard(deck)
			}
		}))	
};

function confirmCrib() {
	let dealer = getDealer()	
	playerCribDiscard()
	aiCribDiscard()
	if (dealer === player) {
		const cribDiv = document.getElementById('player-crib')
		cribDiv.innerHTML = '&#x1F0A0'
	} else {
		const cribDiv = document.getElementById('ai-crib')
		cribDiv.innerHTML = '&#x1F0A0'	
	};		
	
};

function playerCribDiscard() {
	for (let i = 0; i < player.hand.length; i++) {
		if (player.hand[i].loc === 'crib') {
			crib.push(player.hand[i])	
			
		};
	};
	player.hand = buildNewHand(player.hand)
	displayHands(player.hand)
	btns.playerCards[4].remove()
	btns.playerCards[5].remove()
};

function aiCribDiscard() {
	if (crib.length < 4) {
		let discard =  Math.floor(Math.random() * 6)
		crib.push(ai.hand[discard])
		ai.hand[discard].loc = 'crib'
		let discard1 = Math.floor(Math.random() * 6)
		while (discard === discard1) {
			discard1 = Math.floor(Math.random() * 6)	
		};
		crib.push(ai.hand[discard1])
		ai.hand[discard1].loc = 'crib'
		ai.hand = buildNewHand(ai.hand)
		displayHands(ai.hand)
		btns.aiCards[5].style.visibility = 'hidden'
		btns.aiCards[4].style.visibility = 'hidden'
	};
};

function buildNewHand(hand) {
	newHand = []
	for (let i = 0; i < hand.length; i++) {
		if (hand[i].loc != 'crib') {
			newHand.push(hand[i])
		}
	};
	return newHand
};

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
			};	
			playPhase()
	}), options)
	
};

function playPhase() {
	btns.infoBtn.innerHTML = playRound.count
	let dealer = getDealer()
	let nonDealer = getNonDealer()
	ai.playedCards = []
	player.playedCards = 0
	nonDealer.go = false
	dealer.go = false
	nonDealer.turn = true
	for (let i = 0; i < btns.playerCards.length; i++) {
		btns.playerCards[i].addEventListener('click', function () {
			playCard(player, i)
		})
	};
	if(ai.turn === true) {
		playCard(ai)
	};
};

function playCard(turn, i) {
	checkGo(turn)
	if (ai.go === true && player.go === true) {  ///this needs to be moved
		resetPlay(turn)
	} else if (turn.go === true) {
		changeTurn()
	}
	if (player.turn === true) {
		playerTurn(i)
	} else if (ai.turn === true) { player.turn === true
		aiTurn()
	}

};

//check to see if there is a vaild play
function checkGo(turn) {
	canPlay = false
	for (let i = 0; i < turn.hand.length; i++) {
		if (turn.hand[i].gameValue + playRound.count < 32 && turn.hand[i].loc !== 'played') {
		 	canPlay = true
		}
		if(canPlay !== true) {
			turn.go = true
		}
	};
	if(ai.hand.length === 0 && ai.turn === true) {
		ai.go = true
	}
	if(player.playedCards === 4 && player.turn === true) {
		player.go = true
	}
};

function playerTurn(i) {
	if (player.go === false) {
		playerPlay(i)
	} else {
		scoreGo(ai)
		changeTurn()
	};
};

function playerPlay(i) { 
	if(player.hand[i].gameValue + playRound.count < 32) {
		playRound.count += player.hand[i].gameValue
		btns.playerCards[i].remove()
		player.hand[i].loc = 'played'  			//remove later --debug use only
		playRound.setCards.push(player.hand[i])
		playRound.playedCards.push(player.hand[i])
		btns.infoBtn.innerHTML = playRound.count
		displayCard(player.hand[i])
		playRound.numPlayedCards += 1
		player.playedCards += 1
		scorePlay(player)
		if (playRound.numPlayedCards === 8) {	
			btns.infoBtn.innerHTML = 'CONTINUE'
			scoreLastCard()
			let options = {once: true}
			btns.infoBtn.addEventListener('click', function() {
				returnCards()
		}, options)
		}
		changeTurn()
		//playCard(ai)
	} else {changeTurn()
	};


};

function aiTurn() {
	if (ai.go === false) {
		let card = Math.floor(Math.random() * ai.hand.length)
		while (ai.hand[card].gameValue + playRound.count > 31) {
			card = Math.floor(Math.random() * ai.hand.length)
		}
		playRound.count += ai.hand[card].gameValue
		btns.aiCards[ai.hand.length-1].style.visibility = 'hidden'
		playRound.setCards.push(ai.hand[card])
		playRound.playedCards.push(ai.hand[card])
		ai.playedCards.push(ai.hand[card])
		btns.infoBtn.innerHTML = playRound.count
		displayCard(ai.hand[card])
		ai.hand.splice(card,1)
		playRound.numPlayedCards += 1
		scorePlay(ai)
		if (playRound.numPlayedCards === 8) {	
			btns.infoBtn.innerHTML = 'CONTINUE'
			scoreLastCard()
			let options = {once: true}
			btns.infoBtn.addEventListener('click', function() {
				returnCards()
		}, options)
		} 
		changeTurn()
		//playCard(player)
	} else {
		scoreGo(player)
		changeTurn()
		//playCard(player)
	};
};

function changeTurn() {
	if (player.turn === true) {
		ai.turn = true
		player.turn = false
		playCard(ai)
	} else {
		ai.turn = false
		player.turn = true
		playCard(player)
	};
};

function resetPlay(turn) {
	playRound.count = 0
	playRound.setCards = []
	playRound.goPts = 1
	player.go = false
	ai.go = false
	playCard(turn)
};

function returnCards() {
	let txt = document.getElementById('info1')
		txt.innerHTML = ''
	let playerReturn = document.getElementById('player-hand')
	ai.hand = ai.playedCards
	for (let i = 0; i < 4; i++) {
		let playerReturnCard =document.createElement('button');
			playerReturnCard.className =  'player-card card'
			playerReturnCard.id = `player-card${i}`
			playerReturnCard.innerHTML = player.hand[i].hexcode
			playerReturnCard.style.color = player.hand[i].color
			playerReturn.append(playerReturnCard)
		btns.aiCards[i].style.visibility = 'visible'
		btns.aiCards[i].style.color = ai.hand[i].color
		btns.aiCards[i].innerHTML = ai.hand[i].hexcode
	};
	for (let i = 0; i < playRound.playedCards.length;i++) {
		btns.playArea[i].innerHTML = ''
	}
	countHands()
};



function countHands() {
	btns.infoBtn.innerHTML = 'SCORE NONDEALER'
	let dealer = getDealer()
	let nonDealer = getNonDealer()
	let clicks = 0
	btns.infoBtn.addEventListener('click', function() {
		switch (clicks) {
			case 0: 
				scoreHand(nonDealer)
				btns.infoBtn.innerHTML = 'SCORE DEALER'
				break
			case 1: 
				scoreHand(dealer)
				btns.infoBtn.innerHTML = 'SCORE CRIB'
				break
			case 2:
				displayCrib()
				scoreCrib(dealer)
				btns.infoBtn.innerHTML = 'START NEW ROUND'
				clicks = 10
				endRound()
		}
		clicks += 1
	})
};

function endRound() {
	//put the player cards div back to default
	let options = {once: true}
	btns.infoBtn.addEventListener('click', function() {
		for (let i = 4; i < 6; i++) {
			let playerReturn = document.getElementById('player-hand')
			let playerReturnCard =document.createElement('button');
				playerReturnCard.className = 'player-card card'
				playerReturnCard.id = `player-card${i}`
				playerReturn.append(playerReturnCard)
		}
		btns.playerCards = document.querySelectorAll('.player-card')
		for (let i = 0; i < 6; i++) {
			btns.aiCards[i].style.color = 'blue'
			btns.aiCards[i].innerHTML = ''
			btns.aiCards[i].style.visibility = 'visible'
			btns.playerCards[i].innerHTML = ''
			
		}
		for (let i = 0; i < btns.playArea.length; i++) {
			btns.playArea[i].innerHTML = ''
		}
		btns.deckBtn.innerHTML = '&#x1F0A0'
		btns.deckBtn.style.color = 'blue'
		let infoBox = document.getElementById('info1')
		infoBox.remove()
		btns.infoBtn.remove()
		newRound()
	}, options)
}

 function endGame() {
	let finalDiv = document.querySelector('.play-area')
	for (let i = 0; i < btns.playArea.length; i++) {
		btns.playArea[i].remove()
	}
	let endGameTxt = document.createElement('h1')
	if (player.score > 120 && ai.score <91) {
		endGameTxt.innerHTML = 'You skunked the AI'
	} else if (player.score > 120) {
		endGameTxt.innerHTML = 'You win'
	}  else if (ai.score > 120 && player.score <91) {
		endGameTxt.innerHTML = 'You were skunked'
	}else { 'You lose'}
	finalDiv.append(endGameTxt)
}