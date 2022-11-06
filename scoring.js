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

function scoreStraight(hand, points) {

}

function scoreFlush (hand, points) {
    let suit = ['spade','club','spade','spade','spade']
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
}


//play scoring

