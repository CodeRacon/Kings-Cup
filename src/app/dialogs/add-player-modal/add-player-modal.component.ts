// App Imports
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Game } from '../../models/gameData';
import { CommonModule } from '@angular/common';

// MaterialDesign Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-player-modal',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDialogModule,

    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    //
    CommonModule,
  ],
  templateUrl: './add-player-modal.component.html',
  styleUrl: './add-player-modal.component.scss',
})
export class AddPlayerModalComponent {
  newPlayerData = { name: '', avatar: '' };
  game: Game = new Game();

  constructor(public dialogRef: MatDialogRef<AddPlayerModalComponent>) {}

  selectAvatar(avatar: string) {
    this.newPlayerData.avatar = avatar;
  }

  onNoClick(): void {
    this.dialogRef.close();
    document.body.focus();
  }
}
