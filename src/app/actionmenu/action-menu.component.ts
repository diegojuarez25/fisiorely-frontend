import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.css']
})
export class ActionMenuComponent {
  constructor(
    public dialogRef: MatDialogRef<ActionMenuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onEdit(): void {
    this.dialogRef.close('edit');
  }

  onDelete(): void {
    this.dialogRef.close('delete');
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
