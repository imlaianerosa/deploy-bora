import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseBoraComponent } from '../shared/components/base-bora/base-bora.component';
import { ConversasService } from './conversas.service';
import { BoraStore } from '../store/bora.store';

@Component({
  selector: 'app-conversas',
  templateUrl: './conversas.component.html',
  styleUrls: ['./conversas.component.scss'],
})
export class ConversasComponent extends BaseBoraComponent {
  menuOpen = false;
  mensagens: any;
  pessoaConversa: any[] = [];
  nomeUsu: any
  fotoUsu: any

  constructor(
    private router: Router,
    private service: ConversasService,
    private boraStore: BoraStore
  ) {
    super();
  }

  ngOnInit(): void {
    this.service.getMessages().subscribe((dados: any[]) => {
      this.mensagens = dados;
    });

    this.listarUser()
  }

  async listarUser() {
    await this.service.getMessages().subscribe(async (dados: any[]) => {
      this.mensagens = dados;
      const idUsuarioLogado = this.boraStore.getIdUsuarioLogado();
      const idsUsuarios: any[] = []; 
      await this.mensagens.forEach((mensagem: { idUsuario: any; idUsuDestino: any; }) => {
        const remetente = mensagem.idUsuario;
        const destinatario = mensagem.idUsuDestino;
        if ((remetente === idUsuarioLogado) && (!idsUsuarios.includes(destinatario))) {
          idsUsuarios.push(destinatario);
        } else if ((destinatario === idUsuarioLogado) && (!idsUsuarios.includes(remetente))) {
          idsUsuarios.push(remetente);
        }
      })
      setTimeout(async () => {
        for (let i = 0; i < idsUsuarios.length; i++) {
          const idUsuario = idsUsuarios[i];
          await this.service.getUserById(idUsuario).subscribe(usu => {
            this.pessoaConversa.push(usu[0]);
          });
        }
      }, 900);
    });
  }

  goToChat() {
    this.router.navigate(['/chat']);
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

  public toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  exit() {
    this.router.navigate(['/']);
    this.onDestroy;
  }
}
