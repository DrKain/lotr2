import { IPlayer, Skill } from '../interfaces';
import { initializeCharacter } from './character';

export const initializePlayer = (char: Partial<IPlayer> = {}): IPlayer => {

  const baseChar = initializeCharacter(char);

  return {
    ...baseChar,
    username: char.username ?? '',
    isSubscribed: char.isSubscribed ?? false,
    z: char.z ?? 0,
    charSlot: char.charSlot ?? 0,
    exp: char.exp ?? 1000,
    axp: char.axp ?? 0,
    gainingAXP: char.gainingAXP ?? false,
    highestLevel: char.highestLevel ?? 1,
    swimLevel: char.swimLevel ?? 0,
    swimElement: char.swimElement ?? '',
    corpseRef: char.corpseRef ?? undefined,
    flaggedSkills: char.flaggedSkills ?? [Skill.Martial],
    learnedSpells: char.learnedSpells ?? {},
    lastTileDesc: '',
    lastRegionDesc: '',
    bgmSetting: char.bgmSetting ?? 'wilderness',
    hungerTicks: char.hungerTicks ?? 0,
    partyName: char.partyName ?? '',
    respawnPoint: char.respawnPoint ?? { x: 14, y: 14, map: 'Tutorial' },
    lastDeathLocation: char.lastDeathLocation ?? undefined,
    dailyItems: char.dailyItems ?? {},
    traits: char.traits ?? { tp: 0, ap: 0, traitsLearned: {} },
    ancientLevel: char.ancientLevel ?? 0
  };
};
