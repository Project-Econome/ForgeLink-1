import { Arg, ArgType, NativeFunction } from '@tryforge/forgescript'
import type { BaseChannel, VoiceBasedChannel } from 'discord.js'
import { ForgeLink } from '@structures/ForgeLink'
import { KazagumoTrack } from 'kazagumo'
import { info } from 'console'

export default new NativeFunction({
    name: '$currentTrackInfo',
    description: 'Gets info on a track in a specific guild',
    brackets: true,
    unwrap: true,
    args: [
        Arg.requiredGuild('Guild ID', 'The ID of the guild'),
        {
            name: 'index',
            description: 'track index',
            type: ArgType.Number,
            required: true,
            rest: false
        }
    ],
    output: ArgType.String,
    execute: async function(ctx, [guild, index]) {
        const kazagumo = ctx.client.getExtension(ForgeLink, true).kazagumo

        const player = kazagumo.getPlayer('guild'); 
if (!player) return this.customError("No player found!");

return this.success(player.queue.[index].getRaw);
    }
})