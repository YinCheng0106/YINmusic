/*
module.exports.run = async (client, message, args, queue, searcher) => {
    const serverQueue = queue.get(message.guild.id)
    
    if(!serverQueue)
        return message.channel.send("❌｜機器人未播放音樂");

    if(message.member.voice.channel != message.guild.me.voice.channel)
        return message.channel.send("❓｜你不在機器人所在的語音");

    if(serverQueue.connection.dispatcher.paused)
        return message.channel.send("音樂已經暫停，你還想暫停什麼?");

    serverQueue.connection.dispatcher.pause();
    message.channel.send("⏸️｜音樂已暫停");
}

module.exports.config = {
    name: "pause",
    aliases: ["ps","PS","PAUSE"]
}
*/