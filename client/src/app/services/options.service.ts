import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { GameOption } from '../../interfaces';
import { SettingsState } from '../../stores';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  @Select(SettingsState.options) options$: Observable<Record<GameOption, any>>;

  private opts: Partial<Record<GameOption, any>> = {};

  // interface options
  public get rightClickSend(): boolean {
    return this.opts[GameOption.RightClickCMDSend];
  }

  public get enterToggleCMD(): boolean {
    return this.opts[GameOption.EnterToggleCMD];
  }

  public get classicNPCChat(): boolean {
    return this.opts[GameOption.NoNPCModals];
  }

  public get autoAttack(): boolean {
    return this.opts[GameOption.AutoAttack];
  }

  public get hideLobbyInGame(): boolean {
    return this.opts[GameOption.HideLobbyWhilePlaying];
  }

  public get lockWindows(): boolean {
    return this.opts[GameOption.LockWindows];
  }

  public get suppressZeroDamage(): boolean {
    return this.opts[GameOption.SuppressZeroDamage];
  }

  public get suppressOutgoingDoT(): boolean {
    return this.opts[GameOption.SuppressOutgoingDoT];
  }

  public get stopItemAnimations(): boolean {
    return this.opts[GameOption.NoItemAnimations];
  }

  public get pinLastTarget(): boolean {
    return this.opts[GameOption.PinLastTarget];
  }

  public get canShowDyingBorder(): boolean {
    return this.opts[GameOption.DyingBorderWidth] !== 0;
  }

  public get dyingBorderWidth(): string {
    return this.opts[GameOption.DyingBorderWidth] + 'px';
  }

  public get sortFriendlies(): string {
    return this.opts[GameOption.ShouldSortFriendly];
  }

  public get sortByDistance(): string {
    return this.opts[GameOption.ShouldSortDistance];
  }

  // sound options
  public get musicVolume(): number {
    return (this.opts[GameOption.SoundMusicVolume] || 0) / 100;
  }

  public get sfxVolume(): number {
    return (this.opts[GameOption.SoundSFXVolume] || 0) / 100;
  }

  public get playBGM(): boolean {
    return this.opts[GameOption.SoundBGM];
  }

  public get playSFX(): boolean {
    return this.opts[GameOption.SoundSFX];
  }

  public get nostalgicSound(): boolean {
    return this.opts[GameOption.SoundNostalgia];
  }

  constructor() {}

  init() {
    this.options$.subscribe(opts => {
      this.opts = opts;
    });
  }

}
