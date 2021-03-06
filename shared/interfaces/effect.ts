import { StatBlock } from './building-blocks';
import { IStatusEffect } from './status-effect';

export enum BuffType {
  Buff = 'buff',
  Debuff = 'debuff',
  OutgoingModifier = 'outgoing',
  IncomingModifier = 'incoming'
}

export interface IEffectContainer {
  [BuffType.Buff]: IStatusEffect[];
  [BuffType.Debuff]: IStatusEffect[];
  [BuffType.OutgoingModifier]: IStatusEffect[];
  [BuffType.IncomingModifier]: IStatusEffect[];

  // used to check if a character has an effect associated with them
  _hash: Record<string, true>;
}

export interface IItemEffectExtra {

  // the tooltip to be displayed (food)
  tooltip?: string;

  // the message to be sent (food)
  message?: string;

  // the stats given (food)
  statChanges?: StatBlock;
}

export interface IItemEffect {
  name: string;
  potency: number;

  // if true, will cast when equipped (will not cast when used - rename this)
  autocast?: boolean;

  // if true, effect can be applied to a weapon via Apply
  canApply?: boolean;

  // if exists, the % chance the effect will be applied
  chance?: number;

  // the number of seconds the ability lasts
  duration?: number;

  // the number of uses the ability has left before the item breaks (-1 = infinite)
  uses?: number;

  // the number of tiles for the AoE effect to go (0 = current tile only)
  range?: number;

  // extra data that is used by different items
  extra?: IItemEffectExtra;
}
