import { Connectors, type ShoukakuOptions, type NodeOption, ShoukakuEvents } from 'shoukaku'
import { Kazagumo, type KazagumoEvents, type KazagumoOptions } from 'kazagumo'
import { EventManager, ForgeClient, ForgeExtension } from '@tryforge/forgescript'
import { KazagumoCommandManager } from '@managers/KazagumoCommandManager'
import { ShoukkauCommandManager } from '@managers/ShoukakuCommandManager'

export interface ForgeLinkSetupOptions {
    kazagumoEvents?: (keyof KazagumoEvents)[]
    shoukakuEvents?: (keyof ShoukakuEvents)[]
    kazagumoOptions: KazagumoOptions
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
            this.options.kazagumoOptions,
            new Connectors.DiscordJS(client),
            this.options.nodes,
            this.options.shoukakuOptions
        )
        this.#kc = new KazagumoCommandManager(client)
        this.#sc = new ShoukkauCommandManager(client)

        EventManager.load('kazagumoCommands', __dirname + '../../events/kazagumo')
        EventManager.load('shoukakuCommands', __dirname + '../../events/shoukaku')

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