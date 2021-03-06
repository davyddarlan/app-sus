import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams , AlertController, Content } from 'ionic-angular';
import { PopoverController, ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { AppCommunication } from '../../classes/appCommunication/appCommunication';
import { MServer } from '../../classes/mserver/mserver';

import { Itens } from '../../classes/itens/itens';
import { RessourcePage } from '../ressource/ressource';
import { Item } from '../../classes/item/item';
import { Transfer } from '../../classes/transfer/transfer';
import { MenuPage } from '../menu/menu';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private title: string = 'App SUS';
  private static countDonwload: number = 0;
  @ViewChild(Content) content: Content;

  constructor(
    private itens: Itens, 
    private transfer: Transfer,
    private nav: NavController,
    private alert: AlertController,
    private popoverCtrl: PopoverController,
    private toastCtrl: ToastController,
    private network: Network,
    private appCommunication: AppCommunication,
    private mserver: MServer
  ) {}

  ngOnInit() {
    this.transfer.on().subscribe(() => {
      HomePage.countDonwload--;
    }); 
    this.content.resize();
  }

  public menu(myEvent): void {
    let popover = this.popoverCtrl.create(MenuPage);
    popover.present({
      ev: myEvent
    });
  }

  public openRessource(item: Item): void {
    if (item.getStatus() === 'ABRIR') {
      this.nav.push(RessourcePage, {
        id: item.getId(),
        title: item.getTitle()
      });
    }
  }

  public download(item: Item): void {
    //modelo de teste
    this.mserver.on().subscribe((data) => {
      alert(JSON.stringify(data));
    });

    this.appCommunication.setState([{
      log: "ITEM",
      Datetime: "2015-08-04 22:23:54.586-0300",
      item: 1,
      acao: "BAIXAR",
      complemento: 1546
    }]);

    if (!Item.getRefresh()) {
      this.transfer.download(item);
      HomePage.countDonwload++;
    } else {
      this.toastCtrl.create({
        message: 'Aguarde a atualização da lista.',
        duration: 2000,
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: 'ok'
      }).present();
    }
  }

  public cancel(item: Item): void {
    this.transfer.cancel(item);
    HomePage.countDonwload--;
  } 

  public remove(item: Item): void {
    this.alert.create({
      title: 'Remover',
      message: `Você deseja remover o recurso educacional ${ item.getTitle() }?`,
      buttons: [{ text: 'Sim', handler: () => { this.transfer.remove(item); } }, { text: 'Não' }]
    }).present();
  }

  public refresh(refresher: any): void {
    if (this.network.type != 'none') {
      if (HomePage.countDonwload <= 0) {
        Item.setRefresh(true);
        this.itens.requestItens();
        this.itens.on().subscribe((data) => {
          Item.setRefresh(false);
          refresher.complete();
        });
      } else {
        refresher.complete();
        this.toastAlert('Aguarde os recursos serem baixados para atualizar a lista.', 2000);
      }
      setTimeout(() => {
        refresher.complete();
      }, 4000);
    } else {
      refresher.complete();
      this.toastAlert('Não foi possível atualizar a lista, verifique se você está conectado em um rede', 2000);
    }
  }

  private toastAlert(message: string, time: number): void {
    this.toastCtrl.create({
      message: message,
      duration: time,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'ok'
    }).present();
  }
 }
