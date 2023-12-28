const client = require("..")

client.on('messageCreate', async message => {

    if (!['1163545053076131850'].includes(message.channel.id) || message.author.bot) return;
    let contain = false

    if (message.content.includes('https://')) {
        contain = true
    }

    if (!contain && message.attachments.size == 0) {
        message.channel.send({ content: ` <@${message.author.id}> Mensagem Invalida!\n- Sua mensagem deve conter um link ou uma mídia anexada.` })
            .then(sentMessage => {
                setTimeout(() => {
                    sentMessage.delete();
                }, 10000)
            });

        setTimeout(() => {
            message.delete();
        }, 200)
    }
    ['<:amei:1189994176763408466>'].map(emj => message.react(emj).catch(e => null))
})

