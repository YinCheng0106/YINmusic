module.exports.run = async (client, message, args, queue, searcher) => {
    const serverQueue = queue.get(message.guild.id);
    if(message.member.voice.channel!= message.guild.me.voice.channel)
            return message.channel.send("❓｜你不在機器人所在的語音");
    if(!serverQueue)
        return message.channel.send("❌｜機器人未使用");

    shuffleQueue(serverQueue.songs, message);
}

function shuffleQueue (squeue, message) {
    for(let i = squeue.lenght - 1; i > 0; i--) {
        let j = Math.round(Math.random() * (i + 1));
        while(j == 0)
            j = Math.round(Math.random() * (i + 1));
        const temp = squeue[i];
        squeue[i] = squeue[j];
        squeue[j] = temp;
    }
    message.channel.send("🔀｜待播清單 已打亂");
    return squeue;
}

module.exports.config = {
    name: "shuffle",
    aliases: ["sf","shuf"]
}