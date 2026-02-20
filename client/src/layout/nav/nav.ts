import {Component, inject, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AccountService} from '../../core/services/account-service';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {ToastService} from '../../core/services/toast-service';
import {themes} from '../theme';

@Component({
  selector: 'app-nav',
  imports: [
    FormsModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit {
  protected accountService = inject(AccountService);
  protected creds: any = {};
  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'dark');
  protected themes = themes;
  private router = inject(Router);
  private toast = inject(ToastService);

  ngOnInit() {
    document.documentElement.setAttribute('data-theme', this.selectedTheme());
  }

  login() {
    this.accountService.login(this.creds).subscribe({
      next: () => {
        this.toast.success('Logged in successfully.');
        this.router.navigateByUrl('/members');
        this.creds = {};
      },
      error: error => {
        this.toast.error(error.error);
      }
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

  handleSelectedTheme(theme: string) {
    this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);
    // Setting selected theme
    document.documentElement.setAttribute('data-theme', theme);

    // To close the list of displayed themes
    const elem = document.activeElement as HTMLDivElement;
    if (elem) {
      elem.blur();
    }
  }
}
