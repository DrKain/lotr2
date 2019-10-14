import { Alignment, BaseClass, DamageClass, Rollable, Stat, StatBlock } from './building-blocks';
import { IEffect } from './effect';

export type IItemEncrust = { effect: IEffect } & { stats: StatBlock } & { maxEncrusts: number };

export interface IItemRequirements {
  alignment: Alignment;
  baseClass: BaseClass;
  level: number;
}

export interface ISuccorInfo {
  map: string;
  x: number;
  y: number;
  z?: number;
}

export interface IItemTrait {
  name: string;
  level: number;
}

export interface IGear {

  // the effect the item gives
  effect?: IEffect;

  // the max enchant level for an item (defaults to 5) - used for progressive item enhancement
  maxEnchantLevel?: number;

  // the item quality (0-5)
  quality?: number;

  // the stats this item boosts
  stats?: StatBlock;

  // randomly chosen stats for this item
  randomStats?: { [stat in Stat]?: { min: number, max: number } };

  // the trait on the item
  trait?: IItemTrait;

  // the random trait generated for an item
  randomTrait?: { level: { min: number, max: number }, name: string[] };
}

export interface IWeapon {

  // the attack range of the item (0-4)
  attackRange?: number;

  // the damage class of the item (defaults to physical)
  damageClass?: DamageClass;

  // whether of not the item can shoot ammo from the offhand
  canShoot?: boolean;

  // if the item can be used in the offhand or not
  offhand?: boolean;

  // whether or not the item returns when thrown
  returnsOnThrow?: boolean;

  // the chance the item has to prone an enemy
  proneChance?: number;

  // the number of times this item can be shot
  shots?: number;

  // the tier of the item (higher tier = more damage rolls)
  tier?: number;

  // whether the item takes two hands or not
  twoHanded?: boolean;
}

export interface ITrap {


  // the number of uses left on this trap (traps only)
  trapUses?: number;
}

export interface IBook {

  // the number of pages findable for the book
  bookFindablePages?: number;

  // the item name filter to find pages for this book
  bookItemFilter?: string;

  // the page for a book this page goes in
  bookPage?: number;

  // the current page this book is on
  bookCurrentPage?: number;

  // the number of pages in this book
  bookPages?: Array<{ id: string, text: string }>;
}

export interface IBox {

  // items contained in this item (used for boxes)
  containedItems?: Rollable[];
}

export interface IConsumable {

  // the number of ounces in the item (bottles, food)
  ounces?: number;

  // the auto-decay on an item in hours (default 24 for these items)
  notUsableAfterHours?: number;
}

export interface IGem {

  // the encrust stats/effect
  encrustGive?: IItemEncrust;
}

export interface ISuccorable {

  // succor info stored on the item
  succorInfo?: ISuccorInfo;
}

export type IItem = IConsumable & IGear & IWeapon & ITrap & IBox & IBook & IGem & ISuccorable & {
  // the name of the item
  name: string;

  // the sprite representing this item
  sprite: number;

  // the value of the item (not necessarily how much it will sell for - adjusted with CHA)
  value: number;

  // whether or not the item binds on pickup
  binds?: boolean;

  // if binds and this, will announce the pickup to nearby
  tellsBind?: boolean;

  // the cosmetic data for the item
  cosmetic?: {
    isPermanent?: boolean,
    name: string;
  };

  // the description of the item (non-sense)
  desc: string;

  // the extended desc of the item (on sense)
  extendedDesc?: string;

  // whether the item can be belted or not
  isBeltable?: boolean;

  // whether the item can be sacked or not
  isSackable?: boolean;

  // whether the item is heavy (ie, causes encumberance)
  isHeavy?: boolean;

  // the requirements to use this items effects (or to use it in combat)
  requirements?: IItemRequirements;

  // the type of the item (the skill it gives)
  type: string;

  // the secondary type of the item (it will also give this skill)
  secondaryType?: string;

  // how much the item will absolutely sell for - useful for gems that have a specific value (no CHA)
  sellValue?: number;
};

export interface ISimpleItem {
  name: string;
  mods: any;
}
