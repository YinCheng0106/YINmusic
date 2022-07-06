const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("resume").setDescription("恢復播放"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("❌｜機器人未播放音樂")

		
			
		queue.setPaused(false)
        await interaction.editReply("▶️｜音樂恢復播放，使用 `/pause` 暫停播放")
	},
}