import {Component, inject, OnInit} from '@angular/core';
import {MemberService} from '../../../core/services/member-service';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {Member} from '../../../types/member';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-member-detail',
  imports: [
    AsyncPipe
  ],
  templateUrl: './member-detail.html',
  styleUrl: './member-detail.css',
})
export class MemberDetail implements OnInit {
  protected member$?: Observable<Member>;
  private readonly memberService = inject(MemberService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit() {
    this.member$ = this.loadMember();
  }

  loadMember() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }
    return this.memberService.getMember(id);
  }
}
