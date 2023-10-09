const client = require("..")
const Discord = require('discord.js')

client.once("ready", () => {
    const attStatus = new cron.CronJob("*/5 * * * *", async () => {       

        const options = {
            method: 'POST',
            headers: {
              Authorization: '946542906200698880-a7d2a5eae0d815c91e5685b76def9a73950d7df1dd5427e6d116bc4ef25bb35e'
            }
          }
          
          fetch('https://api.squarecloud.app/v2/apps/9f31999e53484683bf983828fd40bb21/restart', options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err))

    })
    attStatus.start()
})