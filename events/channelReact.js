const client = require("..")
const schemaData = require('../schemes/channelReactID')

client.on('messageCreate', async message => {
    const dataMongo = await schemaData.findOne({ _id: 'channelToReact' })

    if (!dataMongo.idChannel.includes(message.channel.id)) return;

    ['<:check:1175982445141704714>', '<:deny:1175982447515676743>'].map(emj => message.react(emj).catch(e => null))
})
