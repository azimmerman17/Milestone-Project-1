const suits = ['spades', 'diamonds', 'clubs', 'hearts'];
const faceValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
let ai = {score: 0, dealer: false, hand: [], playPoints: 0, handPoints: 0, cribPoints: 0, highPlay: 0, highCrib: 0, highCrib: 0}
let player = {score: 0, dealer: false, hand: [], playPoints: 0, handPoints: 0, cribPoints: 0, highPlay: 0, highCrib: 0, highCrib: 0}
let crib = []
//builds an unshuffled deck for the game !!USE LISTENER TO SHUFFLE DECK WHEN USER CLICKS START GAME!!
const deck = getDeck()

//startGame() //eventlistener function?

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
                    card.hex = 'B'
					break;
				case 'K':
					card.gameValue = 10
					card.rank = 13
                    card.hex = 'B'
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
                    break
                case 'diamonds':
                    card.hexcode = '&#x1F0C' + card.hex
                    break
                case 'clubs':
                    card.hexcode = '&#x1F0D' + card.hex
                    break
                case 'hearts':
                    card.hexcode = '&#x1F0B' + card.hex
            
            }
        }
	};
	return deck;
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
}

//cut cards to see who deals first
//p1 cuts  //p2 cuts  //low card deals --same card redo
function getDealer() {
        let cut = Math.floor(Math.random() * 52) 
        while (cut <10 || cut > 48) {
            cut = Math.floor(Math.random() * 52)
        }
        let playerCard = deck[cut]
        let aiCard = deck[Math.floor(Math.random() * cut)]

        if (playerCard.rank < aiCard.rank) {
        player.dealer = true
        } else if (playerCard.rank > aiCard.rank) {
            ai.dealer = true
        } else {
            shuffle(deck)
            getDealer()
        }   
}

// deals cards - 6 cards each - pass in the play deck
function dealCards(deck, dealer, firstCard) {
	while (dealer.hand.length < 6) {
		firstCard.hand.push(deck[0])
		deck.shift()
		dealer.hand.push(deck[0])
		deck.shift()
	}
	return deck
}

function buildCrib(crib) {  
	crib = []
	//listener to select 2 cards
		//set cards.loc to crib
	let discard = Math.floor(Math.random() * 6)
	crib.push(ai.hand[discard])
	let discard1 = Math.floor(Math.random() * 6)
	ai.hand[discard].loc = 'crib'
	while (discard === discard1) {
		discard1 = Math.floor(Math.random() * 6)	
	}
	crib.push(ai.hand[discard1])
	ai.hand[discard1].loc = 'crib'
	ai.hand = buildNewhand(ai.hand)
	return crib	
}

function buildNewhand(hand) {
	newHand = []
	for (let i = 0; i < hand.length; i++) {
		if (hand[i] != 'crib') {
			newHand.push(hand[i])
		}
	}
}

function communalCard(deck, dealer) {
	let card = deck[0];
	if (card.faceValue === 'J') {
		dealer.points += 1
		dealer.playPoints += 1
		console.log('His nobs: 1') //display on screen
	}
}

function playRound(dealer, firstcard) {
	let playCards = 0
	while (playCards < dealer.hand.length + firstcard.hand.length) {
		let count = 0 //??
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

function playPoints(player, count, cards) {
	let points = 0 
	if (count === 15) {
		points += 2
		//text content = '15' for 2
	}
	points += playPairs(cards) 
	points += playStraights(cards)  //no clue think on this later
	if (count === 31) {
		points += 2
		//textContent '31 of 2"
	}
	return points
}

function playPairs(cards) {
	let points = 0
	let pairs = 0
		for (let i = cards.length - 1; i = 0; i--) {
			if (cards[i].faceValue === cards[i-1].faceValue) {
			pairs += 1
			} else break
		}
		switch(pairs) {
			case 1: 
				points = 2
				//textContent = 'Pair for 2'
				break
			case 2: 
				points = 6
				// textContent = 'Three of a Kind for 6'
				break
			case 2: 
				points = 12
				// textContent = 'Four of a Kind for 12'
				break
		}
	return points
}

//start game -while loop to END GAME

	//start round 
//DONE		//shuffle deck!!

        		// deal 6 cards -- non dealer first
			//either .pop() or for loop - put in in a new arrey

		//players discard 2 to crib
			//listener for click - maybe hot keys if time
		//flip starter card

			// 'J' = POINTS
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