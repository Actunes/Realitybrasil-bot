const { PermissionFlagsBits } = require('discord.js')
const Discord = require('discord.js')

module.exports = {
    name: 'donate_embed',
    description: 'embed of donate',
    type: Discord.ApplicationCommandType.ChatInput,
    default_member_permissions: PermissionFlagsBits.Administrator,
    options: [
        {
            name: 'price_donate',
            description: 'price of current donate cache',
            type: Discord.ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'mounth',
            description: 'select your corrent mounth',
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Janeiro',
                    value: 'Janeiro'
                },
                {
                    name: 'Fevereiro',
                    value: 'Fevereiro'
                },
                {
                    name: 'Abril',
                    value: 'Abril'
                },
                {
                    name: 'Maio',
                    value: 'Maio'
                },
                {
                    name: 'Junho',
                    value: 'Junho'
                },
                {
                    name: 'Julho',
                    value: 'Julho'
                },
                {
                    name: 'Agosto',
                    value: 'Agosto'
                },
                {
                    name: 'Setembro',
                    value: 'Setembro'
                },
                {
                    name: 'Outubro',
                    value: 'Outubro'
                }
                ,
                {
                    name: 'Novembro',
                    value: 'Novembro'
                }
                ,
                {
                    name: 'Dezembro',
                    value: 'Dezembro'
                }
            ],
        }
    ],
    run: async (client, interaction) => {

        function progressBar(progress, maxProgress, size) {
            const progressT = Math.round((size * progress) / maxProgress)
            const progressEmpty = size - progressT;
    
            const progressText = `█`.repeat(progressT);
            const progressEmptyText = `:`.repeat(progressEmpty)
    
            return progressText + progressEmptyText;
        }

        let mounth = interaction.options.getString('mounth');
        let price = interaction.options.getNumber('price_donate');
        let bar = 0;
        
        if (price > 150){
            bar = `R$ ${price} [${progressBar(150, 150, 39)}] R$ 150 `;
        }else {
            bar = `R$ ${price} [${progressBar(price, 150, 39)}] R$ 150 `;
        }

        try {
            const embed1 = new Discord.EmbedBuilder()
                .setColor(0x00F8FF)
                .setAuthor({ name: 'Reality Brasil | PR', iconURL: 'https://i.imgur.com/pqrrJEq.png', url: 'https://realitybrasil.games' })
                .setDescription('💰 Ao doar, nos informe pelo canal <#1170840357785829516>. Você receberá o cargo de <@&1170908541087916192> e ficará em destaque no servidor do Discord.\n<:sep:1179160342622916688><:sep:1179160342622916688><:sep:1179160342622916688><:sep:1179160342622916688><:sep:1179160342622916688><:sep:1179160342622916688><:sep:1179160342622916688><:sep:1179160342622916688><:sep:1179160342622916688><:sep:1179160342622916688><:sep:1179160342622916688><:sep:1179160342622916688><:sep:1179160342622916688><:sep:1179160342622916688><:sep:1179160342622916688><:sep:1179160342622916688><:sep:1179160342622916688>\n- Ao doar mais de R$15,00 **OU** dar 2 boost no servidor você terá direito ao [**SLOT EXCLUSIVO**](https://discord.com/channels/1110388609074344017/1149603095823790111/1178148825605619773). Aproveitem!')
                .setImage('https://images-ext-1.discordapp.net/external/9W4I6LI0xkHYEfrbWk0O4nySN3urIgeSpuoFSFc_wRU/https/i.imgur.com/Ro9SiMm.jpg?format=webp&width=1191&height=670')
            const embed2 = new Discord.EmbedBuilder()
                .setColor(0x00F8FF)
                .setAuthor({ name: `Progresso de ${mounth}/23`, iconURL: 'https://i.imgur.com/pqrrJEq.png', url: 'https://realitybrasil.games' })
                .setDescription("`"+`${bar}`+"`")
                .setFooter({ text: '© Reality Brasil', iconURL: 'https://i.imgur.com/pqrrJEq.png' });
            
            await interaction.channel.send({ embeds: [embed1]}).then(() => {
                interaction.reply({ content: 'Embed submitted', ephemeral: true})
            })
            await interaction.channel.send({ embeds: [embed2]})
        } catch (error) {
            await interaction.reply({ content: 'Error' + `\n\n**[Error]**` + '```' + error.message + '```', ephemeral: true })
        }
    }
}