const client = require("..")
const Discord = require("discord.js")
const cron = require("cron")
const axios = require("axios")
const schemaData = require('../schemes/serverAutoId')

let serverInfo = null

let serverId = ''

async function updateServerInfo() {
    try {
        const resultado =  await schemaData.find({ _id: 'serverAutoId' });
        serverId = resultado[0].idServer[0];
        const result = await axios.get("https://servers.realitymod.com/api/ServerInfo")
        const servers = result.data.servers
        const server = servers.find(s => s.serverId === serverId)

        if (server) {
            const {players} = server

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
            }

            serverInfo = {
                serverFound: true,
                team1Players,
                team2Players,
            }
            console.log(serverInfo)
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