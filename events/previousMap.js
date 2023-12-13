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

    const attMap = new cron.CronJob("*/5 * * * * *", async () => {
        const serverInfoModule = require('./fetch2.js')
        const serverInfo = serverInfoModule.getServerInfo()
        let guildID = '1110388609074344017'
        let canal = '1184391380454346872'
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
        team1Players = serverInfo.team1Players
        team2Players = serverInfo.team2Players

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

            let team1PlayersScoreBoard = (team1Players && team1Players.length > 0) ? team1Players.map(player => player.name + ' ' + player.kills + '|' + player.deaths + ' ' + player.score).join('\n') : '-'
            let team2PlayersScoreBoard = (team2Players && team2Players.length > 0) ? team2Players.map(player => player.name + ' ' + player.kills + '|' + player.deaths + ' ' + player.score).join('\n') : '-'

            let totalPlayersTeam1 = 0
            let totalKillsTeam1 = 0
            let totalDeathsTeam1 = 0
            let totalScoreTeam1 = 0

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

            let totalPlayersTeam2 = 0
            let totalKillsTeam2 = 0
            let totalDeathsTeam2 = 0
            let totalScoreTeam2 = 0

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
