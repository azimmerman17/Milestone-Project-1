function getDeck() {
	let deck =[]
	suits.forEach(suit	=> {
    	faceValues.forEach(faceValue => {
			let card = {
				faceValue,
				suit,
				// loc: 'deck'
            };
			deck.push(card)

			// assigns values to handle straights (card.rank) and counting (gameValue)
            let hex
			switch (faceValue) {
			 	case 'A':
					card.gameValue = 1
			 		card.rank = 1
                    hex = '1'
			 		break;
                case '10':
                    card.gameValue = 10
			 		card.rank = 10
                    hex = 'A'
                    break
			 	case 'J':
					card.gameValue = 10
			 		card.rank = 11
                    hex = 'B'
			 		break;
				case 'Q':
					card.gameValue = 10
					card.rank = 12
                    hex = 'D'
					break;
				case 'K':
					card.gameValue = 10
					card.rank = 13
                    hex = 'E'
					break;
				default:
					card.gameValue = parseInt(card.faceValue)
					card.rank = parseInt(card.gameValue)
                    hex = faceValue
					break;		
			};
            //unicode for the card 'text' content.  Unicodes found here: https://www.htmlsymbols.xyz/games-symbols/playing-cards
            switch (suit) {
                case 'spades':
                    card.hexcode = '&#x1F0A' + hex
					card.color = 'black'
                    break
                case 'diamonds':
                    card.hexcode = '&#x1F0C' + hex
					card.color = 'red'
                    break
                case 'clubs':
                    card.hexcode = '&#x1F0D' + hex
					card.color = 'black'
                    break
                case 'hearts':
                    card.hexcode = '&#x1F0B' + hex
					card.color = 'red'
            
            };
        });
	});
	return deck
};

function getRandom(max) {
	return Math.floor(Math.random() * max)
}

function getId(id) {
    return document.getElementById(id)
}

function getDealer() {
	let dealer = null
	if (player.dealer === true) {
		dealer = player
	} else {dealer = ai}
	dealer.turn = false
	return dealer
};

function getNonDealer() {
	let nonDealer = null
	if (player.dealer === false) {
		nonDealer = player
	} else {nonDealer = ai}
	nonDealer.turn = true
	return nonDealer
};