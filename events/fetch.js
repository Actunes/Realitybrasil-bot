const client = require("..")
const Discord = require("discord.js")
const cron = require("cron")
const axios = require("axios")

let serverInfo = null;

function sortPlayersByScoreDesc(players) {
    return players.sort((a, b) => b.score - a.score)
}

client.once("ready", () => {
    const attMap = new cron.CronJob("*/31 * * * * *", async () => {
        let team1Players = []
        let team2Players = []

        let serverFound = false
        try {
            const result = await axios.get("https://servers.realitymod.com/api/ServerInfo")
            const servers = result.data.servers
            const serverId = "25f0dde665bdf29ad8f3ac9e1ab9af17c627cc4a"
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
                    let team1 = server.properties.bf2_team1
                    let team2 = server.properties.bf2_team2

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

                    if (server.players.length > 0) {
                        for (const player of server.players) {
                            let playerInfo = {
                                name: player.name,
                                kills: player.kills,
                                deaths: player.deaths,
                                score: player.score
                            }
                            if (player.team === 1) {
                                team1Players.push(playerInfo)
                            } else if (player.team === 2) {
                                team2Players.push(playerInfo)
                            }
                        }
                        team1Players = sortPlayersByScoreDesc(team1Players)
                        team2Players = sortPlayersByScoreDesc(team2Players)
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
                        team1,
                        team2,
                        team1Players,
                        team2Players,
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
