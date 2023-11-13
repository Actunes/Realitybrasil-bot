const client = require("..")
const Discord = require('discord.js')
const { AttachmentBuilder } = require('discord.js')

client.on('guildMemberAdd', async (member) => {
    const canalID = '1149614821411655700'
    if (!canalID) return

    const Canvas = require('canvas')
    const canvas = Canvas.createCanvas(832, 245)
    const ctx = canvas.getContext('2d')

    const avatarSize = 116
    const avatarRadius = avatarSize / 2
    const avatarX = canvas.width / 2 - avatarRadius - 280
    const avatarY = canvas.height / 2 - avatarRadius

    const background = await Canvas.loadImage('https://i.imgur.com/fDqbcZ5.png')
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

    function drawCircularAvatar() {
        ctx.beginPath()
        ctx.arc(avatarX + avatarRadius, avatarY + avatarRadius, avatarRadius, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize)
    }

    const avatar = member.user.displayAvatarURL({ extension: 'png'})
    const avatarImg = await Canvas.loadImage(avatar)

    drawCircularAvatar()

    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'welcome-image.png' })

    const canal = member.guild.channels.cache.get(canalID)
    if (canal) {
        canal.send({
            content: `Olá, ${member} obrigado(a) por entrar no Discord da Reality Brasil! Fique atento(a) às <#1149599531185487893> e fique ligado(a) no <#1149603095823790111>`,
            files: [attachment],
        })
    }
})
