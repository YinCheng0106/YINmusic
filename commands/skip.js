module.exports.run = async (client, message, args, queue, searcher) => {
    const serverQueue = queue.get(message.guild.id)
    if(message.member.voice.channel!= message.guild.me.voice.channel)
            return message.channel.send("❓｜你不在機器人所在的語音");
    if(!serverQueue)
        return message.channel.send("❌｜機器人未使用");
    serverQueue.connection.dispatcher.end();
}

module.exports.config = {
    name: "skip",
    aliases: ["sk","SK","SKIP"]
}