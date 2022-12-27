const suits = ['spades', 'diamonds', 'clubs', 'hearts'];
const faceValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
let ai = {
	nme: 'ai',
	score: 0,
	dealer: false,
	hand: [],
	playPoints: 0,
	handPoints: 0,
	cribPoints: 0,
}
let player = {
	nme: 'player',
	score: 0,
	dealer: false,
	hand: [],
	playPoints: 0,
	handPoints: 0,
	cribPoints: 0,
}
let crib = []
let playRound = {
	numPlayedCards: 0,
	setCards: [],
	count: 0,
	goPts: 1,
}
const btns = {
	aiCards: document.querySelectorAll('.ai-card'),
	playerCards: document.querySelectorAll('.player-card'),
	deckBtn: getId('deck'),
	infoBtn: getId('info-btn'),
	playArea: document.querySelectorAll('.play-card'),
	count: getId('count'),
};

//builds an unshuffled deck for the game !
let deck = getDeck()

initiate()

//shuffles the deck when needed -always need to calls a deck varible
function shuffle(deck) {
	for (let i = 0; i < 1000; i++) {
		let card1 = getRandom(deck.length)
		let card2 = getRandom(deck.length)
		let temp = deck[card1]

		deck[card1] = deck[card2]
		deck[card2] = temp
	};
	return deck
};

//function to cut the deck
function cutDeck() {
    let cut = getRandom(deck.length) //Bonus Time: Listener to allow user to pick card
    tempDeck = deck.slice(0,cut)
    deckCut = deck.slice(cut)

    let newDeck = deckCut.concat(tempDeck)
    return newDeck
};

//start game 
function initiate() {
	let options = {once: true}
	btns.infoBtn.addEventListener('click', (() => {
		let txt = getId('info1')
			txt.innerHTML = 'Click Deck to Set Dealer'
		btns.infoBtn.style.visibility = 'hidden'
		setDealer()
	}), options)	
};

//cut cards to see who deals first
//p1 cuts  //p2 cuts  //low card deals --same card redo (automated)
function setDealer() {
	let dealer
	let options = {once: true}
	btns.deckBtn.addEventListener('click', (() => {
		let cut = getRandom(deck.length)
		while (cut < 10 || cut > 48) {
			cut = getRandom(deck.length)
		};
		let playerCard = deck[cut]
		let aiCard = deck[getRandom(cut)]
		
		if (playerCard.rank < aiCard.rank) {
			player.dealer = true
			dealer = player.nme
		} else if (playerCard.rank > aiCard.rank) {
			ai.dealer = true
			dealer = ai.nme
		} else {
			shuffle(deck)
			setDealer()
		};
		let dealerTxt = getId(`${dealer}-dealer`)
			dealerTxt.innerHTML = '&#127315'
		let aiCut = getId('ai-card0')
			aiCut.innerHTML = aiCard.hexcode
			aiCut.style.color = aiCard.color
		let playerCut = getId('player-card0')
			playerCut.innerHTML = playerCard.hexcode
			playerCut.style.color = playerCard.color
			btns.infoBtn.style.visibility = 'visible'
			btns.infoBtn.innerHTML = 'DEAL'
			let txt = getId('info1')
			txt.innerHTML = 'Low card deals first'
			startRound()
		}),options)
};

function changeDealer() {
	let aiDealer = getId('ai-dealer')
	let playerDealer = getId('player-dealer')
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

function startRound () {
		let options = {once: true}
		deck = getDeck()
		btns.infoBtn.addEventListener('click', (() => {
			shuffle(deck)
			dealCards(deck)
		}), options)
};

function newRound() {
	let infoDiv = getId('info-div')
	btns.infoBtn = document.createElement('button')
	btns.infoBtn.id = 'info-btn'
	btns.infoBtn.innerHTML = 'DEAL'
	let txt = document.createElement('p')
		txt.className = 'info-p'
		txt.id = 'info1'
	infoDiv.append(btns.infoBtn, txt)
	playRound = {
		numPlayedCards: 0,
		setCards: [],
		count: 0,
		goPts: 1,}
	crib = []
	player.hand = []
	ai.hand =[]
	changeDealer()
	startRound()
}

// deals cards - 6 cards each
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
	for (let i = 0; i < hand.length; i++) {
		if (hand === ai.hand) {
			btns.aiCards[i].innerHTML = ('&#x1F0A0')
			btns.aiCards[i].style.color = 'blue'
		} else {
			btns.playerCards[i].innerHTML = hand[i].hexcode
			btns.playerCards[i].style.color = hand[i].color
		};
	};
};

function displayCard(card) {
	let place = getId(`play-card${playRound.numPlayedCards}`)
		place.innerHTML = card.hexcode
		place.style.color = card.color
	playRound.numPlayedCards += 1
	playRound.count += card.gameValue //adds card to count
	btns.count.innerHTML = playRound.count //displays new count
	playRound.setCards.push(card)  //adds card to list to score potential runs (figure this out)

};

function displayCrib() {
	for (i = 0; i < crib.length; i++) {
		btns.playArea[i+2].innerHTML = crib[i].hexcode
		btns.playArea[i+2].style.color = crib[i].color
	}
	if (player.dealer === true) {
		const cribDiv = getId('player-crib')
		cribDiv.innerHTML = ''
	} else {
		const cribDiv = getId('ai-crib')
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
			if (btns.playerCards[i].style.color !== 'green' && selectedCount < 2) {
				btns.playerCards[i].style.color = 'green'
				selectedCount += 1
			} else if (btns.playerCards[i].style.color === 'green') {
				btns.playerCards[i].style.color = player.hand[i].color
				selectedCount -= 1				
			} 
		}))
		
	};
		btns.infoBtn.addEventListener('click', (() => {
			if (selectedCount === 2) {
			confirmCrib(selectedCount)
			selectedCount = 100
			setStarterCard()			 
			}
		}))	
};

function confirmCrib(count) {
	let dealer = getDealer()	
	playerCribDiscard()
	aiCribDiscard(count)
	const cribDiv = getId(`${dealer.nme}-crib`)
	cribDiv.innerHTML = '&#x1F0A0'

};

function playerCribDiscard() {
	let j = 0
	for (let i = 0; i < btns.playerCards.length; i++) {
		if (btns.playerCards[i].style.color === 'green') {
			crib.push(player.hand[j])	
			player.hand.splice(j,1)	
		} else {
			j++
		}
		btns.playerCards[i].remove()
		if (i < 4) {
			let hand = getId('player-hand')
			let playerCard = document.createElement('button');
				playerCard.className =  'player-card card'
				playerCard.id = `player-card${i}`
				hand.append(playerCard)
		}
	};
	btns.playerCards = document.querySelectorAll('.player-card')
	for (let i = 0; i < player.hand.length; i++) {
		btns.playerCards[i].innerHTML = player.hand[i].hexcode
		btns.playerCards[i].style.color = player.hand[i].color
	};
};

function aiCribDiscard(num) {
	for (let i = 0; i < num; i++) {
		let discard = getRandom(ai.hand.length)
		crib.push(ai.hand[discard])
		ai.hand.splice(discard, 1)
		btns.aiCards[ai.hand.length].style.visibility = 'hidden'
	}
};

function setStarterCard() {
	btns.infoBtn.innerHTML = 'CUT DECK'
	let txt = getId('info1')
			txt.innerHTML = ''
	let dealer = getDealer()
	let options = {once: true}
	btns.infoBtn.addEventListener('click',(() => {
			deck = cutDeck()
			let card = deck[0];
			btns.deckBtn.innerHTML = deck[0].hexcode
			btns.deckBtn.style.color = deck[0].color
			if (card.faceValue === 'J') {
				dealer.score += 2
				dealer.playPoints += 2
				let txt = getId('info1')
				txt.innerHTML = `His heels for 2`
				updateScore(dealer)
			};	
			playPhase()
	}), options)
	
};


function playPhase() {
	getId('count-div').style.visibility = 'visible'
	btns.count.innerHTML = playRound.count
	btns.infoBtn.innerHTML = ''
	ai.playedCards = []
	player.orgHand = []
	resetPlay()
	player.hand.forEach(card => {
		player.orgHand.push(card)  //use handOrg for the listener so we can remove cards from hand
	});
	for (let i = 0; i < player.orgHand.length; i++) {
		btns.playerCards[i].addEventListener('click', (() => {
			if (player.turn == true) {
				playerTurn(i)	
			};	
		}))
	};
	if (ai.turn === true) {
		aiTurn()
	};
}

function playerTurn(i) { 
	if (player.orgHand[i].gameValue + playRound.count < 32) {
		btns.playerCards[i].remove()  // removes button for DOM
		// remove card from player.hand
		displayCard(player.orgHand[i])   // displays played card 
		for (let j = 0; j < player.hand.length; j++) {  // matches played card to card in hand
			if (player.orgHand[i].hexcode === player.hand[j].hexcode) {
				player.hand.splice(j, 1)  // removes played card from hand
			}
		}
		scorePlay(player)
		changeTurn(ai, player)
	};
}

function aiTurn() {
	// select random card 
	let card = getRandom(ai.hand.length)
	while (ai.hand[card].gameValue + playRound.count > 31) {
		card = getRandom(ai.hand.length)
	}
	//add logic to play best scoring card
	// card = highestScoringCard(card)
	btns.aiCards[ai.hand.length-1].style.visibility = 'hidden' //shows ai played card
	ai.playedCards.push(ai.hand[card])  //adds card to played card -- need for later
	displayCard(ai.hand[card]) //displays played card
	ai.hand.splice(card, 1)  //removes card from  hand
	scorePlay(ai)
	changeTurn(player, ai)
}	

function changeTurn(first, second) {  //don't like the varible names
	if (playRound.numPlayedCards === 8) {	
		btns.infoBtn.innerHTML = 'CONTINUE'
		scoreLastCard()
		let options = {once: true}
		btns.infoBtn.addEventListener('click', function() {
			returnCards()
		}, options)
	} else {
		first.go = checkForGo(first)
		if (first.go === true) {
			scoreGo(second)
		}
		second.go = checkForGo(second)
		//need to display go's on screen -  use button for the player to say go
		if (first.go === false) {
			first.turn = true
			second.turn = false
		} else if (first.go === true && second.go === false) {
			first.turn = false
			second.turn = true
		} else {
			resetPlay()
			first.turn = true
			second.turn = false
		}
		if (ai.turn === true) {
			aiTurn()
		}
	}
}

function checkForGo(turn) {
	let canPlay = true
	for (let i = 0; i < turn.hand.length; i++) {
		if (playRound.count + turn.hand[i].gameValue < 32) {
			return false
		}
	};
	return canPlay
}

function resetPlay() {
	playRound.count = 0
	playRound.setCards = []
	playRound.goPts = 1
	player.go = false
	ai.go = false
};

function returnCards() {
	let txt = getId('info1')
		txt.innerHTML = ''
	let playerReturn = getId('player-hand')
	ai.hand = ai.playedCards
	player.hand = player.orgHand
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
	for (let i = 0; i < playRound.numPlayedCards;i++) {
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
	//put the player cards div back to default !!!!added button div rework to accomindate
	let options = {once: true}
	btns.infoBtn.addEventListener('click', function() {
		for (let i = 4; i < 6; i++) {
			let playerReturn = getId('player-hand')
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
		let infoBox = getId('info1')
		infoBox.remove()
		btns.infoBtn.remove()
		newRound()
	}, options)
}

 function endGame() { //need to remove any possible listeners maybe replace the player cards area aka all the buttons
	let finalDiv = document.querySelector('.play-area')
	for (let i = 0; i < btns.playArea.length; i++) {
		btns.playArea[i].remove()
	}
	let endGameTxt = document.createElement('h1')
	if (player.score > 120 && ai.score <91) {
		endGameTxt.innerHTML = 'You Win! Skunk!'
	} else if (player.score > 120) {
		endGameTxt.innerHTML = 'You win'
	}  else if (ai.score > 120 && player.score <91) {
		endGameTxt.innerHTML = 'You were skunked'
	}else { 'You lose'}
	finalDiv.append(endGameTxt)
}