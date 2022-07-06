const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("quit").setDescription("中斷機器人連線"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("❌｜機器人未使用")

		

		queue.destroy()
        await interaction.editReply("👋｜不聽了喔...好吧...再見")
	},
}