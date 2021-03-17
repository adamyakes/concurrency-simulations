import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthDialogComponent } from './auth-dialog/auth-dialog.component';
import { AnimationService } from './services/animation.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  public code: string;
  public problems: {name: string; link: string}[] = [
    {
      name: 'Dining Philosophers',
      link: 'dp',
    },
    {
      name: 'Readers & Writers',
      link: 'readwrite'
    },
    {
      name: 'Bounded Buffer',
      link: 'boundedbuffer',
    },
    {
      name: 'Unisex Bathroom',
      link: 'unisex',
    }
  ];
  private subscription: Subscription;

  constructor(
    authService: AuthService,
    public dialog: MatDialog,
    private animationService: AnimationService,
    public router: Router,
  ) {
    this.subscription = authService.code.subscribe(code =>{
      this.code = code;
    });
  }

  codeClick(): void {
    this.dialog.open(AuthDialogComponent, {
      width: '500px',
      data: { code: this.code },
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  navMenuClick(): void {
    this.animationService.toggleSidebar.next();
  }
}
