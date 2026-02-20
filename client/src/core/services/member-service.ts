import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Member, Photo} from '../../types/member';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'members');
  }

  getMember(id: string): Observable<Member> {
    return this.http.get<Member>(this.baseUrl + 'members/' + id);
  }

  getMemberPhotos(id: string) {
    return this.http.get<Photo[]>(this.baseUrl + 'members/' + id + '/photos');
  }
}
