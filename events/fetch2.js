const client = require("..")
const Discord = require("discord.js")
const cron = require("cron")
const Gamedig = require('gamedig');

let serverInfo = null

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

function processPlayers(players) {
    let team1Players = [];
    let team2Players = [];

    if (players.length > 0) {
        for (const player of players) {
            const { raw } = player;
            const playerInfo = {
                name: player.name,
                kills: raw.score,
                deaths: raw.deaths,
                score: raw.score
            };

            if (raw.team === 1) {
                team1Players.push(playerInfo);
            } else if (raw.team === 2) {
                team2Players.push(playerInfo);
            }
        }

        team1Players = sortPlayersByScoreDesc(team1Players);
        team2Players = sortPlayersByScoreDesc(team2Players);
    }

    return { team1Players, team2Players };
}

async function updateServerInfo() {
    try {
        Gamedig.query({
            type: 'bf2',
            host: '144.22.129.122',
            port: 16567,
            listenUdpPort: 29900
        }).then((state) => {
            const { team1Players, team2Players } = processPlayers(state.players);
            serverInfo = {
                serverFound: true,
                mapName: state.raw.mapname,
                playersP: state.raw.numplayers,
                playersT: state.raw.maxplayers,
                gameType: state.raw.gametype,
                gameLayout: state.raw.bf2_mapsize,
                serverName: state.raw.hostname,
                gameTypeEx: mapGameType(state.raw.gametype),
                gameLayoutEx: mapGameLayout(state.raw.bf2_mapsize),
                team1: state.raw.bf2_team1,
                team2: state.raw.bf2_team2,
                team1Players,
                team2Players,
            }
            console.log(serverInfo)
        }).catch((error) => {
            serverInfo = { serverFound: false }
            console.log(error)
        })
    } catch (error) {
        console.error(error)
        serverInfo = { serverFound: false }
    }
}

client.once("ready", async () => {
    const attMap = new cron.CronJob("*/5 * * * * *", updateServerInfo)
    attMap.start()
})

module.exports = {
    getServerInfo: () => serverInfo || { serverFound: false }
}
