import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from './chat.service';
import { BoraStore } from '../store/bora.store';
import { BaseBoraComponent } from '../shared/components/base-bora/base-bora.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent extends BaseBoraComponent {
  form = new FormGroup({
    mensagem: new FormControl('', Validators.required),
  });

  dataHora: Date = new Date();
  idUsuDestino: any;
  menuOpen = false;
  mensagem: any;
  messages: any[];
  newMessage: string;
  mensagemEnviada: any;
  mensagemRecebida: any;
  dadoUsuarioMensagem: any;
  nomeUser: any;
  fotoUser: any;
  todas: any
  load = true

  constructor(
    private router: Router,
    private chatService: ChatService,
    public store: BoraStore,
    private cd: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    // this.getMessages();
    this.getDadosUser();
    this.getMensagem();
  }

  ngOnChanges() {
    this.getMensagem();
  }

  getDadosUser() {
    const idUserEvento = this.store.getIdUsuarioEvento();

    this.chatService
      .getDadosUsuarios(idUserEvento)
      .subscribe((dados) => (this.dadoUsuarioMensagem = dados));

    setTimeout(() => {
      this.nomeUser = this.dadoUsuarioMensagem[0].nome;
      this.fotoUser = this.dadoUsuarioMensagem[0].fotoPerfil;
    }, 1500);
  }

  getMensagem() {
    this.chatService
      .getMessages()
      .subscribe((dados) => {
        setTimeout(() => {
          this.load = false
        }, 2000);
        this.mensagem = dados
      })

    setTimeout(() => {
      this.todas = this.mensagem.filter(
        (mensagem: { idUsuario: any; idUsuDestino: any }) => {
          return (
            (mensagem.idUsuario === this.store.getIdUsuarioLogado() &&
              mensagem.idUsuDestino === this.store.getIdUsuarioEvento()) ||
            (mensagem.idUsuario === this.store.getIdUsuarioEvento() &&
              mensagem.idUsuDestino === this.store.getIdUsuarioLogado())
          );
        },
        setTimeout(() => {
          this.todas.sort((a: { dataHora: string | number | Date; }, b: { dataHora: string | number | Date; }) => {
            return new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime();
          })

        }, 1000)
      );
    }, 1000);
  }

  getMessages(): void {
    this.chatService
      .getMessages()
      .subscribe((messages) => (this.messages = messages));
    this.cd;
  }

  sendMessage(): void {
    this.chatService.sendMessage(this.newMessage).subscribe(() => {
      this.newMessage = '';
      this.getMessages();
    });
  }

  postMensagem() {
    this.idUsuDestino = this.store.getIdUsuarioEvento();
    const messageData = {
      mensagem: this.form.controls.mensagem.value,
      dataHoraEnvio: this.dataHora.toLocaleString(),
      idUsuDestino: this.idUsuDestino,
      idUsuario: this.store.getIdUsuarioLogado(),
    };
    if (this.form.valid) {
      this.chatService.sendMessage(messageData).subscribe(
        (success) => this.getMensagem(),
        (error) => console.error(error)
      );
      this.form.reset();
    }
  }

  goToChats() {
    this.router.navigate(['/conversas']);
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

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  exit() {
    this.router.navigate(['/']);
    this.onDestroy;
  }
}
