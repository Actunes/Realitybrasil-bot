const client = require("..")
const Discord = require('discord.js')
const cron = require('cron')
require("dotenv").config()
const mongoose = require("mongoose")
const LogMaps = require("../schemes/logMaps")

let messageId = null

client.once("ready", () => {
    const attMapsLog = new cron.CronJob("*/1 * * * *", async () => {
        const guildID = '1110388609074344017'
        const canal = '1160848506102235197'

        const guild = client.guilds.cache.get(guildID)
        const channel = guild.channels.cache.get(canal)

        await mongoose.connect(process.env.MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        const resultados = await LogMaps.find()

        const hoje = new Date()

        const tresDiasAtras = new Date()
        tresDiasAtras.setDate(tresDiasAtras.getDate() - 3)

        const mapasRodadosUltimos3Dias = resultados.flatMap(resultado =>
            resultado.mapas.filter(mapa =>
                new Date(mapa.ultimaVezRodado) >= tresDiasAtras && new Date(mapa.ultimaVezRodado) <= hoje
            ).map(mapa => ({ nome: mapa.nome, vezesRodado: mapa.vezesRodado, ultimaVezRodado: new Date(mapa.ultimaVezRodado) }))
        ).sort((a, b) => b.ultimaVezRodado - a.ultimaVezRodado)

        const mapasString3 = mapasRodadosUltimos3Dias.map(mapa => mapa.nome).join('\n')

        // const mapasNaoRodadosUltimos3Dias = resultados.flatMap(resultado =>
        //     resultado.mapas.filter(mapa =>
        //         new Date(mapa.ultimaVezRodado) < tresDiasAtras
        //     ).map(mapa => mapa.nome)
        // ).sort((a, b) => a.localeCompare(b))

        // const mapasStringNaoRodados = mapasNaoRodadosUltimos3Dias.join('\n')

        const mapasNaoRodadosUltimos3DiasOrdenados = resultados.flatMap(resultado =>
            resultado.mapas.filter(mapa =>
                new Date(mapa.ultimaVezRodado) < tresDiasAtras
            ).map(mapa => ({ nome: mapa.nome, ultimaVezRodado: mapa.ultimaVezRodado }))
        ).sort((a, b) => b.ultimaVezRodado - a.ultimaVezRodado)
        
        const mapasStringNaoRodadosOrdenados = mapasNaoRodadosUltimos3DiasOrdenados.map(mapa => mapa.nome).join('\n')

        const embed = new Discord.EmbedBuilder()
            .setColor("#034733")
            .setTitle("🗺️ Log Maps Reality Brasil 🗺️")
            .addFields(
                // { name: "DISPONÍVEL", value: '```' + `${mapasStringNaoRodados}` + '```', inline: true },
                { name: "DISPONIVEL 🟩", value: '```' + `${mapasStringNaoRodadosOrdenados}` + '```', inline: true },
                { name: "RODADOS 🟧", value: '```' + `${mapasString3}` + '```', inline: true },
            )
            .setFooter({ text: 'Mapas ordenados por data decrescente da última vez rodado'})
            .setTimestamp()

        const message = messageId ? await channel.messages.fetch(messageId) : await channel.send({ embeds: [embed] })
        message.edit({ embeds: [embed] })
        messageId = message.id
    })

    attMapsLog.start()
})
