import { IMacroCommandArgs, IPlayer } from '../../../../interfaces';
import { MacroCommand } from '../../../../models/macro';

export class Spit extends MacroCommand {

  aliases = ['spit'];
  canBeInstant = true;
  canBeFast = true;

  execute(player: IPlayer, args: IMacroCommandArgs) {
    const state = this.game.worldManager.getMapStateForCharacter(player);
    const playersInView = state.getAllPlayersInRange(player, 4);
    const target = this.game.targettingHelper.getFirstPossibleTargetInViewRange(player, args.stringArgs);

    if (!target || args.arrayArgs.length === 0 || target === player) {
      this.sendChatMessage(player, 'You spit!');
      playersInView.filter(element => element !== player).forEach(p => {
        this.sendChatMessage(p, `${player.name} spits!`);
      });
      return;
    }

    this.sendChatMessage(player, `You spit at ${target.name}!`);
    this.sendChatMessage(target, `${player.name} spits at you!`);
    playersInView.filter(element => element !== player && element !== target).forEach(p => {
      this.sendChatMessage(p, `${player.name} spits at ${target.name}!`);
    });

  }

}
