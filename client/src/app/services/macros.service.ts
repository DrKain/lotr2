import { Injectable } from '@angular/core';
import { Select, Selector, Store } from '@ngxs/store';
import { combineLatest, interval, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ICharacter, IGame, IMacro, IMacroContainer, IPlayer } from '../../interfaces';
import { GameState, MacrosState, SetActiveMacro, SetCurrentCommand, SettingsState } from '../../stores';
import { GameService } from './game.service';

import * as allMacros from '../../assets/content/_output/macros.json';
import { OptionsService } from './options.service';
@Injectable({
  providedIn: 'root'
})
export class MacrosService {

  @Select(GameState.player) private player$: Observable<IPlayer>;
  @Select(GameState.inGame) private inGame$: Observable<boolean>;
  @Select(GameState.currentTarget) private currentTarget$: Observable<ICharacter>;
  @Select(SettingsState.activeWindow) private activeWindow$: Observable<string>;
  @Select(MacrosState.customMacros) private customMacros$: Observable<Record<string, IMacro>>;
  @Select(MacrosService.currentPlayerActiveMacro) private activeMacro$: Observable<IMacro>;

  private macroMap: Record<string, IMacro> = {};

  private activeWindow: string;

  private macroIgnoreWindows = {
    lobby: true, bank: true,
    shop: true, marketboard: true, party: true,
    commandLine: true, journal: true
  };

  @Selector([GameState, MacrosState])
  static currentPlayerMacros(gameState: IGame, macroState: IMacroContainer) {
    const player = gameState.player;
    if (!player) return null;

    return {
      activeMacro: macroState.activeMacros?.[player.username]?.[player.charSlot],
      activeMacroBars: macroState.activeMacroBars?.[player.username]?.[player.charSlot],
      macroBars: macroState.characterMacros?.[player.username]?.[player.charSlot]
    };
  }

  @Selector([GameState, MacrosState, MacrosState.allMacros])
  static currentPlayerActiveMacro(gameState: IGame, macroState: IMacroContainer, allPossibleMacros) {
    const player = gameState.player;
    if (!player) return null;

    return allPossibleMacros[macroState.activeMacros?.[player.username]?.[player.charSlot]];
  }

  constructor(
    private store: Store,
    private optionsService: OptionsService,
    private gameService: GameService
  ) {}

  public init() {
    this.activeWindow$.subscribe(w => this.activeWindow = w);
    this.customMacros$.subscribe(c => this.parseMacroMap(c));

    this.watchForMacros();
    this.autoAttackLoop();
  }

  public getMacroMatching(key: string): IMacro {
    if (!key) return null;
    return this.macroMap[key.toUpperCase()];
  }

  public buildMacroString(macro: IMacro): string {
    if (!macro.key) return '';
    const modifiers: any = macro.modifiers || {};

    let macroString = '';
    if (modifiers.alt) macroString = `ALT+`;
    if (modifiers.ctrl) macroString = `${macroString}CTRL+`;
    if (modifiers.shift) macroString = `${macroString}SHIFT+`;

    macroString = `${macroString}${macro.key.toUpperCase()}`;

    return macroString;
  }

  private parseMacroMap(macroMap: Record<string, IMacro>) {
    this.macroMap = {};

    const defaultMacros = Object.values(allMacros).filter(mac => (mac as any).isDefault);

    const allCheckableMacros = Object.values(macroMap).concat(defaultMacros);

    allCheckableMacros.forEach(macro => {
      if (!macro.key) return;
      this.macroMap[this.buildMacroString(macro)] = macro;
    });
  }

  private shouldCancelMacroEarly(macro: string) {
    return !(macro === 'CTRL+A' || macro === 'CTRL+C' || macro === 'CTRL+V');
  }

  private shouldIgnoreMacro() {
    if (document.getElementsByTagName('mat-dialog-container').length > 0) return true;

    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return true;

    if (this.macroIgnoreWindows[this.activeWindow]) return true;

    return false;
  }

  private watchForMacros() {
    const macroListener = (ev) => {
      if (this.shouldIgnoreMacro() || !ev || !ev.key) return;

      let builtMacro = '';
      if (ev.altKey) builtMacro = 'ALT+';
      if (ev.ctrlKey) builtMacro = `${builtMacro}CTRL+`;
      if (ev.shiftKey) builtMacro = `${builtMacro}SHIFT+`;

      builtMacro = `${builtMacro}${ev.key.toUpperCase()}`;

      // some macros need to be canceled early
      const shouldCancelMacroAlways = this.shouldCancelMacroEarly(builtMacro);
      if (shouldCancelMacroAlways) {
        ev.preventDefault();
        ev.stopPropagation();
      }

      const macro = this.macroMap[builtMacro];

      if (!macro) return;

      // but for convenience, if some are not bound, then we let them leak through and happen here instead
      if (!shouldCancelMacroAlways) {
        ev.preventDefault();
        ev.stopPropagation();
      }

      if (macro.mode === 'lockActivation') {
        this.store.dispatch(new SetActiveMacro(macro.name));
        return;
      }

      if (macro.mode === 'autoActivate') {
        this.gameService.sendCommandString(macro.macro);
        return;
      }

      this.store.dispatch(new SetCurrentCommand(`#${macro.macro}`));
    };

    document.addEventListener('keydown', macroListener);
  }

  private autoAttackLoop() {
    interval(1000)
      .pipe(switchMap(() => combineLatest([this.inGame$, this.player$, this.activeMacro$, this.currentTarget$])))
      .subscribe(([inGame, player, macro, target]) => {
        if (!inGame || !macro || !target || !this.optionsService.autoAttack || macro.ignoreAutoattackOption) return;
        if (this.gameService.hostilityLevelFor(player, target) !== 'hostile') return;

        this.gameService.sendCommandString(macro.macro, target.uuid);
      });
  }

}
