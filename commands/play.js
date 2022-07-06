const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("播放指令")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("song")
				.setDescription("單曲播放")
				.addStringOption((option) => option.setName("url").setDescription("單曲連結").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("playlist")
				.setDescription("播放清單")
				.addStringOption((option) => option.setName("url").setDescription("播放清單連結").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("search")
				.setDescription("輸入 歌名 或 關鍵字 並搜尋播放")
				.addStringOption((option) =>
					option.setName("searchterms").setDescription("關鍵字搜尋").setRequired(true)
				)
		),
	run: async ({ client, interaction }) => {
		if (!interaction.member.voice.channel) return interaction.editReply("❓｜你必須在語音頻道")

		const queue = await client.player.createQueue(interaction.guild)
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)
        
        

		let embed = new MessageEmbed()

		if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0)
                return interaction.editReply("`❌｜此連結無效")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setTitle("✅｜曲目已加入")
                .addField(`**[${song.title}](${song.url})**`,"-----------")
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `曲目時長：[${song.duration}]`})
                .setColor("BLUE")

		} else if (interaction.options.getSubcommand() === "playlist") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            if (result.tracks.length === 0)
                return interaction.editReply("❌｜此連結無效")
            
            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            embed
                .setTitle(`✅｜已加入 \`${result.tracks.length}\` 首`)
                .setDescription(`📜｜播放清單 [${playlist.title}](${playlist.url})`)
                .setThumbnail(playlist.thumbnail)
                .setColor("BLUE")
		} else if (interaction.options.getSubcommand() === "search") {
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if (result.tracks.length === 0)
                return interaction.editReply("❓｜找不到關鍵字")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setTitle("✅｜曲目已加入")
                .addField(`**[${song.title}](${song.url})**`,"-----------")
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `曲目時長：[${song.duration}]`})
                .setColor("BLUE")
		}
        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
	},
}