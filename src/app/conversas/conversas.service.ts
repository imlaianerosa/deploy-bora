import { Injectable } from '@angular/core';
import { BoraStore } from '../store/bora.store';
import { HttpClient } from '@angular/common/http';
import { Observable, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConversasService {
  GET_MENSAGEM = 'https://tg-bora-api.vercel.app/getmensagembyId/';
  private readonly APIUSUARIO =
  'https://tg-bora-api.vercel.app/getusuariosbyid/';


  constructor(private http: HttpClient, private boraStore: BoraStore) {}

  getMessages(): Observable<any> {
    return this.http
      .get<any[]>(`${this.GET_MENSAGEM}${this.boraStore.getIdUsuarioLogado()}`)
      .pipe(take(1));
  }

  getUserById(id: string){
    return this.http.get<any[]>(`${this.APIUSUARIO}${id}`).pipe(tap(console.log));
  }
}
