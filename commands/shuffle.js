const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("shuffle").setDescription("打亂待播清單"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("❌｜機器人未使用")

		

		queue.shuffle()
        await interaction.editReply(`🔀｜待播清單 已打亂 \`${queue.tracks.length}\` 首`)
	},
}