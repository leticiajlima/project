import { Component, OnInit, OnDestroy } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { CadastroclienteComponent } from '../cadastrocliente/cadastrocliente.component';
import { ClientesService } from '../servicos/cliente/clientes.service';
import { Observable, Subscription, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';
import { Cliente } from '../models/cliente';
import { Page } from '../models/page';

@Component({
  selector: 'app-listagemcliente',
  templateUrl: './listagemcliente.component.html',
  styleUrls: ['./listagemcliente.component.scss']
})

export class ListagemclienteComponent implements OnInit {

  paginaAtual: number = 0;
  paginaCartoes: Page<Cliente> = { content: [], totalPages: 0, totalElements: 0 };
  cliente: Cliente[] = [];

  constructor(
    private clienteService: ClientesService,
    // private dialog: MatDialog,
    // private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.carregarCliente();
  }

  carregarCliente(): void {
    this.clienteService.listar(this.paginaAtual).subscribe(
      (page: Page<Cliente>) => {
        this.paginaCartoes = page;
        this.cliente = page.content;
        console.log('Página de Cartões:', this.cliente);
      },
      (erro) => {
        console.log("erro");
      }
    );
  }


  // editarCliente(cliente: any) {
  //   const dialogRef = this.dialog.open(CadastroclienteComponent, {
  //     width: '400px',
  //     data: cliente
  //   });


  }

  // excluirCliente(cliente: any) {
  //   const confirmacao = confirm(`Deseja realmente excluir o cliente ${cliente.nome}?`);
  //   if (confirmacao) {
  //     // Verifica se cliente.id não é undefined antes de usá-lo
  //     if (cliente.id !== undefined) {
  //       this.clienteService.deletarCliente(cliente.id).subscribe(
  //         () => {
  //           this.snackBar.open('Cliente excluído com sucesso', 'Fechar', {
  //             duration: 3000
  //           });
  //           // Remover o cliente da lista
  //           this.listaCliente = this.listaCliente.filter(c => c.id !== cliente.id);
  //         },
  //         (error: any) => {
  //           console.error('Erro ao excluir o cliente:', error);
  //           this.snackBar.open('Erro ao excluir o cliente', 'Fechar', {
  //             duration: 3000
  //           });
  //         }
  //       );
  //     } else {
  //       console.error('ID do cliente é undefined');
  //       this.snackBar.open('ID do cliente é undefined', 'Fechar', {
  //         duration: 3000
  //       });
  //     }
  //   }
  // }

  // ngOnDestroy() {
  //   // Garante que a assinatura seja cancelada ao destruir o componente
  //   this.clienteSubscription.unsubscribe();
  // }