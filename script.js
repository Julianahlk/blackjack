$(document).ready(function() {

  // Declare and initialize variables
  let playerHand = [];
  let dealerHand = [];
  let playerScore;
  let dealerScore;
  let isPlayerTurn = true;
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  let deck = new Deck();

  deck.shuffle(); 

  function setupRound() {
    dealerHand.length = 0;
    playerHand.length = 0;
    playerScore = 0;
    dealerScore = 0;
    $("#game-result").hide();
    $("#dealer-hand").empty();
    $("#player-hand").empty();
    isPlayerTurn = true;

    // shuffle the deck if less than 15 cards
    if (deck.cardsCount < 15) {
      deck = new Deck();
      deck.shuffle();
    }

    // deal two cards to the dealer
    dealDealerCard("back");
    dealDealerCard("front");
    dealerScore = scoreHand(dealerHand);

    // Only display the score of the faceup card
    updateScoreDisplay("dealer-score", scoreHand(dealerHand.slice(1)));

    // deal two cards to the player.
    dealPlayerCard();
    dealPlayerCard();
    playerScore = scoreHand(playerHand);
    updateScoreDisplay("player-score", playerScore);

    // Show hit and stand buttons after the cards are dealt
    $("#buttons").show();
  }

  function dealDealerCard(side) {
    dealerHand.push(deck.drawCard());
    if (side === "front") {
      $("#dealer-hand").append(dealerHand[dealerHand.length - 1].renderCardFront());
    } else if (side === "back") {
      $("#dealer-hand").append(dealerHand[dealerHand.length - 1].renderCardBack());
    }
  }

  function dealPlayerCard() {
    playerHand.push(deck.drawCard());
    $("#player-hand").append(playerHand[playerHand.length - 1].renderCardFront());
  }

  function scoreHand(hand) {
    let score = 0;
    let acesCount = 0;

    hand.forEach((card) => {
      if (card.rank === "A") {
        acesCount++;
      } else {
        score += card.value;
      }
    });

    if (acesCount > 0) {
      if (score + acesCount <= 11) {
        score += 11;
      } else {
        score += acesCount;
      }
    }
    return score;
  }

  function updateScoreDisplay(element, score) {
    $("#" + element).text(score);
  }

  function hasBlackjack(hand) {
    if (hand.length === 2 && scoreHand(hand) === 21) {
      return true;
    }
    return false;
  }

  function playerHit() {
    if (!isPlayerTurn) return;
    dealPlayerCard();
    playerScore = scoreHand(playerHand);
    updateScoreDisplay("player-score", scoreHand(playerHand));

    if (playerScore >= 21) {
      isPlayerTurn = false;
      takeDealerTurn();
    }
  }

  function playerStand() {
    if (!isPlayerTurn) return;
    isPlayerTurn = false;
    takeDealerTurn();
  }

  async function takeDealerTurn() {
    $("#buttons").hide();
    $("#cardBack").remove();
    $("#dealer-hand").prepend(dealerHand[0].renderCardFront());
    updateScoreDisplay("dealer-score", scoreHand(dealerHand));
    await delay(800);
    
    while (dealerScore < 17) {
      dealDealerCard("front");
      dealerScore = scoreHand(dealerHand);
      updateScoreDisplay("dealer-score", scoreHand(dealerHand));
      if (dealerScore < 17) {
        await delay(800);
      }
    }

    displayGameResult(checkWinner());
  }

  function checkWinner() {
    const playerBlackjack = hasBlackjack(playerHand);
    const dealerBlackjack = hasBlackjack(dealerHand);
    console.log("playerBlackjack: " + playerBlackjack);
    console.log("dealerBlackjack: " + dealerBlackjack);
    console.log("playerScore: " + playerScore);
    console.log("dealerScore: " + dealerScore);

    if (playerBlackjack && !dealerBlackjack) {
      return "BLACKJACK!!! You Win";
    } else if (dealerBlackjack && !playerBlackjack) {
      return "BlackJack Dealer Wins";
    } else if (playerBlackjack && dealerBlackjack) {
      return "Push";
    } else if (playerScore > 21) {
      return "Bust - Dealer Wins";
    } else if (dealerScore > 21 && playerScore <= 21) {
      return "You Win!";
    } else if (playerScore > dealerScore) {
      return "You Win!";
    } else if (dealerScore > playerScore) {
      return "Dealer Wins";
    } else if (dealerScore === playerScore) {
      return "Push";
    }

    return "ERROR";
  }

  function displayGameResult(result) {
    $("#game-result").html(result);
    $("#game-result").show();
  }

  $("#hit-button").click(function () {
    playerHit();
  });

  $("#stand-button").click(function () {
    playerStand();
  });

  $("#game-result").click(function () {
    setupRound();
    $("#game-result").hide();
  });

  setupRound();

});
