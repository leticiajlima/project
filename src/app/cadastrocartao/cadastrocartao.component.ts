import { Component, ElementRef, OnInit, ViewChild  } from '@angular/core';
import { CartaoserviceService } from '../servicos/cartao/cartao.service';
import { Cartao } from '../models/cartao';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { Cliente } from '../models/cliente';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-cadastrocartao',
  templateUrl: './cadastrocartao.component.html',
  styleUrls: ['./cadastrocartao.component.scss'],
})
export class CadastrocartaoComponent implements OnInit {
  
  clienteControl = new FormControl();
  clientesFiltrados$: Observable<any[]>;
  clienteSelecionado!: number;
  clienteCartao:Cartao[] = [];

  constructor(private cartaoService: CartaoserviceService, private router: Router, private _snackBar: MatSnackBar) {
    
    this.clientesFiltrados$ = this.clienteControl.valueChanges.pipe(
      startWith(''),
      switchMap(value => this.cartaoService.buscarClientesAutocomplete(value))
    );
    
  }

  ngOnInit(): void {
    this.clientesFiltrados$ = this.clienteControl.valueChanges.pipe(
      startWith(''),
      switchMap(value => this.cartaoService.buscarClientesAutocomplete(value))
    );
  }
  
  exibirNomeEId(cliente: Cliente): string {
    return cliente ? `${cliente.nome} (ID: ${cliente.id})` : '';
  }

  selecionarCliente(cliente: Cliente): void {
    if (cliente) {
      this.clienteSelecionado = cliente.id;
      console.log(this.clienteSelecionado);
       // Salva o ID do cliente selecionado na variável
    } else {
      this.clienteSelecionado = 0; // Limpa o ID se nenhum cliente for selecionado
    }
  }

  @ViewChild('limiteInput') limiteInput!: ElementRef<HTMLInputElement>;
  limiteCliente!: number;

  ngAfterViewInit(): void {
    if (this.limiteInput && this.limiteInput.nativeElement) {
      console.log('Elemento limiteInput encontrado:', this.limiteInput.nativeElement);
    } else {
      console.error('Elemento limiteInput não encontrado.');
    }
  }

  limiteEscolhido(event: any): void {
    this.limiteCliente = event.target.value;
    console.log('Limite:', this.limiteCliente);
    // Faça o que for necessário com o valor do limite
  }

  submitForm() {
    this.cartaoService.cadastrar(this.clienteSelecionado, this.limiteCliente).subscribe(dados => {
      this.clienteCartao = dados;
      this.exibirSnackBarErro("Cartão cadastrado com sucesso!");
      this.router.navigate(['/listagemcartao']);
    },(erro) => {
      this.exibirSnackBarErro("Erro! Tente novamente.");
    }
    );
    
  }

  private exibirSnackBarErro(mensagem: string): void {
    this._snackBar.open(mensagem, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
