const client = require("..")
const Discord = require('discord.js')
const cron = require('cron')
require("dotenv").config()
const mongoose = require("mongoose")
const LogMaps = require("../schemes/logMaps")
let messageId = null

client.once("ready", () => {
    const attMapsLog = new cron.CronJob("*/1 * * * *", async () => {

        let guildID = '1110388609074344017'
        let canal = '1160848506102235197'
        const guild = client.guilds.cache.get(guildID)
        const channel = guild.channels.cache.get(canal)

        mongoose.connect(process.env.MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        const resultados = await LogMaps.find()

        const hoje = new Date();
       // hoje.setDate(hoje.getDate() - 1)

        const mapasRodadosHoje = []
        resultados.forEach(resultado => {
            resultado.mapas.forEach(mapa => {
                const ultimaVezRodado = new Date(mapa.ultimaVezRodado);

                if (ultimaVezRodado.getDate() === hoje.getDate() &&
                    ultimaVezRodado.getMonth() === hoje.getMonth() &&
                    ultimaVezRodado.getFullYear() === hoje.getFullYear()) {
                    mapasRodadosHoje.push({
                        nome: mapa.nome,
                        vezesRodado: mapa.vezesRodado
                    })
                    mapasRodadosHoje.sort((a, b) => {
                        return a.nome.localeCompare(b.nome);
                    });
                }
            })
        })

        let mapasString = ''

        mapasRodadosHoje.forEach(mapa => {
            mapasString += `${mapa.nome}\n`
        })

        const tresDiasAtras = new Date();
        tresDiasAtras.setDate(tresDiasAtras.getDate() - 3);
        const mapasRodadosUltimos3Dias = [];

        resultados.forEach(resultado => {
            resultado.mapas.forEach(mapa => {
                const ultimaVezRodado = new Date(mapa.ultimaVezRodado);

                if (ultimaVezRodado >= tresDiasAtras && ultimaVezRodado <= hoje) {
                    mapasRodadosUltimos3Dias.push({
                        nome: mapa.nome,
                        vezesRodado: mapa.vezesRodado
                    });
                    mapasRodadosUltimos3Dias.sort((a, b) => {
                        return a.nome.localeCompare(b.nome);
                    });
                }
            });
        });

        let mapasString3 = '';

        mapasRodadosUltimos3Dias.forEach(mapa => {
            mapasString3 += `${mapa.nome}\n`;
        });

        let embed = new Discord.EmbedBuilder()
            .setColor("#034733")
            .setTitle("Log Maps Reality Brasil")
            .addFields(
                {
                    name: `3 DIAS`,
                    value: '```' + `${mapasString3}` + '```',
                    inline: true
                },
                {
                    name: `HOJE`,
                    value: '```' + `${mapasString}` + '```',
                    inline: true
                }
            )
            .setTimestamp()
        if (messageId == null) {
            const message = await channel.send({ embeds: [embed] })
            messageId = message.id
        } else if (messageId != null) {
            const message = await channel.messages.fetch(messageId)
            message.edit({ embeds: [embed] })
        }
    })
    attMapsLog.start()
})