const client = require("..")
const Discord = require("discord.js")
const cron = require("cron")
const axios = require("axios")

let serverInfo = null;

client.once("ready", () => {
    const attMap = new cron.CronJob("*/1 * * * *", async () => {
        let serverFound = false
        try {
            const result = await axios.get("https://servers.realitymod.com/api/ServerInfo")
            const servers = result.data.servers
            const serverId = "706d6dc5ab62de0c9cc90dda429462ef88bb3aed"
            for (const server of servers) {
                if (server.serverId === serverId) {
                    serverFound = true;
                    let mapName = server.properties.mapname;
                    let playersP = server.properties.numplayers
                    let playersT = server.properties.maxplayers
                    let gameType = server.properties.gametype
                    let gameLayout = server.properties.bf2_mapsize
                    let serverName = server.properties.hostname
                    let gameTypeEx = ''
                    let gameLayoutEx = ''

                    switch (gameType) {
                        case "gpm_cq":
                            gameTypeEx = "AAS"
                            break
                        case "gpm_insurgency":
                            gameTypeEx = "Insurgency"
                            break
                        case "gpm_skirmish":
                            gameTypeEx = "Skirmish"
                            break
                        case "gpm_gungame":
                            gameTypeEx = "Gungame"
                            break
                        case "gpm_cnc":
                            gameTypeEx = "CNC"
                            break
                        case "gpm_vehicles":
                            gameTypeEx = "Vehicle Warfare"
                            break
                        case "gpm_coop":
                            gameTypeEx = "Co-Operative"
                            break
                        default:
                            console.log("error")
                            break;
                    }

                    switch (gameLayout) {
                        case "16":
                            gameLayoutEx = "Infantary"
                            break
                        case "32":
                            gameLayoutEx = "Alternative"
                            break
                        case "64":
                            gameLayoutEx = "Standard"
                            break
                        case "128":
                            gameLayoutEx = "Large"
                            break
                        default:
                            console.log("error")
                            break
                    }

                    serverInfo = {
                        serverFound,
                        mapName,
                        playersP,
                        playersT,
                        gameType,
                        gameLayout,
                        serverName,
                        gameTypeEx,
                        gameLayoutEx,
                    };
                    break;
                }
            }
        } catch (error) {
            console.error(error)
        }
    })
    attMap.start()
})

module.exports = {
    getServerInfo: () => serverInfo || { serverFound: false }
}
