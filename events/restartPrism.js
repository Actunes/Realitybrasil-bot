const client = require("..")
const Discord = require('discord.js')
require("dotenv").config()
const cron = require('cron')

client.once("ready", () => {
    const restartPrism = new cron.CronJob("*/20 * * * *", async () => {       

        const options = {
            method: 'POST',
            headers: {
              Authorization: process.env.APISQUARE
            }
          }
          
          fetch('https://api.squarecloud.app/v2/apps/9f31999e53484683bf983828fd40bb21/restart', options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err))

    })
    restartPrism.start()
})