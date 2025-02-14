import { EventManager, ForgeClient, ForgeExtension, FunctionManager } from '@tryforge/forgescript'
import { Connectors, type ShoukakuOptions, type NodeOption, ShoukakuEvents } from 'shoukaku'
import { Kazagumo, type KazagumoEvents, type KazagumoOptions } from 'kazagumo'
import { KazagumoCommandManager } from '@managers/KazagumoCommandManager'
import { ShoukkauCommandManager } from '@managers/ShoukakuCommandManager'
import { join } from 'path'

export interface ForgeLinkSetupOptions {
    kazagumoEvents?: (keyof KazagumoEvents)[]
    shoukakuEvents?: (keyof ShoukakuEvents)[]
    kazagumoOptions: Omit<KazagumoOptions, 'send'>
    nodes: NodeOption[]
    shoukakuOptions?: ShoukakuOptions
}

export class ForgeLink extends ForgeExtension {
    name = 'ForgeLink'
    description = '...'
    version = '...'
    #e: Kazagumo | null = null
    #kc: KazagumoCommandManager
    #sc: ShoukkauCommandManager
    constructor(public options: ForgeLinkSetupOptions) {
        super()
    }
    init(client: ForgeClient): void {
        this.#e = new Kazagumo(
            {
                ...this.options.kazagumoOptions,
                send(guildId, payload) {
                    const guild = client.guilds.cache.get(guildId);
                    if (guild) guild.shard.send(payload);
                },
            },
            new Connectors.DiscordJS(client),
            this.options.nodes,
            this.options.shoukakuOptions
        )
        this.#kc = new KazagumoCommandManager(client)
        this.#sc = new ShoukkauCommandManager(client)

        FunctionManager.load('ForgeLink', join(__dirname, '../../natives'))
        EventManager.load('kazagumoCommands', join(__dirname, '../../events/kazagumo'))
        EventManager.load('shoukakuCommands', join(__dirname, '../../events/shoukaku'))

        client.events.load('kazagumoCommands', this.options.kazagumoEvents ?? [])
        client.events.load('shoukakuCommands', this.options.shoukakuEvents ?? [])
    }
    get kazagumo(): Kazagumo {
        return this.#e
    }
    get commands() {
        return {
            kazagumo: this.#kc,
            shoukaku: this.#sc
        }
    }
}