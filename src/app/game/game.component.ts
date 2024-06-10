// App Imports
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Game } from '../models/gameData';
import { PlayerComponent } from '../player/player.component';
import { AddPlayerModalComponent } from '../dialogs/add-player-modal/add-player-modal.component';

// MaterialDesign Imports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    AddPlayerModalComponent,
    //
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  game: Game = new Game();

  /**
   * Initializes a new instance of the `Game` class and logs it to the console.
   * This method is called when a new game is started.
   */
  newGame() {
    this.game = new Game();
    console.log(this.game);
  }

  /**
   * An array of card objects, each with the following properties:
   * - `x`: the x-coordinate of the card
   * - `y`: the y-coordinate of the card
   * - `rotation`: the rotation angle of the card
   * - `id`: a unique identifier for the card
   * - `revealed`: a boolean indicating whether the card has been revealed
   * - `imgSrc`: the source URL of the card image
   */
  cards: {
    x: number;
    y: number;
    rotation: number;
    id: number;
    revealed: boolean;
    imgSrc: string;
  }[] = [];

  radius = 260;
  cardCount = 52;
  lastCardHovered = false;

  /**
   * Initializes a new game and generates the cards for the game.
   * This method is called when the component is initialized.
   */
  ngOnInit() {
    this.newGame();
    this.cards = this.game.generateCards(this.radius, this.cardCount);
  }

  /**
   * Sets the `lastCardHovered` flag to `true`, indicating that a card has been hovered over.
   * This method is used to track the last card that was hovered over, which is used to
   * determine the styles to apply to the first card in the game.
   */
  setHoverState() {
    this.lastCardHovered = true;
  }

  /**
   * Resets the `lastCardHovered` flag to `false`, indicating that no card is currently hovered over.
   * This method is used to track the last card that was hovered over, which is used to
   * determine the styles to apply to the first card in the game.
   */
  unsetHoverState() {
    this.lastCardHovered = false;
  }

  /**
   * Sets the styles for the first card in the game based on whether the last card was hovered over.
   *
   * @param card - An object containing the properties of the first card in the game, including its x-coordinate, y-coordinate, rotation angle, and unique identifier.
   * @returns An object containing the CSS styles to be applied to the first card in the game.
   */
  setFirstCardStyles(card: {
    x: number;
    y: number;
    rotation: number;
    id: number;
  }) {
    return this.game.setFirstCardStyles(
      card,
      this.lastCardHovered,
      this.cardCount
    );
  }

  /**
   * Reveals the specified card in the game.
   *
   * @param card - An object containing the card's ID, revealed state, and image source.
   */
  revealCard(card: { id: number; revealed: boolean; imgSrc: string }) {
    this.game.revealCard(card, this.cards);
  }

  /**
   * Determines whether the provided card is the next card in the game.
   *
   * If all cards have been revealed and none are currently revealed, the function
   * checks if the provided card is the last card in the `cards` array.
   *
   * Otherwise, the function checks if the provided card's ID matches the `nextCard`
   * property of the `game` object.
   *
   * @param card - An object containing the ID of the card to check.
   * @returns `true` if the provided card is the next card in the game, `false` otherwise.
   */
  isNext(card: { id: number }) {
    if (
      this.cards.length === this.cardCount &&
      !this.cards.some((c) => c.revealed)
    ) {
      return card.id === this.cards[this.cards.length - 1].id;
    }
    return card.id === this.game.nextCard;
  }

  /**
   * A box shadow style to be applied to a revealed card in the game.
   */
  boxShadow = ` -0.3px -0.3px 0.5px #312f2c40,
    -1.1px -1px 1.7px -0.8px #312f2c40,
    -2.7px -2.6px 4.2px -1.7px #312f2c40,
    -6.6px -6.3px 10.3px -2.5px #312f2c40`;

  /**
   * Calculates the styles for a revealed card in the game.
   *
   * The returned styles include the transform properties to position and rotate the card,
   * a transition for the transform, a brightness and saturation filter, and a box shadow.
   *
   * @returns An object containing the CSS styles for a revealed card.
   */
  setRevealedCardStyles() {
    return {
      ...this.game.getTransformStyles(-320, 512, 180, 1.25),
      transition: 'transform 0.875s ease',
      filter: 'brightness(1.175) saturate(1.125)',
      boxShadow: this.boxShadow,
    };
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddPlayerModalComponent, {});

    dialogRef.afterClosed().subscribe((newPlayer) => {
      if (newPlayer) {
        this.game.players.push(newPlayer);
      }
    });
  }
}
