const { ForgeClient } = require('@tryforge/forgescript')
const { ForgeLink } = require('../dist')
process.loadEnvFile()

const lavalink = new ForgeLink({
    kazagumoEvents: [
        'playerStart'
    ],
    kazagumoOptions: {
        defaultSearchEngine: 'youtube'
    },
    nodes: [
        {
            name: 'INZEWORLD.COM (DE)',
            auth: 'saher.inzeworld.com',
            url: 'lava.inzeworld.com:3128',
            secure: false
        }
    ]
})

const client = new ForgeClient({
    intents: [
        'Guilds',
        'GuildMessages',
        'MessageContent',
        'GuildVoiceStates'
    ],
    events: [
        'messageCreate'
    ],
    extensions: [lavalink],
    prefixes: ['.']
})

client.commands.add({
    name: 'plai',
    type: 'messageCreate',
    code: '$playTrack[$message]'
})

lavalink.commands.kazagumo.add({
    type: 'playerStart',
    code: '$log[A track started playing now.]'
})

client.login(process.env.TOKEN)