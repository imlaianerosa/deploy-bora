import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FeedService } from './feed.service';
import { BoraStore } from '../store/bora.store';
import { FeedResponse } from './feed';
import { Observable, forkJoin, tap } from 'rxjs';
import { BaseBoraComponent } from '../shared/components/base-bora/base-bora.component';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../state/bora.state';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent extends BaseBoraComponent {

  
  mostrarPerfil: boolean = false;
  eventos: FeedResponse [] = [];
  usuarios: any[] = [];
  dadoUsuario: any;
  index: number;
  public menuOpen = false;
  fotoUser: any;
  nomeUser: any;
  linkedin: any;
  email: any;
  // usuarios: any;
  usuariosFoto: any;
  perfiil: any;
  load = true;
  private readonly APIUSUARIO =
    'https://tg-bora-api.vercel.app/getusuariosbyId/';

  constructor(
    private router: Router,
    private feedService: FeedService,
    private boraStore: BoraStore,
    private http: HttpClient
  ) {
    super();
  }

  ngOnInit(index: number): void {
    this.feedService.getEventos().subscribe((dados: any[]) => {
      setTimeout(() => {
        this.eventos = dados;
        this.load = false;
      }, 2000);
      }, (error) => {
        this.load = false;
      });

    this.feedService.getEventos().subscribe(publicacoes => {
      this.eventos = publicacoes;
      setTimeout(() => {
        for(let i = 0; i < publicacoes.length; i++) {
          const idUsuario = publicacoes[i].idUsuario;
          this.feedService.getDadosUsuarios(idUsuario).subscribe(usuario => {
            this.usuarios[i] = usuario[0];
          });
          setTimeout(() => {
            this.load = false;
          }, 2000);
        }
      }, 1);
    });
  }
  

  onItemClick(index: number): void {
    this.boraStore.setIdUsuarioEvento(this.eventos[index].idUsuario);
    this.router.navigate(['/chat']);
  }

  setDadosDoUsuario(index: number) {
    const id = this.eventos[index].idUsuario;
    this.feedService
      .getDadosUsuarios(id)
      .subscribe((dados) => (this.dadoUsuario = dados));
    setTimeout(() => {
      this.nomeUser = this.dadoUsuario[0].nome;
      this.linkedin = this.dadoUsuario[0].linkedin;
      this.email = this.dadoUsuario[0].email;
      this.fotoUser = this.dadoUsuario[0].fotoPerfil;
      this.openModal();
    }, 800);
  }

  openModal() {
    this.mostrarPerfil = true;
  }

  closeModal() {
    this.mostrarPerfil = false;
  }

  public toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  goToFeed() {
    this.router.navigate(['/feed']);
  }

  goToEdit() {
    this.router.navigate(['/perfil']);
  }

  goToConversas() {
    this.router.navigate(['/conversas']);
  }

  goToRegisterEvent() {
    this.router.navigate(['/evento']);
  }

  goToChat() {
    this.router.navigate(['/chat']);
  }

  exit() {
    this.router.navigate(['/']);
    this.onDestroy;
  }


}
