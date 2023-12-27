const client = require("..")
const Discord = require("discord.js")
const cron = require("cron")
const logMaps = require('../schemes/logMaps')


let messageId = null
let previousMap = null

let lastTotalKillsTeam1 = 0
let lastTotalDeathsTeam1 = 0
let lastTotalScoreTeam1 = 0
let lastTotalKillsTeam2 = 0
let lastTotalDeathsTeam2 = 0
let lastTotalScoreTeam2 = 0

client.once("ready", () => {

    const attMap = new cron.CronJob("*/15 * * * * *", async () => {
        const serverInfoModule = require('./fetch2.js')
        const serverInfo = serverInfoModule.getServerInfo()
        const serverInfoModuleApi = require('./fetch.js')
        const serverInfoApi = serverInfoModuleApi.getServerInfo()
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
        team1 = serverInfo.team1
        team2 = serverInfo.team2
        team1Players = serverInfoApi.team1Players
        team2Players = serverInfoApi.team2Players

        if (serverFound) {

            let mapNameLink = mapName.toLowerCase()
            mapNameLink = mapNameLink.replace(/\s/g, '')

            let image_link = `https://www.realitymod.com/mapgallery/images/maps/${mapNameLink}/mapoverview_${gameTypeLink}_${gameLayoutLink}.jpg`

            let cor = ''

            if (playersP >= 1 && playersP <= 2) {
                cor = '#0F0F0F'
            } else if (playersP >= 2 && playersP <= 10) {
                cor = '#FBFCFF'
            } else if (playersP >= 11 && playersP <= 15) {
                cor = '#8BA5FF'
            } else if (playersP >= 16 && playersP <= 20) {
                cor = '#6486FF'
            } else if (playersP >= 21 && playersP <= 25) {
                cor = '#063DFF'
            } else if (playersP >= 26 && playersP <= 30) {
                cor = '#052DBA'
            } else if (playersP >= 31 && playersP <= 35) {
                cor = '#08FF89'
            } else if (playersP >= 36 && playersP <= 40) {
                cor = '#00C164'
            } else if (playersP >= 41 && playersP <= 45) {
                cor = '#00A254'
            } else if (playersP >= 46 && playersP <= 50) {
                cor = '#00A21A'
            } else if (playersP >= 51 && playersP <= 55) {
                cor = '#0ABB06'
            } else if (playersP >= 56 && playersP <= 60) {
                cor = '#35BB06'
            } else if (playersP >= 61 && playersP <= 65) {
                cor = '#61BB06'
            } else if (playersP >= 66 && playersP <= 70) {
                cor = '#8CBB06'
            } else if (playersP >= 71 && playersP <= 75) {
                cor = '#B8BB06'
            } else if (playersP >= 76 && playersP <= 80) {
                cor = '#C7CB07'
            } else if (playersP >= 81 && playersP <= 85) {
                cor = '#CBAC07'
            } else if (playersP >= 86 && playersP <= 90) {
                cor = '#CB8807'
            } else if (playersP >= 91 && playersP <= 95) {
                cor = '#CB6507'
            } else if (playersP >= 96 && playersP <= 100) {
                cor = '#FF0000'
            }
            else {
                cor = '#ffffff'
            }

            let totalPlayersTeam1 = 0
            let totalKillsTeam1 = 0
            let totalDeathsTeam1 = 0
            let totalScoreTeam1 = 0


            if (Array.isArray(team1Players) && team1Players.length > 0) {
            for (const player of team1Players) {
                totalPlayersTeam1++
                totalKillsTeam1 += player.kills
                totalDeathsTeam1 += player.deaths
                totalScoreTeam1 += player.score

                if (player.deaths !== 0) {
                    lastTotalDeathsTeam1 = totalDeathsTeam1
                }
                if (player.kills !== 0) {
                    lastTotalKillsTeam1 = totalKillsTeam1
                }
                if (player.score !== 0) {
                    lastTotalScoreTeam1 = totalScoreTeam1
                }
            }
        }

            let totalPlayersTeam2 = 0
            let totalKillsTeam2 = 0
            let totalDeathsTeam2 = 0
            let totalScoreTeam2 = 0


            if (Array.isArray(team2Players) && team2Players.length > 0) {

                for (const player of team2Players) {
                    totalPlayersTeam2++
                    totalKillsTeam2 += player.kills
                    totalDeathsTeam2 += player.deaths
                    totalScoreTeam2 += player.score

                    if (player.deaths !== 0) {
                        lastTotalDeathsTeam2 = totalDeathsTeam2
                    }
                    if (player.kills !== 0) {
                        lastTotalKillsTeam2 = totalKillsTeam2
                    }
                    if (player.score !== 0) {
                        lastTotalScoreTeam2 = totalScoreTeam2
                    }

                }
            }

                let embed = new Discord.EmbedBuilder()
                    .setColor(cor)
                    .setAuthor({ name: `=RB= REALITY BRASIL MAPS`, iconURL: 'https://i.imgur.com/wlYkc17.png', url: 'https://realitybrasil.games/battlerecorder' })
                    .setTitle(`🗺️〡${mapName}`)
                    .addFields(
                        {
                            name: `${serverInfo.gameTypeEx}・${serverInfo.gameLayoutEx}`,
                            value: `👥 ${playersP}/${playersT}`,
                            inline: false
                        },
                        {
                            name: `🔵 ${team2}`,
                            value: '```' + `Players: ${totalPlayersTeam2}\nScore: ${lastTotalScoreTeam2}\nKills: ${lastTotalKillsTeam2} \nDeaths: ${lastTotalDeathsTeam2}` + '```',
                            inline: true
                        },
                        {
                            name: `🔴 ${team1}`,
                            value: '```' + `Players: ${totalPlayersTeam1}\nScore: ${lastTotalScoreTeam1}\nKills: ${lastTotalKillsTeam1} \nDeaths: ${lastTotalDeathsTeam1}` + '```',
                            inline: true
                        }
                    )
                    .setImage(image_link)
                    .setFooter({ text: 'Atualizado', iconURL: 'https://i.imgur.com/iBCQ8MS.png' })
                    .setTimestamp()

                if (messageId && previousMap == mapName) {
                    const message = await channel.messages.fetch(messageId)
                    message.edit({ embeds: [embed] })
                } else if (messageId != null || previousMap != mapName) {
                    const message = await channel.send({ embeds: [embed] })
                    messageId = message.id
                    previousMap = mapName
                    const existingMap = await logMaps.findOne({ 'mapas.nome': mapName });
                    if (serverInfo.gameTypeEx == "AAS" || serverInfo.gameTypeEx == "Insurgency") {
                        if (existingMap) {
                            await logMaps.updateOne(
                                { 'mapas.nome': mapName },
                                {
                                    $inc: { 'mapas.$.vezesRodado': 1 },
                                    $set: { 'mapas.$.ultimaVezRodado': new Date() }
                                }
                            )
                        } else {
                            await logMaps.findOneAndUpdate({ _id: 'mapasRodados' }, {
                                $addToSet: {
                                    mapas: [{
                                        nome: mapName,
                                        vezesRodado: 1,
                                        ultimaVezRodado: new Date()
                                    }]
                                }
                            },
                                { upsert: true })
                        }

                    }

                    lastTotalKillsTeam1 = 0
                    lastTotalDeathsTeam1 = 0
                    lastTotalScoreTeam1 = 0
                    lastTotalKillsTeam2 = 0
                    lastTotalDeathsTeam2 = 0
                    lastTotalScoreTeam2 = 0
                }
            }
        })
    attMap.start()
})
