import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { ChatMode } from '../../../../interfaces';
import { HideWindow, LogCurrentCommandInHistory, SetActiveWindow, SetChatMode, SetCurrentCommand, ShowWindow } from '../../../../stores';
import { GameService } from '../../../services/game.service';
import { OptionsService } from '../../../services/options.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-command-line',
  templateUrl: './command-line.component.html',
  styleUrls: ['./command-line.component.scss']
})
export class CommandLineComponent implements OnInit, OnDestroy {

  @ViewChild('commandInput', { read: ElementRef }) public commandInput: ElementRef;

  public currentCommand = '';

  public placeholderTexts: { [key in ChatMode]: string } = {
    cmd: 'Enter your command here...',
    say: 'Talk to local players here...',
    party: 'Talk to your party here...',
    global: 'Talk to the lobby here...'
  };

  public nextModes: { [key in ChatMode]: ChatMode } = {
    cmd: 'say',
    say: 'party',
    party: 'global',
    global: 'cmd'
  };

  command$: Subscription;

  private globalListener: (ev) => void;
  private sendListener: (ev) => void;

  private curIndex = -1;

  private get isCmdActive() {
    return this.commandInput.nativeElement === document.activeElement;
  }

  constructor(
    private store: Store,
    private optionsService: OptionsService,
    public gameService: GameService
  ) { }

  ngOnInit() {
    this.command$ = this.gameService.currentCommand$.subscribe(command => {
      this.currentCommand = command;

      if (command) {
        this.store.dispatch(new ShowWindow('commandLine'));
        this.store.dispatch(new SetActiveWindow('commandLine'));
        this.focusInput();
      }
    });

    this.globalListener = (ev) => {

      // allow tab to change modes
      if (ev.key === 'Tab' && this.isCmdActive) {
        this.store.selectOnce(state => state.settings.chatMode)
          .subscribe(chatMode => {
            this.updateChatMode(this.nextModes[chatMode]);
          });

        ev.stopPropagation();
        ev.preventDefault();
        return;
      }

      // allow enter to unfocus chat if there is no command
      if (ev.key === 'Enter' && this.isCmdActive && !this.currentCommand) {

        if (this.optionsService.enterToggleCMD) {
          this.store.dispatch(new HideWindow('commandLine'));
        }

        this.commandInput.nativeElement.blur();
        ev.preventDefault();
        ev.stopPropagation();
        return;
      }

      // block text entry here if there is a different text input active
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

      // TODO: check if there is a macro that matches the key we input, if so, swallow

      // if we're not hitting enter, we don't care about this
      if (ev.key !== 'Enter') return;

      if (this.optionsService.enterToggleCMD) {
        this.store.dispatch(new ShowWindow('commandLine'));
      }

      this.store.dispatch(new SetActiveWindow('commandLine'));
      this.focusInput();
    };

    // TODO: right click send option
    this.sendListener = (ev) => {
      if (environment.production) {
        ev.preventDefault();
      }
      if (!this.optionsService.rightClickSend) return;
      this.sendCommand(ev);
    };

    document.addEventListener('keydown', this.globalListener);
    document.addEventListener('contextmenu', this.sendListener);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.globalListener);
    document.removeEventListener('contextmenu', this.sendListener);
  }

  updateChatMode(newMode) {
    this.store.dispatch(new SetChatMode(newMode));
  }

  updateCommand(newCommand) {
    this.store.dispatch(new SetCurrentCommand(newCommand));
  }

  sendCommand(ev) {

    let currentCommand = (this.currentCommand || '').trim();
    if (!currentCommand) return;

    ev.preventDefault();
    ev.stopPropagation();

    this.store.selectOnce(state => state.settings.chatMode)
      .subscribe((chatMode: ChatMode) => {

        const reset = () => {
          this.store.dispatch(new LogCurrentCommandInHistory());
          this.store.dispatch(new SetCurrentCommand(''));
        };

        const doCommand = (commandToDo: string) => {
          this.curIndex = -1;

          this.gameService.sendCommandString(commandToDo.trim());
          reset();

          (document.activeElement as HTMLElement).blur();
        };

        const shouldBypassOthers = currentCommand.startsWith('#');

        if (!shouldBypassOthers && chatMode === 'say') {
          this.gameService.sendCommandString(`!say ${currentCommand}`);
          reset();
          return;
        }

        if (!shouldBypassOthers && chatMode === 'party') {
          this.gameService.sendCommandString(`!partysay ${currentCommand}`);
          reset();
          return;
        }

        if (!shouldBypassOthers && chatMode === 'global') {
          this.gameService.sendCommandString(`!lobbysay ${currentCommand}`);
          reset();
          return;
        }

        if (shouldBypassOthers) {
          currentCommand = currentCommand.substring(1);
        }

        if (currentCommand === '.') {
          this.store.selectOnce(state => state.settings.commandHistory)
            .subscribe(history => {
              const command = history[0];
              if (!command) return;

              this.updateCommand(command);
              doCommand(command);
            });

          return;
        }

        doCommand(currentCommand);
      });
  }

  searchCommandHistory(ev, diff: number) {
    ev.preventDefault();

    this.store.selectOnce(state => state.settings.commandHistory)
      .subscribe(history => {
        const newIndex = diff + this.curIndex;
        if (newIndex <= -2 || newIndex >= history.length) return;

        this.curIndex += diff;

        let curCommand = history[newIndex];
        if (this.curIndex <= -1 || !history[newIndex]) {
          curCommand = '';
        }

        this.store.dispatch(new SetCurrentCommand(curCommand));
      });
  }

  private focusInput() {
    setTimeout(() => {
      this.commandInput.nativeElement.focus();
    }, 0);
  }

}
