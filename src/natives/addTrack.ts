import { Arg, ArgType, NativeFunction } from '@tryforge/forgescript'
import type { BaseChannel, VoiceBasedChannel } from 'discord.js'
import { ForgeLink } from '@structures/ForgeLink'

export default new NativeFunction({
    name: '$addTrack',
    description: 'Adds a track in a specific guild',
    brackets: true,
    unwrap: true,
    args: [
        Arg.requiredGuild('Guild ID', 'The ID of the guild to create the player to.'),
       {
            name: 'Query',
            description: 'Search Query',
            type: ArgType.String,
            required: true,
            rest: false
        }
    ],
    output: ArgType.String,
    execute: async function(ctx, [guild, query]) {
        const kazagumo = ctx.client.getExtension(ForgeLink, true).kazagumo

        const player = kazagumo.getPlayer('guild'); 
if (!player) return this.customError("No player found!");

const result = await kazagumo.search(query)

if (!result.tracks.length) 
    return 
this.customError("No results found!");

        if (result.type === "PLAYLIST") 
            player.queue.add(result.tracks);
        else player.queue.add(result.tracks[0]);


        if (!player.playing && !player.paused) 
            player.play();
        
        return this.success(result.type === "PLAYLIST" 
            ? `Queued ${result.tracks.length} from ${result.playlistName}` 
            : `Queued ${result.tracks[0].title}`
        );
    }
})