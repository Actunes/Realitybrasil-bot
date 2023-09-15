const client = require("..")
const Discord = require("discord.js")
const cron = require("cron")

let messageId = null;
let previousMap = null;

client.once("ready", () => {

    const attMap = new cron.CronJob("2 */1 * * * *", async () => {
        const serverInfoModule = require('./fetch.js')
        const serverInfo = serverInfoModule.getServerInfo();
        let guildID = '1110388609074344017'
        let canal = '1151917458735767643'
        const guild = client.guilds.cache.get(guildID)
        const channel = guild.channels.cache.get(canal)
        serverFound = serverInfo.serverFound

        mapName = serverInfo.mapName
        playersP = serverInfo.playersP
        playersT = serverInfo.playersT
        gameType = serverInfo.gameType
        gameLayout = serverInfo.gameLayout
        serverName = serverInfo.serverName
        let gameLayoutLink = serverInfo.gameLayout
        let gameTypeLink = serverInfo.gameType

        if (serverFound) {

            let mapNameLink = mapName.toLowerCase()
            mapNameLink = mapNameLink.replace(/\s/g, '')

            let image_link = `https://www.realitymod.com/mapgallery/images/maps/${mapNameLink}/mapoverview_${gameTypeLink}_${gameLayoutLink}.jpg`

            let cor = ''

            if (playersP >= 1 && playersP <= 10) {
                cor = '#8BC34A'
            } else if (playersP >= 11 && playersP <= 20) {
                cor = '#43A047'
            } else if (playersP >= 21 && playersP <= 30) {
                cor = '#009688'
            } else if (playersP >= 31 && playersP <= 40) {
                cor = '#CDDC39'
            } else if (playersP >= 41 && playersP <= 50) {
                cor = '#FFF9C4'
            } else if (playersP >= 51 && playersP <= 60) {
                cor = '#FF9800'
            } else if (playersP >= 61 && playersP <= 70) {
                cor = '#FF5722'
            } else if (playersP >= 71 && playersP <= 80) {
                cor = '#FF7C00'
            } else if (playersP >= 81 && playersP <= 90) {
                cor = '#D32F2F'
            } else if (playersP >= 91 && playersP <= 100) {
                cor = '#C2185B'
            } else {
                cor = '#ffffff'
            }

            let embed = new Discord.EmbedBuilder()
                .setColor(cor)
                .setTitle(`${mapName}`)
                .addFields(
                    {
                        name: `${serverInfo.gameTypeEx} - ${serverInfo.gameLayoutEx}`,
                        value: `${playersP}/${playersT}`,
                        inline: true
                    },
                    {
                        name: "Atualizado",
                        value: `<t:${Math.floor(+new Date() / 1000)}:R>`,
                        inline: true
                    },
                )
                .setImage(image_link)
                .setTimestamp()

            if (messageId && previousMap == mapName) {
                const message = await channel.messages.fetch(messageId)
                message.edit({ embeds: [embed] })
            } else if (messageId != null || previousMap != mapName) {
                const message = await channel.send({ embeds: [embed] })
                messageId = message.id
                previousMap = mapName
            }
        }
    })
    attMap.start()
})