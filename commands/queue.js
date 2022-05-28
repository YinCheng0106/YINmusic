const Discord = require('discord.js');

module.exports.run = async (client, message, args, queue, searcher) => {
    const serverQueue = queue.get(message.guild.id);
    if(!serverQueue)
        return message.channel.send("❌｜機器人未播放音樂");
    if(message.member.voice.channel != message.guild.me.voice.channel)
        return message.channel.send("❓｜你不在機器人所在的語音");
    
    let currentPage = 0;

    const embeds = embedsGenerator(serverQueue);
    

    const queueEmbed = await message.channel.send(`📜｜待播清單 ${currentPage +1}/${embeds.length}`, embeds[currentPage])
    await queueEmbed.react('⬅️');
    await queueEmbed.react('➡️');

    const reactionFilter = (reaction, user) => ['⬅️','➡️'].includes(reaction.emoji.name) && (message.author.id === user.id);
    const collector = queueEmbed.createReactionCollector(reactionFilter);

    collector.on('collect', (reaction, user) => {
        if(reaction.emoji.name === '➡️') {
            if(currentPage < embeds.length-1) {
                currentPage += 1;
                queueEmbed.edit(`📜｜待播清單 ${currentPage +1}/${embeds.length}`, embeds[currentPage])
                message.reactions.resolve(reaction).users.remove(user)
            }
        }else if (reaction.emoji.name === '⬅️') {
            if (currentPage !== 0) {
                currentPage -= 1;
                queueEmbed.edit(`📜｜待播清單 ${currentPage +1}/${embeds.length}`, embeds[currentPage])
                message.reactions.resolve(reaction).users.remove(user)
            }
        }
    })
}

function embedsGenerator(serverQueue) {
    const embeds = [];
    let songs = 11;
    for(let i = 1; i <serverQueue.songs.length; i += 10) {
        const current = serverQueue.songs.slice(i, songs);
        songs += 10;
        let j = i - 1;
        const info = current.map(song => `[${++j}]｜[${song.title}](${song.url})`).join('\n');
        const msg = new Discord.MessageEmbed()
            .setDescription(`🎵｜正在播放 [${serverQueue.songs[0].title}](${serverQueue.songs[0].url})\n${info}`)
        embeds.push(msg)
    }
    return embeds;
}

module.exports.config = {
    name: "queue",
    aliases: ["q", "qu"]
}