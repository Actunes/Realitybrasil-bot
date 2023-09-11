const client = require("..");
const Discord = require("discord.js");
const cron = require("cron");
const axios = require("axios");

client.once("ready", () => {
    const attStatus = new cron.CronJob('*/1 * * * *', async () => {
        const data = axios({
            url: "https://servers.realitymod.com/api/ServerInfo",
        })
            .then((result) => {
                const servers = result.data.servers;
                const serverId = "785cb08ee980c94e4c8a5bcab3d8e7e37e470269"

                for (const server of servers) {
                    if (server.serverId === serverId) {
                        let mapName = server.properties.mapname;
                        let playersP = server.properties.numplayers
                        let playersT = server.properties.maxplayers
                        let gameType = server.properties.gametype
                        let gameLayout = server.properties.bf2_mapsize
                        let serverName = server.properties.hostname

                        switch (gameType) {
                            case "gpm_cq":
                                gameType = "AAS"
                                break;
                            case "gpm_insurgency":
                                gameType = "Insurgency"
                                break;
                            case "gpm_skirmish":
                                gameType = "Skirmish"
                                break;
                            case "gpm_gungame":
                                gameType = "Gungame"
                                break;
                            case "gpm_cnc":
                                gameType = "CNC"
                                break;
                            case "gpm_vehicles":
                                gameType = "Vehicle Warfare"
                                break;
                            case "gpm_coop":
                                gameType = "Co-Operative"
                                break;
                            default:
                                console.log("error");
                                break;
                        }

                        switch (gameLayout) {
                            case "16":
                                gameLayout = "Infantary"
                                break;
                            case "32":
                                gameLayout = "Alternative"
                                break;
                            case "64":
                                gameLayout = "Standard"
                                break;
                            case "128":
                                gameLayout = "Large"
                                break;
                            default:
                                console.log("error");
                                break;
                        }

                        const status = client.user.setPresence({
                            activities: [{
                                type: Discord.ActivityType.Custom,
                                name: `Jogando`,
                                state: `🟢 ${mapName} [${playersP}|${playersT}] - ${gameType} ${gameLayout}`
                            }]
                        })

                        break
                    }
                }
            })
            .catch((error) => {
                const status = client.user.setPresence({
                    activities: [{
                        type: Discord.ActivityType.Custom,
                        name: 'Falha',
                        state: `🔴 Servidor offline ou indisponivel`
                    }]
                })
            })
    })
    attStatus.start()
})