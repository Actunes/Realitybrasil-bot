const client = require("..")
const Discord = require('discord.js')

client.on('guildMemberAdd', (member) => {
    let canal = '1149614821411655700'
    if (!canal) return

    let embed = new Discord.EmbedBuilder()
    .setColor("#034733")
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setTitle("Bem-vindo(a)!")
    .setDescription(`Olá ${member}, obrigado(a) por entrar no discord da Reality Brasil! Não esqueca de acessar a documentação de nosso servidor https://docs.realitybrasil.games`)

    member.guild.channels.cache.get(canal).send({embeds: [embed], content: `${member}`})
})
