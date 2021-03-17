import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss']
})
export class AuthDialogComponent implements OnInit {

  public loading = false;
  public invalid = false;
  public code: string;

  constructor(
    public dialogRef: MatDialogRef<AuthDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: { code: string},
    private authService: AuthService,
  ) {
    this.code = data.code;
  }

  ngOnInit(): void {
  }

  getNewCode(): void {
    this.loading = true;
    this.authService.getNewCode().subscribe(() => {
      this.loading = false;
      this.dialogRef.close();
    });
  }

  saveCode(): void {
    console.log('saving code:', this.code);
    this.loading = true;
    this.authService.setCode(this.code).subscribe(result => {
      this.loading = false;
      this.invalid = !result;
      if (result) {
        this.dialogRef.close();
      }
    });
  }

  updateCode(code: string) { this.code = code;}

}
