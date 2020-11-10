import { Injectable } from 'injection-js';
import { BaseService, IPlayer, ISimpleItem } from '../../interfaces';

@Injectable()
export class PlayerInventoryHelper extends BaseService {

  init() {}

  // sack functions
  public canAddItemToSack(player: IPlayer, item: ISimpleItem): boolean {
    const isSackable = this.game.itemHelper.getItemProperty(item, 'isSackable');
    if (!isSackable) return false;

    if (player.items.sack.items.length >= 25) return false;

    return true;
  }

  public addItemToSack(player: IPlayer, item: ISimpleItem): boolean {
    if (!this.canAddItemToSack(player, item)) return false;

    player.items.sack.items.push(item);
    player.items.sack.items = player.items.sack.items.filter(Boolean);

    return true;
  }

  public removeItemFromSack(player: IPlayer, slot: number): boolean {
    player.items.sack.items.splice(slot, 1);
    player.items.sack.items = player.items.sack.items.filter(Boolean);

    return true;
  }

  // belt functions
  public canAddItemToBelt(player: IPlayer, item: ISimpleItem): boolean {
    const isBeltable = this.game.itemHelper.getItemProperty(item, 'isBeltable');
    if (!isBeltable) return false;

    if (player.items.belt.items.length >= 5) return false;

    return true;
  }

  public addItemToBelt(player: IPlayer, item: ISimpleItem): boolean {
    if (!this.canAddItemToBelt(player, item)) return false;

    player.items.belt.items.push(item);
    player.items.belt.items = player.items.belt.items.filter(Boolean);

    return true;
  }

  public removeItemFromBelt(player: IPlayer, slot: number): boolean {
    player.items.belt.items.splice(slot, 1);
    player.items.belt.items = player.items.belt.items.filter(Boolean);

    return true;
  }
}