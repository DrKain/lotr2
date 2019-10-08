import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { GameService } from '../game.service';
import { Store } from '@ngxs/store';
import { Logout } from '../../stores';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public isMenuVisible: boolean;
  public menuItems = [
    {
      name: 'Game',
      handler: () => {}
    },
    {
      name: 'Windows',
      handler: () => {}
    },
    {
      name: 'Macros',
      handler: () => {}
    },
    { },
    {
      name: 'Log out',
      handler: () => {
        this.toggleMenu();
        this.socketService.tryDisconnect();
        this.socketService.init();
        this.store.dispatch(new Logout(true));
      }
    }
  ];

  constructor(
    private store: Store,
    public socketService: SocketService,
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

}
