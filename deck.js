const SUITS = ["♠", "♣", "♥", "♦"];
const RANKS = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];

// Source: https://github.com/WebDevSimplified/War-Card-Game/blob/main/deck.js
class Deck {
  constructor(cards = buildDeck()) {
    this.cards = cards;
  }

  get cardsCount() {
    return this.cards.length;
  }

  drawCard() {
    return this.cards.shift();
  }

  shuffle() {
    for (let i = this.cardsCount - 1; i > 0; i--) {
      const newIndex = Math.floor(Math.random() * (i + 1)); // why is it i + 1 ?
      const oldValue = this.cards[newIndex];
      this.cards[newIndex] = this.cards[i];
      this.cards[i] = oldValue;
    }
  }
}

class Card {

  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  get value() {
    if (this.rank === "J" || this.rank === "K" || this.rank === "Q") {
      return 10;
    } else {
      return this.rank;
    }
  }

  // Source: https://github.com/stayko/blackjack-js/blob/master/blackjack.js
  renderCardFront() {
    return (
      `<div class="card-front ` + this.suit + `">
        <div class="top rank">` + this.rank + `</div>
        <div class="suit">` + this.suit + `</div>
        <div class="bottom rank">` + this.rank + `</div>
      </div>`
    );
  }

  renderCardBack() {
    return '<div class="card-back" id="cardBack" ></div>';
  }
}

function buildDeck() {
  return SUITS.flatMap((suit) => {
    return RANKS.map((rank) => {
      return new Card(suit, rank);
    });
  });
}
