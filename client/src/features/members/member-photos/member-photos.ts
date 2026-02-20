import {Component, inject} from '@angular/core';
import {MemberService} from '../../../core/services/member-service';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {Photo} from '../../../types/member';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-member-photos',
  imports: [
    AsyncPipe
  ],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos {
  protected photos$?: Observable<Photo[]>;
  private readonly memberService = inject(MemberService);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (memberId) {
      this.photos$ = this.memberService.getMemberPhotos(memberId);
    }
  }

  get photoMocks() {
    return Array.from({length: 10}, (_, i) => ({
      url: '/user.png'
    }))
  }
}
