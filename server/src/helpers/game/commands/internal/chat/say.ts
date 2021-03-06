import { IMacroCommandArgs, IPlayer } from '../../../../../interfaces';
import { MacroCommand } from '../../../../../models/macro';

export class Say extends MacroCommand {

  aliases = ['say'];
  canBeInstant = true;
  canBeFast = true;

  execute(player: IPlayer, args: IMacroCommandArgs) {
    const state = this.game.worldManager.getMapStateForCharacter(player);
    const playersInView = state.getAllPlayersInRange(player, 4);
    const msg = this.game.profanityHelper.cleanMessage(args.stringArgs);

    playersInView.forEach(p => {
      this.sendChatMessage(p, `**${player.name}**: ${msg}`);
    });
  }

}
