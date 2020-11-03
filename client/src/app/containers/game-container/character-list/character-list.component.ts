import { Component, OnDestroy, OnInit } from '@angular/core';

import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

import { GameService } from '../../../game.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit, OnDestroy {

  constructor(
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}