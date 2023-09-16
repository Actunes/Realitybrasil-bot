const client = require("..")
const Discord = require("discord.js")
const cron = require("cron")
const serverInfoModule = require('./fetch.js')

function updateBotStatus(serverInfo) {
    const {
        serverFound,
        mapName,
        playersP,
        playersT,
        gameTypeEx,
        gameLayoutEx
    } = serverInfo

    const presence = {
        activities: [{
            type: Discord.ActivityType.Custom,
            name: serverFound ? `Jogando` : 'Erro',
            state: serverFound ?
                `🟢 ${mapName} [${playersP}|${playersT}] - ${gameTypeEx} ${gameLayoutEx}` :
                '🔴 Servidor offline ou indisponivel'
        }]
    }

    client.user.setPresence(presence)
}

client.once("ready", () => {
    const attStatus = new cron.CronJob("*/1 * * * *", async () => {
        const serverInfo = serverInfoModule.getServerInfo()
        updateBotStatus(serverInfo)
    })

    attStatus.start()
})
