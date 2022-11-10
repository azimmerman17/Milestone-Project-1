function updateScore(who) {
	if (who === ai) {
		let aiScore = document.getElementById('ai-score')
			aiScore.value = ai.score
		let aiScoreTxt = document.getElementById('ai-score-txt')
			aiScoreTxt.innerHTML = ai.score
	} if (who === player) {
		let playerScore = document.getElementById('player-score')
			playerScore.value = player.score
		let playerScoreTxt = document.getElementById('player-score-txt')
			playerScoreTxt.innerHTML = player.score
	}
    if(who.score >= 121) {
        endGame()
    }

}

//hand scoring
function scoreHand(turn, crib) {
    for (let i = 0; i < deck.length; i++) {
        if (deck[i].loc === 'starter') {
            turn.hand.push(deck[i])
        }
    }
    console.log(turn.hand)
    let pts = 0
    pts += score15(turn.hand)
    pts += scorePairs(turn.hand)
    pts += scoreRun(turn.hand)
    //pts += scoreFlush(turn.hand, crib)
    //pts += rightJack(turn.hand)
    turn.score += pts
    turn.handPoints += pts
    console.log(pts)
    txt = document.getElementById('info1')
    if (turn === player) {
        txt.innerHTML = `Player scores ${pts}`
    } else {
        txt.innerHTML = `AI scores ${pts}`
    }
    updateScore(turn)
}

function scoreCrib(turn) {
    for (let i = 0; i < deck.length; i++) {
        if (deck[i].loc === 'starter') {
            crib.push(deck[i])
        }
    }
    console.log(crib)
    let pts = 0
    pts += score15(crib)
    pts += scorePairs(crib)
    pts += scoreRun(crib)
    //pts += scoreFlush(crib, true)
    //pts += rightJack(crib)
    turn.score += pts
    turn.handPoints += pts
    console.log(pts)
    txt = document.getElementById('info1')
    if (turn === player) {
        txt.innerHTML = `Player scores ${pts}`
    } else {
        txt.innerHTML = `AI scores ${pts}`
    }
    updateScore(turn)
}

function score15(hand) { 
    let count = 0

    for (let i = 0; i < hand.length; i++) { 
        for (let j = i + 1; j < hand.length; j++) {
            if (hand[i].gameValue + hand[j].gameValue === 15) {
                count += 1
            }   
            for (let k = j + 1; k < hand.length; k++) {
                if (hand[i].gameValue + hand[j].gameValue + hand[k].gameValue === 15) {
                count += 1
                } 
                for (let l = k + 1; l < hand.length; l++) {
                    if (hand[i].gameValue + hand[j].gameValue + hand[k].gameValue + hand[l].gameValue === 15) {
                    count += 1
                    }       
                    for (let m = l + 1; m < hand.length; m++) {
                        if (hand[i].gameValue + hand[j].gameValue + hand[k].gameValue + hand[l].gameValue + hand[m].gameValue  === 15) {
                            count += 1
                        }
                    }
                }
            }
        }
    }
    points = 2 * count
    console.log('15', points)
    return points
}

function scorePairs(hand) {
    let count = 0
    for (let i = 0; i < hand.length; i++) { 
        for (let j = i + 1; j < hand.length; j++) {
            if (hand[i].faceValue === hand[j].faceValue) {
                count += 1
            }
        }
    }
    points = 2 * count
    console.log('Pairs', points)
    return points
}

function scoreRun(hand) {
    let count = 0
    let handRanks = []
    for(let i = 0; i < hand.length; i++) {
        handRanks.push(hand[i].rank)
    }
    handRanks.sort()
     for (let i = 0; i < handRanks.length; i++) {   
       for (let j = i + 1; j < handRanks.length; j++) {
         for (let k = j + 1; k < handRanks.length; k++) {         
          for (let l = k + 1; l < handRanks.length; l++) {
            // for (let m = l + 1; m < handRanks.length; m++) {
            //   if (handRanks[i] + 1 === handRanks[j] &&handRanks[j] + 1 === handRanks[k] && handRanks[k] + 1 ===     handRanks[l] && handRanks[l] + 1 === handRanks[m]) {
            //     count += 1
            //   }
            //  }; 
            if ((handRanks[i] === handRanks[j] -1) && (handRanks[j] === handRanks[k] - 1) && (handRanks[k] === handRanks[l] - 1)) {
              count -=2
            }  
          };
          if ((handRanks[i] === handRanks[j] - 1) && (handRanks[j] === handRanks[k] - 1)) {
            count += 3
          }   
        };
      };
    };
    console.log('runs', points)
    return count
  }

//rework maybe
function scoreFlush(hand, crib) {
    let count = 0
    console.log(hand)
    let flushSuit = hand[0].suits
    for (let i = 0; i < 4; i++) {
        if (hand[i].suits === flushSuit) {
            count += 1
        }
    } if (count === 4 && flushSuit === hand[4].suits) {
        count += 1
    } 
    if (crib === true && count < 5) {
        count = 0
    }
    console.log('flush', count)
    return count
}

function rightJack(hand) {
    let pts = 0
    for (let i = 0; i < 4; i++) {
        if (hand[i].suits === hand[4].suits && hand[i].faceValue === 'J') {
            pts += 1
        }

    }
    return pts
}


//play scoring
function scoreGo(turn) {
    if (playRound.goPts > 0) {
        let pts = playRound.goPts
        turn.score += pts
        turn.playPoints += pts
        updateScore(turn)
        playRound.goPts = 0
    }

}

function scorePlay(turn) {
    let txt = document.querySelector('#info1')
			txt.innerHTML = ''
	let pts = 0 
	if (playRound.count === 15) {
		pts += 2
        txt.innerHTML = '15 for 2'
	}
	pts += playPairs(playRound.setCards) 
//	pts += playRuns(playRound.playedCards)  //no clue think on this later
	if (playRound.count === 31) {
		pts += 2
        pts += playRound.goPts
        player.go === true
        ai.go === true
        txt.innerHTML = '31 for 2'
    }
   // console.log('pts', pts)
    turn.score += pts
    turn.playPoints += pts
    updateScore(turn)
}

function playPairs(cards) {
    let txt = document.querySelector('#info1')
	let points = 0
	let pairs = 0
    if (cards.length > 1 ) {
		for (let i = cards.length - 1; i > 0 ; i--) {
			if (cards[i].faceValue === cards[i-1].faceValue) {
			pairs += 1
			} else break
		}
		switch (pairs) {
			case 1: 
				points = 2
                let txt = document.querySelector('#info1')
			    txt.innerHTML = 'Pair for 2'
				break
			case 2: 
				points = 6
                txt = document.querySelector('#info1')
				txt.innerHTML = '3 of a Kind for 6'
				break
			case 3: 
				points = 12
                txt = document.querySelector('#info1')
				txt.innerHTML = '4 of a Kind for 12'
				break
		}
    }
	return points
}

function scoreLastCard(playedCards) {
   console.log('last card')
    if (player.turn === true) {
        player.score += 1
        player.playPoints += 1
        updateScore(player)
    } else {
        ai.score += 1
        ai.playPoints += 1
        updateScore(ai)
    }
}