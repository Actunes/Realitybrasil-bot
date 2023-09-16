const client = require("..")
const Discord = require("discord.js")
const cron = require("cron")
const axios = require("axios")
const schemaData = require('../schemes/serverAutoId')

let serverInfo = null

let serverId = ''

const gameTypeMap = {
    "gpm_cq": "AAS",
    "gpm_insurgency": "Insurgency",
    "gpm_skirmish": "Skirmish",
    "gpm_gungame": "Gungame",
    "gpm_cnc": "CNC",
    "gpm_vehicles": "Vehicle Warfare",
    "gpm_coop": "Co-Operative",
}

const gameLayoutMap = {
    "16": "Infantry",
    "32": "Alternative",
    "64": "Standard",
    "128": "Large",
}

function mapGameType(gameType) {
    return gameTypeMap[gameType] || "Unknown"
}

function mapGameLayout(gameLayout) {
    return gameLayoutMap[gameLayout] || "Unknown"
}

function sortPlayersByScoreDesc(players) {
    return players.sort((a, b) => b.score - a.score)
}

async function getIdServer(){
    const resultado =  await schemaData.find({ _id: 'serverAutoId' });
    serverId = resultado[0].idServer[0];
}

async function updateServerInfo() {
    try {
        const resultado =  await schemaData.find({ _id: 'serverAutoId' });
        serverId = resultado[0].idServer[0];
        const result = await axios.get("https://servers.realitymod.com/api/ServerInfo")
        const servers = result.data.servers
        const server = servers.find(s => s.serverId === serverId)

        if (server) {
            const { properties, players } = server
            const gameTypeEx = mapGameType(properties.gametype)
            const gameLayoutEx = mapGameLayout(properties.bf2_mapsize)

            let team1Players = []
            let team2Players = []

            if (players.length > 0) {
                for (const player of players) {
                    const playerInfo = {
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
                serverFound: true,
                mapName: properties.mapname,
                playersP: properties.numplayers,
                playersT: properties.maxplayers,
                gameType: properties.gametype,
                gameLayout: properties.bf2_mapsize,
                serverName: properties.hostname,
                gameTypeEx,
                gameLayoutEx,
                team1: properties.bf2_team1,
                team2: properties.bf2_team2,
                team1Players,
                team2Players,
            }
        } else {
            serverInfo = { serverFound: false }
        }
    } catch (error) {
        console.error(error)
        serverInfo = { serverFound: false }
    }
}

client.once("ready", async () => {
    const attMap = new cron.CronJob("*/1 * * * *", updateServerInfo)
    attMap.start()
})

module.exports = {
    getServerInfo: () => serverInfo || { serverFound: false }
}
