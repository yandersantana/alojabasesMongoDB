import { Component, HostBinding } from '@angular/core';
import { AuthService, ScreenService, AppInfoService } from './shared/services';
import { ConnectionService } from 'ng-connection-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  @HostBinding('class') get getClass() {
    return Object.keys(this.screen.sizes).filter(cl => this.screen.sizes[cl]).join(' ');
  }

  constructor(private authService: AuthService, private screen: ScreenService, public appInfo: AppInfoService, private connectionService:ConnectionService) {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if(this.isConnected){
      this.status = "ONLINE";
      } else {
      this.status = "No hay internet"
      }
      alert(this.status);
      });
   }

  isAutorized() {
    return this.authService.isLoggedIn;
  }

  
  title = 'internet-connection-check';
  status = 'ONLINE'; //initializing as online by default
  isConnected = true;


  formatsDateTest: string[] = [
    'dd/MM/yyyy'
    
    ];
  
  dateNow : Date = new Date();
  dateNowISO = this.dateNow.toISOString();
  dateNowMilliseconds = this.dateNow.getTime();


}
