const client = require("..")
const Discord = require('discord.js')
require("dotenv").config()
const cron = require('cron')

client.once("ready", () => {
    let guildID = '1110388609074344017'
    let canal = '1157106106808672266'
    const guild = client.guilds.cache.get(guildID)
    const channel = guild.channels.cache.get(canal)

    const restartServer10 = new cron.CronJob("50 7 * * 1,4", async () => {
        await Promise.all([
            channel.send({ content: '!s Server será reinciciado em 10 minutos!'}),
        ])
    })
    restartServer10.start()

    const restartServer5 = new cron.CronJob("55 7 * * 1,4", async () => {
        await Promise.all([
            channel.send({ content: '!s Server será reinciciado em 5 minutos!'}),
        ])
    })
    restartServer5.start()

    const restartServer1 = new cron.CronJob("59 7 * * 1,4", async () => {
        await Promise.all([
            channel.send({ content: '!s Server será reinciciado em 1 minuto!'}),
        ])
    })
    restartServer1.start()

    const restartServer0 = new cron.CronJob("0 8 * * 1,4", async () => {
        await Promise.all([
            channel.send({ content: '!stopserver Restart Automático!'}),
        ])
    })
    restartServer0.start()
})