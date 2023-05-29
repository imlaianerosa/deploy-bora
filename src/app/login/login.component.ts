import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { loginGet } from './login';
import { BoraStore } from '../store/bora.store';
import { takeUntil } from 'rxjs';
import { BaseBoraComponent } from '../shared/components/base-bora/base-bora.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseBoraComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  submitted = false;
  idUsuario: any;
  mostrarModal = false;
  erro: string;
  constructor(
    private router: Router,
    private loginService: LoginService,
    private boraStore: BoraStore
  ) {
    super();
  }

  ngOnInit(): void {}

  putAlteraSenha() {
    if (this.form.controls.email) {
      this.loginService
        .putEsqueciMinhaSenha(this.form.controls.email.value)
        .subscribe(
          (success) => this.openModalSucesso(),
          (error) => this.openModalFalha()
        );
    }
  }

  postLogin() {
    const body = {
      email: this.form.controls.email.value,
      senha: this.form.controls.senha.value,
    };
    this.loginService.getLogin(body).subscribe((id) => {
      console.log(id);
      this.idUsuario = id;
      console.log(id);
      setTimeout(() => {
        this.boraStore.setIdUsuarioLogado(this.idUsuario);
        setTimeout(() => {
          if (this.idUsuario) {
            this.goToFeed();
          } else {
            this.openModalFalhaLogin();
          }
        }, 500);
      }, 1000);
    });
  }

  backBtn() {
    this.router.navigate(['/inicial']);
  }

  goToFeed() {
    this.router.navigate(['/feed']);
  }

  openModalSucesso() {
    this.erro = 'E-mail de redefinição de senha enviado.';
    this.mostrarModal = true;
  }

  openModalFalha() {
    this.erro = 'Erro ao tentar redefinir senha :(';
    this.mostrarModal = true;
  }

  openModalFalhaLogin() {
    this.erro = 'Usuário ou senha incorreta';
    this.mostrarModal = true;
  }

  closeModal() {
    this.mostrarModal = false;
  }
}
