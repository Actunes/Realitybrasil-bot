const client = require("..")
const Discord = require("discord.js")
const cron = require("cron")

client.once("ready", () => {
    const attStatus = new cron.CronJob('2 */1 * * * *', async () => {

        const serverInfoModule = require('./fetch.js')
        const serverInfo = serverInfoModule.getServerInfo()
        let serverFound = serverInfo.serverFound

        mapName = serverInfo.mapName
        playersP = serverInfo.playersP
        playersT = serverInfo.playersT
        gameType = serverInfo.gameType
        gameLayout = serverInfo.gameLayout
        serverName = serverInfo.serverName
        gameTypeEx = serverInfo.gameTypeEx
        gameLayoutEx = serverInfo.gameLayoutEx

        if(serverFound){
            const status = client.user.setPresence({
                activities: [{
                    type: Discord.ActivityType.Custom,
                    name: `Jogando`,
                    state: `🟢 ${mapName} [${playersP}|${playersT}] - ${gameTypeEx} ${gameLayoutEx}`
                }]
            })
        }else {
            const status = client.user.setPresence({
                activities: [{
                    type: Discord.ActivityType.Custom,
                    name: 'Erro',
                    state: `🔴 Servidor offline ou indisponivel`
                }]
            })
        }
    })
    attStatus.start()
})