const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("pause").setDescription("暫停音樂"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)
		

		if (!queue) return await interaction.editReply("❌｜機器人未播放音樂")

		queue.setPaused(true)
        await interaction.editReply("⏸️｜音樂已暫停，使用 `/resume` 恢復播放 ")
	},
}