import { Game } from '../../helpers';
import { GameServerEvent } from '../../interfaces';
import { ServerAction } from '../../models/ServerAction';

export class ChangeDiscordTagAction extends ServerAction {
  type = GameServerEvent.ChangeDiscordTag;
  requiredKeys = ['discordTag'];
  requiresLoggedIn = true;

  async act(game: Game, { emit }, data) {

    try {
      try {
        await game.accountDB.changeDiscordTag(data.account, data.discordTag);
      } catch {
        return { wasSuccess: false, message: 'That Discord tag is already in use.' };
      }

      game.logger.log('Auth:ChangeDiscordTag', `${data.username} changed Discord tag to ${data.discordTag}.`);

    } catch (e) {
      game.logger.error('ChangeDiscordTag', e);
      throw new Error('Could not change Discord tag?');
    }

    return {
      wasSuccess: true,
      message: `Successfully changed your Discord tag.`
    };
  }
}
