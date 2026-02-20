import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {filter} from 'rxjs';
import {Member} from '../../../types/member';
import {NotFound} from '../../../shared/errors/not-found/not-found';
import {AgePipe} from '../../../core/pipes/age-pipe';

@Component({
  selector: 'app-member-detail',
  imports: [
    RouterLink,
    RouterLinkActive,
    NotFound,
    RouterOutlet,
    AgePipe
  ],
  templateUrl: './member-detail.html',
  styleUrl: './member-detail.css',
})
export class MemberDetail implements OnInit {
  protected member = signal<Member | undefined>(undefined);
  protected title = signal<string | undefined>('Profile');
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit() {
    // We get member from the resolver based on the activated route
    this.route.data.subscribe({
      next: data => {
        this.member.set(data['member']);
      },
      error: error => {
        console.log(error);
      }
    })
    this.title.set(this.route.firstChild?.snapshot.title);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe({
      next: () => {
        this.title.set(this.route.firstChild?.snapshot.title);
      },
      error: err => {
        console.log(err);
      }
    })
  }
}
