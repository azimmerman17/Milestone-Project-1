//hand scoring
function score15(hand, points) { 
    hand = [1,5,2,3,4]  //player hand
    let count = 0

    for (let i = 0; i < hand.length; i++) { 
        for (let j = i + 1; j < hand.length; j++) {
            if (hand[i]+hand[j] === 15) {
                count += 1
            }   
            for (let k = j + 1; k < hand.length; k++) {
                if (hand[i] + hand[j] + hand[k] === 15) {
                count += 1
                } 
                for (let l = k + 1; l < hand.length; l++) {
                    if (hand[i] + hand[j] + hand[k] + hand[l] === 15) {
                    count += 1
                    }       
                    for (let m = l + 1; m < hand.length; m++) {
                        if (hand[i] + hand[j] + hand[k] + hand[l] + hand[m]  === 15) {
                            count += 1
                        }
                    }
                }
            }
        }
    }
    points = 2 * count
    return points
}

function scorePairs(hand, points) {
    hand = [1,5,2,3,4]  //player hand
    let count = 0

    for (let i = 0; i < hand.length; i++) { 
        for (let j = i + 1; j < hand.length; j++) {
            if (hand[i] === hand[j]) {
                count += 1
            }
        }
    }
    points = 2 * count
    return points
}

function scoreRun(hand) {
    let count = 0
    hand = hand.sort()
     for (let i = 0; i < hand.length; i++) {   
       for (let j = i + 1; j < hand.length; j++) {
         for (let k = j + 1; k < hand.length; k++) {         
          for (let l = k + 1; l < hand.length; l++) {
            for (let m = l + 1; m < hand.length; m++) {
              if (hand[i] + 1 === hand[j] &&hand[j] + 1 === hand[k] && hand[k] + 1 ===     hand[l] && hand[l] + 1 === hand[m]) {
                count += 1
              }
            }; 
            if (hand[i] + 1 === hand[j] &&hand[j] + 1 === hand[k] && hand[k] + 1 === hand[l]) {
              count += 1
            }  
          };
          if (hand[i] + 1 === hand[j] &&hand[j] + 1 === hand[k]) {
            count += 3
          }   
        };
      };
    };
    return count
  }

function scoreFlush (suit, crib) {
    let count = 0
    for (let i = 0; i < 4; i++) {
        let flushSuit = suit[0]
        if (flushSuit === suit[i]) {
            count += 1
        }
    if (count === 4 && flushSuit === suit[4]) {
        count += 1
        return count
    }
    }
    if (crib === true && count < 5) {
        count = 0
    }
    return count
}


//play scoring
function playPoints(player, count, cards) {
	let points = 0 
	if (count === 15) {
		points += 2
		//text content = '15' for 2
	}
	points += playPairs(cards) 
	points += playRuns(cards)  //no clue think on this later
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