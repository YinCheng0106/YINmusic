const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("顯示待播清單")
    .addNumberOption((option) => option.setName("page").setDescription("頁數").setMinValue(1)),

    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)
        if (!queue || !queue.playing){
            return await interaction.editReply("❌｜機器人未播放音樂")
        }

        

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.options.getNumber("page") || 1) - 1

        if (page > totalPages) 
            return await interaction.editReply(`❓｜沒那麼多頁，只有 ${totalPages} 頁而已...`)
        
        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**[${page * 10 + i + 1}]** \`[${song.duration}]\` ${song.title}`
        }).join("\n")

        const currentSong = queue.current

        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`**🎵｜正在播放**\n` + 
                    (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} ` : "None") +
                    `\n\n**📜｜待播清單**\n${queueString}`
                    )
                    .setFooter({
                        text: `頁數 [${page + 1}] 共 [${totalPages}] 頁`
                    })
                    .setThumbnail(currentSong.setThumbnail)
            ]
        })
    }
}