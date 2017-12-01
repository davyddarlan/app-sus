import { Component } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Httpd, HttpdOptions } from '@ionic-native/httpd';
import { File } from '@ionic-native/file';
import { Persistence } from './../classes/persistence/persistence';
import { Extra } from './../classes/extra/extra';
import { Login } from './../classes/login/login';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  /*private options: HttpdOptions = {
    www_root: this.file.externalApplicationStorageDirectory.replace('file://', ''),
    localhost_only: true
  };*/

  constructor(
    platform: Platform, 
    private statusBar: StatusBar, 
    private splashScreen: SplashScreen, 
    private httpd: Httpd,
    private file: File,
    private persistence: Persistence,
    private extra: Extra,
    private login: Login
  ) {
    platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#00b1f0');
      this.splashScreen.hide();
    });

    //this.httpd.startServer(this.options).subscribe((data) => {});

    if (!this.login.isLoged()) {
      this.rootPage = HomePage;
    } else {
      this.rootPage = LoginPage;
    }

    //verificar todas as ações que acontecem nos recursos educacionais
    window.addEventListener('message', (response) => {
      if (response.data == 'open') {
        response.source.postMessage('remove', 'http://localhost:8888');
      }
    });
  }
}

