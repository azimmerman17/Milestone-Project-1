const suits = ['spades', 'diamonds', 'clubs', 'hearts'];
const faceValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
let ai = {score: 0, dealer: false, playPoints: 0, handPoints: 0, cribPoints: 0}
let player = {score: 0, dealer: false, playPoints: 0, handPoints: 0, cribPoints: 0}

//builds an unshuffled deck for the game !!USE LISTENER TO SHUFFLE DECK WHEN USER CLICKS START GAME!!
const deck = getDeck()

function getDeck() {
	let deck =[]
	for (let i = 0; i < suits.length; i++) {
		for(let j = 0; j < faceValues.length; j++) {
			let card = {faceValue: faceValues[j], suit: suits[i]};
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
function cutDeck(playDeck) {
    let cut = Math.floor(Math.random() * 52) //Bonus Time: Listener to allow user to pick card
    tempDeck = deck.slice(0,cut)
    deckCut = deck.slice(cut)

    let newDeck = deckCut.concat(tempDeck)
    return newDeck
}

//cut cards to see who deals first
//p1 cuts  //p2 cuts  //low card deals --same card redo
function getDealer() {
        console.log(deck)
        let cut = Math.floor(Math.random() * 52) 
        console.log(cut)
        while (cut <10 || cut > 48) {
            cut = Math.floor(Math.random() * 52)
        }
        console.log(cut)
        let playerCard = deck[cut]
        let aiCard = deck[Math.floor(Math.random() * cut)]
        console.log(playerCard)
        console.log(aiCard)

        if (playerCard.rank < aiCard.rank) {
        player.dealer = true
        } else if (playerCard.rank > aiCard.rank) {
            ai.dealer = true
        } else {
            shuffle(deck)
            getDealer()
        }   
}

startGame()

async function startGame() {
    shuffle(deck)
    const dealer = document.getElementById('deck')
    while (player.dealer === false && ai.dealer === false) {
        dealer.addEventListener('click', (() => {
            getDealer()
            console.log(player)
            console.log(ai)
        }))
    }
    // while (player.score <= 120 || ai.score <= 120) {
    await shuffle(deck)
    console.log(player)
    console.log(ai)

        
    // }
}

//start game -while loop to END GAME

	//start round
		//shuffle deck

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