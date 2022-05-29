const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const Discord = require("discord.js");

let timer;
module.exports.run = async (client, message, args, queue, searcher) => {
    const vc = message.member.voice.channel;
    if(!vc)
        return message.channel.send("❓｜你必須在語音頻道");

    if (args.length < 1)
        return message.channel.send("❓｜請輸入連結或關鍵字")
    
    let url = args.join("")
    if(url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)){
        try{
            await ytpl(url).then(async playlist => {
                message.channel.send(`📡｜正在加入播放清單 **${playlist.title}**`)
                playlist.items.forEach(async item => {
                    await videoHander(await ytdl.getInfo(item.shortUrl), message, vc, true);
                })
            })
        }catch(err){
            return message.channel.send(`❌｜此連結無效`)
        }
    }
    else {
        let result = await searcher.search(args.join(" "), {type: "video"})
        if(result.first == null)
            return message.channel.send("❌｜此播放清單無效");
        try {
            let songInfo = await ytdl.getInfo(result.first.url);
            return videoHander(songInfo, message, vc)
            }catch(err){
                message.channel.send(`❌｜此播放清單無法播放`)
                console.log(err)
            }
    }
    //message.channel.send(`✅｜播放清單 **${playlist.title}** 加入完成`)
            
    async function videoHander(songInfo, message, vc, playlist = false) {
        clearTimeout(timer);
        const serverQueue = queue.get(message.guild.id);
        const song = {
            title : songInfo.videoDetails.title,
            url : songInfo.videoDetails.video_url,
            vLength: songInfo.videoDetails.lengthSeconds,
            thumbnail : songInfo.videoDetails.thumbnails[3].url
        }
        if(!serverQueue){
            const queueConstructor = {
                txtChannel : message.channel,
                vChannel : vc,
                connection : null,
                songs : [],
                volume : 0.5,
                Bitrate: 192000,
                playing : true,
                loopone : false,
                loopall : false
            };
            queue.set(message.guild.id, queueConstructor);

            queueConstructor.songs.push(song);

            try {
                let connection = await vc.join();
                queueConstructor.connection = connection;
                play(message.guild, queueConstructor.songs[0]);
            } catch (err) {
                console.error(err);
                queue.delete(message.guild.id);
                return message.channel.send(`❌｜無法加入語音`)
            }
        } else {
            serverQueue.songs.push(song);
            if(serverQueue.songs.length === 1)
                play(message.guild, serverQueue.songs[0])
            if(playlist) return;
            let dur = `\`${parseInt(song.vLength / 60)}:${song.vLength - 60 * parseInt(song.vLength / 60)}\``
            let msg = new Discord.MessageEmbed()
                .setTitle("✅｜曲目已加入")
                .addField(song.title, "-----------")
                .addField("曲目時長：" + `${dur}`)
                .addField("待播`" + serverQueue.songs.lastIndexOf(song) + "`首")
                .setThumbnail(song.thumbnail)
                .setColor("BLUE")
            return message.channel.send(msg);
        }
    }
    function play(guild, song){
        const serverQueue = queue.get(guild.id);
        if(!song){
            timer = setTimeout(function() {
                serverQueue.txtChannel.send("👋｜沒事我就先離開囉~")
                serverQueue.vChannel.leave();
                queue.delete(guild.id);
            }, 30000)
            return;
        }
        const dispatcher = serverQueue.connection
            .play(ytdl(song.url))
            .on('finish', () =>{
                if(serverQueue.loopone) {
                    play(guild, serverQueue.songs[0])
                }
                else if(serverQueue.loopall) {
                    serverQueue.songs.push(serverQueue.songs[0])
                    serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0]);
                } else {
                    serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0]);
                }
            })
            let dur = `\`${parseInt(serverQueue.songs[0].vLength / 60)}:${serverQueue.songs[0].vLength - 60 * parseInt(serverQueue.songs[0].vLength / 60)}\``
            let msg = new Discord.MessageEmbed()
                .setTitle("🎵｜正在播放")
                .addField(serverQueue.songs[0].title, "-----------")
                .addField("曲目時長：" + `${dur}`)
                .setThumbnail(serverQueue.songs[0].thumbnail)
                .setColor("BLUE")
            return message.channel.send(msg);
    }
}

module.exports.config = {
    name : 'play',
    aliases : ["p", "pl","P","PL","PLAY"]
}