import { DamageClass, StatBlock } from './building-blocks';

export interface IEffectExtra {

  // the tooltip to be displayed (food)
  tooltip?: string;

  // the message to be sent (food)
  message?: string;

  // the stats given (food)
  stats?: StatBlock;

  // whether the effect is permanent (npc attributes)
  isPermanent?: boolean;

  // the damage type of the attribute (npc attributes)
  damageType?: DamageClass;

  // the enrage timer of the attribute (npc attributes)
  enrageTimer?: number;
}

export interface IEffect {
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
  extra?: IEffectExtra;
}