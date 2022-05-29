module.exports.run = async (client, message, args, queue, searcher) => {
    const serverQueue = queue.get(message.guild.id)
    if(!serverQueue)
        return message.channel.send("❌｜機器人未播放音樂");
    if(message.member.voice.channel != message.guild.me.voice.channel)
        return message.channel.send("❓｜你不在機器人所在的語音");

    switch(args[0].toLowerCase()){
        case 'all' :
            serverQueue.loopall = !serverQueue.loopall;
            serverQueue.loopone = false;

            if(serverQueue.loopall === true)
                message.channel.send("已開啟 重複播放 *列表中的歌曲* ")
            else 
                message.channel.send("已關閉 重複播放 *列表中的歌曲*")
            break;
        case 'one' :
            serverQueue.loopone = !serverQueue.loopone;
            serverQueue.loopall = false;

            if(serverQueue.loopone === true)
                message.channel.send("已開啟 重複播放 *現在播放歌曲* ")
            else 
                message.channel.send("已關閉 重複播放 *現在播放歌曲*")
            break;
        case 'off' :
                serverQueue.loopall = false;
                serverQueue.loopone = false;
                message.channel.send("目前沒有使用 重複撥放")
            break;
        default : 
            message.channel.send("無效指令 指令: `!loop <one/all/off>`");
        }
}

module.exports.config = {
    name: "loop",
    aliases: ["lo","lop","lp","LO","LOP","LP","LOOP"]
}