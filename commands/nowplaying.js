const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("nowplaying").setDescription("顯示目前播放曲目"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("❌｜機器人未播放音樂")

		

		let bar = queue.createProgressBar({
			queue: false,
			length: 10,
		})

        const song = queue.current

		await interaction.editReply({
			embeds: [new MessageEmbed()
            .setThumbnail(song.thumbnail)
            .setDescription(`🎵｜正在播放 [${song.title}](${song.url})\n\n` + bar)
        ],
		})
	},
}