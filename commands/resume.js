module.exports.run = async (client, message, args, queue, searcher) => {
    const serverQueue = queue.get(message.guild.id)
    if(!serverQueue)
        return message.channel.send("❌｜機器人未播放音樂");
    if(message.member.voice.channel != message.guild.me.voice.channel)
        return message.channel.send("❓｜你不在機器人所在的語音");
    if(serverQueue.connection.dispatcher.resumed)
        return message.channel.send("音樂已經在播放了");
    serverQueue.connection.dispatcher.resume();
    message.channel.send("▶️｜音樂恢復播放");
}

module.exports.config = {
    name: "resume",
    aliases: ["r","re","rs"]
}