module.exports.run = async (client, message, args, queue, searcher) => {
    const serverQueue = queue.get(message.guild.id)
    if(!serverQueue)
        return message.channel.send("❌｜機器人未使用");
    if(message.member.voice.channel != message.guild.me.voice.channel)
        return message.channel.send("❓｜你不在機器人所在的語音");
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end()
    ;
}

module.exports.config = {
    name: "stop",
    aliases: ["s","st","S","ST","STOP"]
}