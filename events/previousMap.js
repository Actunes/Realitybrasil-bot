const client = require("..")
const Discord = require("discord.js")
const cron = require("cron")
const axios = require("axios")

let messageId = null;
let previousMap = null;

client.once("ready", () => {
    const attMap = new cron.CronJob("*/1 * * * *", async () => {
        let serverFound = false;
        let guildID = '1110388609074344017'
        let canal = '1151917458735767643'
        const guild = client.guilds.cache.get(guildID)
        const channel = guild.channels.cache.get(canal)
        const data = axios({
            url: "https://servers.realitymod.com/api/ServerInfo",
        }).then(async (result) => {
            const servers = result.data.servers
            const serverId = "785cb08ee980c94e4c8a5bcab3d8e7e37e470269"
            for (const server of servers) {
                if (server.serverId === serverId) {
                    if (server.serverId === serverId) {
                        let mapName = server.properties.mapname
                        let playersP = server.properties.numplayers
                        let playersT = server.properties.maxplayers
                        let gameType = server.properties.gametype
                        let gameTypeLink = server.properties.gametype
                        let gameLayout = server.properties.bf2_mapsize
                        let gameLayoutLink = server.properties.bf2_mapsize
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
                                console.log("error")
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
                                console.log("error")
                                break;
                        }

                        let mapNameLink = mapName.toLowerCase()
                        mapNameLink = mapNameLink.replace(/\s/g, '')

                        let image_link = `https://www.realitymod.com/mapgallery/images/maps/${mapNameLink}/mapoverview_${gameTypeLink}_${gameLayoutLink}.jpg`
                        console.log(image_link)

                        let cor = ''

                        if (playersP >= 1 && playersP <= 10) {
                            cor = '#8BC34A'
                        } else if (playersP >= 11 && playersP <= 20){
                            cor = '#43A047'
                        } else if (playersP >= 21 && playersP <= 30){
                            cor = '#009688'
                        } else if (playersP >= 31 && playersP <= 40){
                            cor = '#CDDC39'
                        } else if (playersP >= 41 && playersP <= 50){
                            cor = '#FFF9C4'
                        } else if (playersP >= 51 && playersP <= 60){
                            cor = '#FF9800'
                        } else if (playersP >= 61 && playersP <= 70){
                            cor = '#FF5722'
                        } else if (playersP >= 71 && playersP <= 80){
                            cor = '#FF7C00'
                        } else if (playersP >= 81 && playersP <= 90){
                            cor = '#D32F2F'
                        } else if (playersP >= 91 && playersP <= 100){
                            cor = '#C2185B'
                        } else {
                            cor = '#ffffff';
                        }
                        

                        let embed = new Discord.EmbedBuilder()
                            .setColor(cor)
                            .setTitle(`${mapName} - ${gameType} - ${gameLayout}`)
                            .setDescription(`${playersP}|${playersT}`)
                            .setImage(image_link)
                            .setTimestamp()

                        if (messageId && previousMap == mapName) {
                            const message = await channel.messages.fetch(messageId);
                            message.edit({ embeds: [embed] })
                        } else if (messageId != null || previousMap != mapName) {
                            const message = await channel.send({ embeds: [embed] });
                            messageId = message.id
                            previousMap = mapName
                        }
                    }
                }
            }
        })
    })
    attMap.start()
})
