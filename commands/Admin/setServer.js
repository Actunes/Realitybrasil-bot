const { PermissionFlagsBits } = require('discord.js')
const Discord = require('discord.js')
const schemaData = require('../../schemes/serverAutoId')

module.exports = {
    name: 'setserver',
    description: 'Set server to auto Score',
    type: Discord.ApplicationCommandType.ChatInput,
    default_member_permissions: PermissionFlagsBits.Administrator,
    options: [
        {
            name: 'id',
            description: 'Id of server',
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    run: async (client, interaction) => {
            const idServer = interaction.options.getString('id')
            await schemaData.findOneAndUpdate({ _id: 'serverAutoId' }, { $set: { 'idServer': idServer } }, { upsert: true })
            interaction.reply({ content: `Channel ${idServer} added to Auto Score successfully`, ephemeral: true })
    }
}
