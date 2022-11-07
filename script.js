const suits = ['spades', 'diamonds', 'clubs', 'hearts'];
const faceValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
let ai = {score: 0, dealer: false, hand: [], playPoints: 0, handPoints: 0, cribPoints: 0}
let player = {score: 0, dealer: false, hand: [], playPoints: 0, handPoints: 0, cribPoints: 0}
let crib = []
const btns = {
	aiCards: document.querySelectorAll('.ai-card'),
	playerCards: document.querySelectorAll('.player-card'),
	deckBtn: document.querySelector('#deck'),
	infoBtn: document.querySelector('#infoBtn')
}

//builds an unshuffled deck for the game !!USE LISTENER TO SHUFFLE DECK WHEN USER CLICKS START GAME!!
const deck = getDeck()

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

function updateScore() {
	let aiScore = document.getElementById('aiScore')
		aiScore.value = ai.score
	let aiScoreTxt = document.getElementById('aiScoreTxt')
		aiScoreTxt.innerHTML = ai.score
	let playerScore = document.getElementById('p1Score')
		playerScore.value = player.score
	let playerScoreTxt = document.getElementById('p1ScoreTxt')
		playerScoreTxt.innerHTML = player.score
}

initiate()
//start game -while loop to END GAME
function initiate() {
	let options = {once: true}
	btns.infoBtn.addEventListener('click', (() => {
		let txt = document.querySelector('#info1')
			txt.innerHTML = 'click deck to determine dealer'
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
				dealerTxt.innerHTML = 'D'
		} else if (playerCard.rank > aiCard.rank) {
			ai.dealer = true
			dealer = ai
			nonDealer =player
			let dealerTxt = document.getElementById('aiDealer')
				dealerTxt.innerHTML = 'D'
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
			txt.innerHTML = ''
			startGame()
		}),options)
}

//need to add loop 
function startGame () {
	//  while (ai.score < 121 || player.score < 121) {
		let options = {once: true}
		let playDeck = deck
		btns.infoBtn.addEventListener('click', (() => {
			shuffle(playDeck)
			dealCards(playDeck)
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
	displayCards(player.hand)
	displayCards(ai.hand)
	buildCrib(deck)
}

function displayCards(hand) {
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

//
function buildCrib(deck) { 
	let selectedCount = 0
	btns.infoBtn.style.visibility = 'visible'
	btns.infoBtn.innerHTML = 'CONFIRM'
	let txt = document.querySelector('#info1')
			txt.innerHTML = `Select cards for crib`
	for (let i = 0; i < btns.playerCards.length; i++) {
		btns.playerCards[i].addEventListener('click', (() => {
			if(player.hand[i].loc === 'player' && selectedCount < 2) {
				player.hand[i].loc = 'crib'
				btns.playerCards[i].style.color = 'green'
				selectedCount += 1
			} else if (player.hand[i].loc === 'crib') { 
				player.hand[i].loc = 'player'
				btns.playerCards[i].style.color = player.hand[i].color
				selectedCount -= 1
			}  else {}
			}))
	}
	if (crib.length < 4) {
		btns.infoBtn.addEventListener('click', (() => {
			let dealer = getDealer()
			if(selectedCount > 1) {
				playerCribDiscard()
				aiCribDiscard()
			if (dealer === player) {
					const cribDiv = document.getElementById('playerCrib')
					cribDiv.innerHTML = '&#x1F0A0'
				} else {
					const cribDiv = document.getElementById('aiCrib')
					cribDiv.innerHTML = '&#x1F0A0'	
			 	}			
			setStarterCard(deck)
			}
		}))
	}

		
}

function playerCribDiscard() {
	for (let i = 0; i < player.hand.length; i++) {
		if (player.hand[i].loc === 'crib') {
			crib.push(player.hand[i])	
			
		} 
	}
	player.hand = buildNewHand(player.hand)
	displayCards(player.hand)
	btns.playerCards[4].style.display = 'none'
	btns.playerCards[5].style.display = 'none'
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
		displayCards(ai.hand)
		btns.aiCards[5].style.display = 'none'
		btns.aiCards[4].style.display = 'none'
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
	btns.infoBtn.innerHTML = 'Cut Deck'
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
		}
		updateScore()
		playPhase(deck)
	}) , options)
	
}

function playPhase() {
	let dealer = getDealer()
	let nonDealer = getNonDealer()
	console.log(dealer)
	let playCards = 0
	while (playCards < dealer.hand.length + firstcard.hand.length) {
		let count = 0
		firstcard.go = false
		dealer.go = false
		while (count <= 31 || (firstcard.go === false && dealer.go === false)) {
			let setCards = []
			if (firstcard.go = false) {
				count += playCard(count, firstcard, setCards, dealer)
			}
			if (dealer.go = false) {
				count += playCard(count, dealer, setCards, firstcard)
			}
		}
	}
}

function playCard(count, player, setCards, other) {
	let goCheck = count //check for Go 
	let cardsLeft = player.hand.length  
	let playableCards = []
	for (let i = 0; i < player.hand.length; i++) {
		if (player.hand[i].played != true && goCheck + player.hand [i].gameValue <= 31) {
			player.hand[i].index = i
			playableCards.push(player.hand[i])
		} else {cardsLeft -= 1}
		if (cardsLeft > 0) {
			let indexPc = Math.floor(Math.random() * playableCards.length)
			setCards.push(playableCards[indexPc])
			let indexOg = playableCards[indexPc].index
			player.hand[indexOg].played = true
			count += player.hand[indexOg].gameValue
			let playPts= playPoints(player, count, setCards)
			player.handPoints += playPts
			player.points += playPts
		} else {
			player.go = true
			other.points +=1
			other.playpoints += 1
		}
	}
	return count
}


// let options = {once: true}
// deckBtn.addEventListener('click', (() => {
// 	deckBtn.innerHTML = '&#x1F0A0'
// 	let gameDeck = shuffle(getDeck(deck)); 
// 	starter = {} 
// 	dealingPhase(gameDeck)
// 	//playPhase()
// }), options)
// 	//start round 

function dealingPhase(gameDeck) {
	let dealer = getDealer()	
	let nonDealer = null
	if (dealer = player) {
		nonDealer = ai
	} else {nonDealer = player}
	dealCards(gameDeck, dealer,nonDealer)
	starter = starterCard(gameDeck, dealer)
	buildCrib(starter)
	//playPhase(dealer,nonDealer)
}




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