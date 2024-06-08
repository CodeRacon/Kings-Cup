export class Game {
  public players: { name: string; avatar: string }[] = [
    { name: 'Holger', avatar: '/assets/img/players/player1.png' },
    { name: 'Berthold', avatar: '/assets/img/players/player2.png' },
    { name: 'Gerhardt', avatar: '/assets/img/players/player3.png' },
    { name: 'Klaus', avatar: '/assets/img/players/player2.png' },
    { name: 'Birgit', avatar: '/assets/img/players/player1.png' },
  ];
  public currentPlayer: number = 0;
  public playedCards: string[] = [];
  public cardDeck: string[] = [];
  public revealedCard: {
    id: number;
    revealed: boolean;
    imgSrc: string;
  } | null = null;

  public currentCard: number = 52;
  public nextCard: number = this.currentCard - 1;

  /**
   * Initializes the game state by setting up the players, the current player index, and the played cards array.
   * It also initializes the card deck by calling the `initializeDeck()` and `shuffleArray()` methods.
   *
   * @constructor
   */
  constructor() {
    this.currentPlayer = 0;
    this.playedCards = [];
    this.initializeDeck();
    this.shuffleArray();
  }

  /**
   * Initializes the `cardDeck` array with the card images.
   * This method populates the `cardDeck` array with the file paths for all 52 cards in a standard playing card deck, organized by suit and rank.
   */
  initializeDeck() {
    for (let i = 1; i < 14; i++) {
      this.cardDeck.push(`/assets/img/card-deck/clubs-${i}.png`);
      this.cardDeck.push(`/assets/img/card-deck/diamonds-${i}.png`);
      this.cardDeck.push(`/assets/img/card-deck/hearts-${i}.png`);
      this.cardDeck.push(`/assets/img/card-deck/spades-${i}.png`);
    }
  }

  /**
   * Shuffles the `cardDeck` array in-place using the Fisher-Yates shuffle algorithm.
   * This method randomizes the order of the cards in the deck.
   */
  shuffleArray() {
    for (let i = this.cardDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cardDeck[i], this.cardDeck[j]] = [
        this.cardDeck[j],
        this.cardDeck[i],
      ];
    }
  }

  /**
   * Generates an array of card objects with their positions and rotations based on the provided radius and card count.
   *
   * @param radius - The radius of the circle around which the cards are positioned.
   * @param cardCount - The number of cards to generate.
   * @returns An array of card objects with properties `x`, `y`, `rotation`, `id`, `revealed`, and `imgSrc`.
   */
  generateCards(radius: number, cardCount: number) {
    const cards = [];
    for (let i = 0; i < cardCount; i++) {
      const angle = (i / cardCount) * 2 * Math.PI;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const rotation = (angle * 180) / Math.PI + 90;
      const id = i + 1;
      const imgSrc = this.cardDeck[i];

      cards.push({ x, y, rotation, id, revealed: false, imgSrc });
    }
    return cards;
  }

  /**
   * Reveals the current card and handles the logic for the revealed card.
   * If there is a previously revealed card, it is added to the `playedCards` array and removed from the `cards` array.
   * The current card is marked as revealed, and the `revealedCard` property is updated with the current card.
   * The `currentCard` and `nextCard` properties are updated based on the current card index.
   *
   * @param card - The current card being revealed.
   * @param cards - The array of all cards.
   */
  revealCard(
    card: { id: number; revealed: boolean; imgSrc: string },
    cards: { id: number; revealed: boolean; imgSrc: string }[]
  ) {
    if (card.id === this.currentCard) {
      if (this.revealedCard) {
        this.playedCards.push(this.revealedCard.imgSrc);
        cards.splice(cards.indexOf(this.revealedCard), 1);
      }

      card.revealed = true;
      this.revealedCard = card;

      this.currentCard--;
      if (this.currentCard > 0) {
        this.nextCard = this.currentCard;
      } else {
        this.nextCard = -1;
      }
    }
  }

  /**
   * Generates CSS transform styles for an element based on the provided position, rotation, and optional scale.
   *
   * @param x - The x-coordinate of the element's position.
   * @param y - The y-coordinate of the element's position.
   * @param rotation - The rotation angle of the element in degrees.
   * @param scale - The scale factor to apply to the element (default is 1).
   * @returns An object containing the CSS transform styles for the element.
   */
  getTransformStyles(x: number, y: number, rotation: number, scale = 1) {
    return {
      transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`,
    };
  }

  /**
   * Sets the CSS transform styles for a card based on its position, rotation, and whether it is the current card.
   *
   * @param card - An object containing the x-coordinate, y-coordinate, rotation, and id of the card.
   * @returns An object containing the CSS transform styles for the card.
   */
  setCardStyles(card: { x: number; y: number; rotation: number; id: number }) {
    if (card.id === this.currentCard) {
      return {
        ...this.getTransformStyles(card.x, card.y, card.rotation),
        filter: 'brightness(1) saturate(1)',
      };
    }
    return this.getTransformStyles(card.x, card.y, card.rotation);
  }

  /**
   * Sets the CSS transform styles for the first card in a game, taking into account whether the last card is being hovered over.
   *
   * @param card - An object containing the x-coordinate, y-coordinate, rotation, and id of the first card.
   * @param lastCardHovered - A boolean indicating whether the last card is being hovered over.
   * @param cardCount - The total number of cards in the game.
   * @returns An object containing the CSS transform styles for the first card.
   */
  setFirstCardStyles(
    card: { x: number; y: number; rotation: number; id: number },
    lastCardHovered: boolean,
    cardCount: number
  ) {
    if (lastCardHovered) {
      let i = card.id - 1;
      const lastCardAngle = (i / cardCount) * 2 * Math.PI;
      const lastCardX = 276 * Math.cos(lastCardAngle);
      const lastCardY = 276 * Math.sin(lastCardAngle);
      const lastCardRotation = (lastCardAngle * 180) / Math.PI + 90;

      return {
        ...this.getTransformStyles(
          lastCardX,
          lastCardY,
          lastCardRotation,
          1.0125
        ),
        filter: 'brightness(1.175) saturate(1.125)',
        cursor: 'pointer',
      };
    } else {
      return this.setCardStyles(card);
    }
  }
}
