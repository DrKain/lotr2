
import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { GameOption, ISettings } from '../interfaces';
import { AddAccount, HideWindow, LogCurrentCommandInHistory, Login, Logout,
  RemoveAccount, SetActiveWindow, SetAssetHash, SetCharacterView, SetCharSlot, SetChatMode,
  SetCurrentCommand, SetLogMode, SetOption, ShowWindow, UpdateWindowPosition } from './actions';

const defaultSettings: () => ISettings = () => {
  return {
    accounts: [],
    windows: {},
    activeWindow: '',
    charSlot: 0,
    wasKicked: false,
    assetHash: '',
    chatMode: 'cmd',
    logMode: 'All',
    currentCommand: '',
    commandHistory: [],
    characterView: 'Equipment',
    options: {
      [GameOption.PinLastTarget]: false,
      [GameOption.ShouldSortDistance]: false,
      [GameOption.ShouldSortFriendly]: false
    }
  };
};

@State<ISettings>({
  name: 'settings',
  defaults: defaultSettings()
})
@Injectable()
export class SettingsState implements NgxsOnInit {

  @Selector()
  static currentCharView(state: ISettings) {
    return state.characterView;
  }

  @Selector()
  static currentLogMode(state: ISettings) {
    return state.logMode;
  }

  @Selector()
  static currentCommand(state: ISettings) {
    return state.currentCommand;
  }

  @Selector()
  static autologin(state: ISettings) {
    return state.accounts.find(acc => acc.autologin);
  }

  @Selector()
  static accounts(state: ISettings) {
    return state.accounts;
  }

  @Selector()
  static window(state: ISettings) {
    return (window: string) => state.windows[window] || {};
  }

  @Selector()
  static charSlot(state: ISettings) {
    return { slot: state.charSlot };
  }

  @Selector()
  static activeWindow(state: ISettings) {
    return state.activeWindow;
  }

  @Selector()
  static wasKicked(state: ISettings) {
    return state.wasKicked;
  }

  @Selector()
  static assetHash(state: ISettings) {
    return state.assetHash;
  }

  @Selector()
  static chatMode(state: ISettings) {
    return state.chatMode;
  }

  @Selector()
  static options(state: ISettings) {
    return state.options;
  }

  ngxsOnInit(ctx: StateContext<ISettings>) {
    ctx.patchState({ wasKicked: false, assetHash: '' });
  }

  @Action(SetAssetHash)
  updateHash(ctx: StateContext<ISettings>, { assetHash }: SetAssetHash) {
    ctx.patchState({ assetHash });
  }

  @Action(Login)
  login(ctx: StateContext<ISettings>) {
    ctx.patchState({ wasKicked: false });
  }

  @Action(Logout)
  logout(ctx: StateContext<ISettings>, { manualDisconnect, kick }: Logout) {
    const state = ctx.getState();

    if (!manualDisconnect) {
      ctx.patchState({ assetHash: '' });
      return;
    }

    const oldAccounts = state.accounts
      .map(x => Object.assign({}, x, { autologin: false }));

    const accounts = [...oldAccounts];
    ctx.patchState({ accounts, wasKicked: kick, assetHash: '' });
  }

  @Action(AddAccount)
  addAccount(ctx: StateContext<ISettings>, { username, password, autologin }: AddAccount) {
    const state = ctx.getState();

    const oldAccounts = state.accounts
      .filter(x => x.username !== username)
      .map(x => Object.assign({}, x, { autologin: false }));

    const accounts = [{ username, password, autologin }, ...oldAccounts];
    ctx.patchState({ accounts });
  }

  @Action(RemoveAccount)
  removeAccount(ctx: StateContext<ISettings>, { username }: RemoveAccount) {
    const state = ctx.getState();

    const accounts = [...state.accounts.filter(x => x.username !== username)];
    ctx.patchState({ accounts });
  }

  @Action(UpdateWindowPosition)
  updateWindowPos(ctx: StateContext<ISettings>, { windowName, windowProps, overwrite }: UpdateWindowPosition) {
    const state = ctx.getState();
    const windows = { ...state.windows };
    if (!windows[windowName] || overwrite) {
      windows[windowName] = Object.assign({}, windows[windowName], windowProps);
    }
    ctx.patchState({ windows });
  }

  @Action(ShowWindow)
  showWindow(ctx: StateContext<ISettings>, { windowName }: ShowWindow) {
    const state = ctx.getState();
    const windows = { ...state.windows };
    if (windows[windowName]) {
      windows[windowName] = Object.assign({}, windows[windowName], { hidden: false });
    }

    ctx.patchState({ windows });
  }

  @Action(HideWindow)
  hideWindow(ctx: StateContext<ISettings>, { windowName }: HideWindow) {
    const state = ctx.getState();
    const windows = { ...state.windows };
    if (windows[windowName]) {
      windows[windowName] = Object.assign({}, windows[windowName], { hidden: true });
    }

    ctx.patchState({ windows });
  }

  @Action(SetActiveWindow)
  setActiveWindow(ctx: StateContext<ISettings>, { windowName }: SetActiveWindow) {
    ctx.patchState({ activeWindow: windowName });
  }

  @Action(SetCharSlot)
  setCharSlot(ctx: StateContext<ISettings>, { charSlot }: SetCharSlot) {
    ctx.patchState({ charSlot });
  }

  @Action(SetChatMode)
  setChatMode(ctx: StateContext<ISettings>, { chatMode }: SetChatMode) {
    ctx.patchState({ chatMode });
  }

  @Action(SetLogMode)
  setLogMode(ctx: StateContext<ISettings>, { logMode }: SetLogMode) {
    ctx.patchState({ logMode });
  }

  @Action(SetCharacterView)
  setCharView(ctx: StateContext<ISettings>, { charMode }: SetCharacterView) {
    ctx.patchState({ characterView: charMode });
  }

  @Action(LogCurrentCommandInHistory)
  logCommand(ctx: StateContext<ISettings>) {
    const state = ctx.getState();
    const history = [...(state.commandHistory || [])];

    if (history[0] !== state.currentCommand) {
      history.unshift(state.currentCommand);
      if (history.length > 20) history.length = 20;
      ctx.patchState({ commandHistory: history });
    }

  }

  @Action(SetCurrentCommand)
  setCurrentCommand(ctx: StateContext<ISettings>, { command }: SetCurrentCommand) {
    ctx.patchState({ currentCommand: command });
  }

  @Action(SetOption)
  setOption(ctx: StateContext<ISettings>, { option, value }: SetOption) {
    const state = ctx.getState();
    const options = { ...state.options };
    options[option] = value;

    ctx.patchState({ options });
  }

}
