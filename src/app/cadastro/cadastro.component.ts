import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CadastroService } from './cadastro.service';
import { Usuarios } from './cadastro';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent {
  form = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    linkedin: new FormControl('', Validators.required),
    senha: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)/),
    ]),
    fotoPerfil: new FormControl('', Validators.required),
  });
  mostrarModal = false;
  base64: any;
  dadosUsuarios: Usuarios;
  idUsuario: any;
  erro : string;

  constructor(
    private router: Router,
    private cadastroService: CadastroService
  ) {}

  ngOnInit(): void {}

  onInputChanged(event: any) {
    let targetEvent = event.target;
    let file: Blob = targetEvent.files[0];
    let fileReader: FileReader = new FileReader();

    fileReader.onload = (e) => {
      this.base64 = fileReader.result;
    };
    fileReader.readAsDataURL(file);
  }

  postUser() {
    this.dadosUsuarios = {
      nome: this.form.controls.nome.value,
      email: this.form.controls.email.value,
      linkedin: this.form.controls.linkedin.value,
      senha: this.form.controls.senha.value,
      fotoPerfil: this.base64,
    };

    if (this.form.valid) {
      this.cadastroService.postUsuarios(this.dadosUsuarios).subscribe(
        () => {
          this.goToLogin()
        },
        (error) => {
          this.erro = 'Ops! Ocorreu um erro, revise seus dados e tente novamente.';
          this.mostrarModal = true;
        }
      );
    } else if (this.form.invalid) {
      this.openModalFalha();
    }
  }

  sucesso() {
    this.goToLogin();
  }

  openModalFalha() {
    this.erro =
      'Revise seus dados. Lembre-se que você deve informar seu nome completo, e-mail, seu link do LinkedIn, uma foto e sua senha que deve conter no mínimo 8 caracteres, contendo um carecter especial, uma letra maiúscula, uma minúscula e um número.';
    this.mostrarModal = true;
  }

  closeModal() {
    this.mostrarModal = false;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  backBtn() {
    this.router.navigate(['/inicial']);
  }
}
