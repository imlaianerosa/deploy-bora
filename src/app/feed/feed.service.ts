import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeedResponse, Usuario } from './feed';
import { Observable, map, switchMap, tap } from 'rxjs';
import { BoraStore } from '../store/bora.store';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private readonly APIEVENTO = 'https://tg-bora-api.vercel.app/geteventos';

  private readonly APIUSUARIO =
    'https://tg-bora-api.vercel.app/getusuariosbyid/';

  eventoDado: FeedResponse;

  constructor(private http: HttpClient) {}

  getEventos() {
    return this.http.get<FeedResponse[]>(this.APIEVENTO).pipe(tap(console.log));
  }

  getDadosUsuarios(id: string) {
    return this.http
      .get<any[]>(`${this.APIUSUARIO}${id}`)
      .pipe(tap(console.log));
  }

  getUserById(data: string) {
    return this.http
      .get<any[]>(`${this.APIUSUARIO}${data}`)
      .pipe(tap(console.log));
  }
}
