function updateScore(who) {
    let score = getId(`${who.nme}-score`)
        score.value = who.score
    let scoreTxt = getId(`${who.nme}-score-txt`)
        scoreTxt.innerHTML = who.score
    if(ai.score > 121 || player.score > 121) {
        endGame()
    }

}

//hand scoring
function scoreHand(turn) {
    turn.hand.push(deck[0])
    let pts = 0
    pts += score15(turn.hand)
    pts += scorePairs(turn.hand)
    pts += scoreRun(turn.hand)
    pts += scoreFlush(turn.hand, false)
    pts += rightJack(turn.hand)
    turn.score += pts
    turn.handPoints += pts
    txt = getId('info1')
    txt.innerHTML = `${turn.nme} scores ${pts}`

    updateScore(turn)
}

function scoreCrib(turn) {
    crib.push(deck[0])
    let pts = 0
    pts += score15(crib)
    pts += scorePairs(crib)
    pts += scoreRun(crib)
    pts += scoreFlush(crib, true)
    pts += rightJack(crib)
    turn.score += pts
    turn.handPoints += pts
    txt = getId('info1')
    txt.innerHTML = `${turn.nme} scores ${pts}`
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
    return points
}

function scorePairs(hand) {
    let count = 0
    for (let i = 0; i < hand.length; i++) { 
        for (let j = i + 1; j < hand.length; j++) {
            if (hand[i].faceValue === hand[j].faceValue) {
                count++
            }
        }
    }
    points = 2 * count
    return points
}

function scoreRun(hand) {
    let handRanks = []
    let pairs = []
    hand.forEach(card => {
        handRanks.push(card.rank)
    })

    // remove any duplicate values
    handRanks.sort(function(a,b){return a-b})
    for (let i = 0; i < handRanks.length; i++) {
        if (handRanks[i] === handRanks[i + 1]) {
            pairs.push(handRanks[i])
            handRanks.splice(i, 1)
            i--
        }
    }

    let val = checkHandStraight(handRanks)
    let lngth = val[0]
    let high = val[1]
    let multiple = checkDuplicates(high, lngth, pairs)
    return lngth * multiple
}

function checkHandStraight(hand, high) {
    let count = 1
    let max = 1
    hand.map((card, i) => {
        if (card + 1 === hand[i + 1]) {
            count += 1 
        } else {
            if (count > max) {
                max =count
                high = card
            }
            count = 1
        }
    })
    if (max >= 3) {
        return [max, high]
    }
    return [0, null]
}

function checkDuplicates(high, lngth, pairs) {
    let count = 1 
    pairs.forEach(value => {
        if (value <= high && value >= high - lngth) {
            count += 1
        }
    })
    switch (count) {
        case 3:
            if (pairs[0] !== pairs[1]) {
                count += 1 
            }
    }
    return count
}
//rework maybe
function scoreFlush(hand, crib) {

    let count = 0
    for(let i = 0; i < hand.length - 1; i++) {
        if (hand[0].suit === hand[i].suit) {
            count += 1
        }
    }
    if (count < 4) {
        count = 0
    } else if (count === 4 && hand[0].suit === hand[4].sui) {
        count += 1
    }
    if (crib === true && count !== 5) {
        count = 0
    }
    return count
}

function rightJack(hand) {
    let pts = 0
    for (let i = 0; i < 4; i++) {
        if (hand[i].suit === hand[4].suit && hand[i].faceValue === 'J') {
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
	pts += playRuns(playRound.setCards)
	if (playRound.count === 31) {
		pts += 2
        playRound.goPts = 0
        player.go === true
        ai.go === true
        txt.innerHTML = '31 for 2'
    }
    turn.score += pts
    turn.playPoints += pts
    updateScore(turn)
}

function playPairs(cards) {
    let txt = document.querySelector('#info1')
    cards.reverse()
	let points = 0
	let pairs = findPairs(cards)
    switch (pairs) {
        case 1: 
        points = 2
        txt.innerHTML = 'Pair for 2'
        break
        case 2: 
        points = 6
        txt.innerHTML = '3 of a Kind for 6'
        break
        case 3: 
        points = 12
        txt.innerHTML = '4 of a Kind for 12'
        break
    }

return points
}

function findPairs(cards) {
    let value = cards[0].rank
    let pairs = 0
    for (let i = 1; i < cards.length; i++) {
        if (cards[i].rank === value) {
            pairs += 1
        } else { break }
    }
    return pairs
}

function playRuns(playedCards) {
    let run = []
    let max = 0

    playedCards.reverse().forEach(card => {
        run.push(card.rank)
        if (run.length >= 3) {
            let count = checkPlayStraight(run)
            if (count > max) {
                max = count
            }
        }
    });
    return max
}

function checkPlayStraight(run) {
    run.sort(function(a,b){return a-b})
    let count = 1
    run.forEach((card, i) => {
        if (card + 1 === run[i + 1]) {
            count += 1
        }
    })
    if (count === run.length) {
        return count
    } else {
        return 0
    }
}

function scoreLastCard() {
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