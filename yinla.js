const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const {token} = require('./setting.json');
const prefix = require('./config.json');


//#region 登入
client.on('ready',() => {
    console.log('>>機器人啟動完成<<');
});
//#endregion

//#region 事件
client.on('message',msg =>{
    try {
        if (!msg.guild || !msg.member) return;
        if (!msg.member.user) return;
        if (msg.member.user.bot) return;
    } catch (err){
        return;
    }

    try {
        let tempPrefix = '-1';
        const prefixED = Object.keys(prefix); 
        prefixED.forEach(element => {
            if (msg.content.substring(0, prefix[element].Value.length) === prefix[element].Value) {
                tempPrefix = element;
            }
        });


        switch (tempPrefix) {
            case '0': //文字回應功能
                BasicFunction(msg, tempPrefix);
                break;
            case '1': //音樂指令 
                MusicFunction(msg);
                break;
        }       
        switch (cmd[0]) {
            case 'myAvatar':
                const avatar = GetMyAvatar(msg);
                if (avatar.files) msg.channel.send(`${msg.author}`, avatar);
    
            break;
        }
        
    } catch (err) {
        console.log('OnMessageError', err);   
    }
});
//#endregion

//#region function
function GetMyAvatar(msg) {
    try {
        return {
            files: [{
                attachment: msg.author.displayAvatarURL('png', true),
                name: 'avatar.png'
            }]
        };
    } catch (err) {
        console.log('GetMyAvatar,Error');
    }
}
//#endregion

//#region 音樂系統
let dispatcher = new Map();

let musicList = new Map();

function MusicFunction(msg) {
    const content = msg.content.substring(prefix[1].Value.length);
    const splitText = ' ';
    const contents = content.split(splitText);
    const guildID = msg.guild.id;

    switch (contents[0]) {
        case 'play':
            playMusic(guildID, msg, contents);
            break;
        case 'replay':
            break;
        case 'np':
            nowPlayMusic(guildID, msg.channel.id);
            break;
        case 'queue':
            queueShow(guildID, msg.channel.id);
            break;
        case 'skip':
            skipMusic(guildID);
            break;
        case 'disconnect':
            disconnectMusic(guildID, msg.channel.id);
            break;
        case 'playList':
            playListMusic(guildID, msg);
            break;
    }
}

async function playMusic(guildID, msg, contents) {

    const urlED = contents[1];
    try {
        if (urlED.substring(0, 4) !== 'http') return msg.reply('請輸入有效連結:1');
        const validate = await ytdl.validateURL(urlED);
        if (!validate) return msg.reply('請輸入有效連結:2');
        const info = await ytdl.getInfo(urlED);
        if (info.videoDetails) {
            if (msg.member.voice.channel) {
                if (!client.voice.connections.get(msg.guild.id)) {
                    musicList.set(guildID,new Array());
                    musicList.get(guildID).push(urlED);

                    msg.member.voice.channel.join()
                        .then(connection => {
                            msg.reply('來了~');
                            //const guildID = msg.guild.id;
                            const channelID = msg.channel.id;
                            playMusic2(connection, guildID, channelID);
                        })
                        .catch(err => {
                            msg.reply('bot進入語音頻道時發生錯誤，請再試一次');
                            console.log(err, 'playMusicError2');
                        })
                } else {
                    musicList.get(guildID).push(urlED);
                    msg.reply('已將歌曲加入歌單!');
                }
            } else return msg.reply('請先進入頻道:3...');
        } else return msg.reply('請輸入有效連結:3');
    } catch (err) {
        console.log(err, 'playMusicError');
    }
}

async function playMusic2(connection, guildID, channelID) {
    try {
        if (musicList.get(guildID).length > 0) {
            const streamOptions = {
                seek: 0,
                volume: 0.5,
                Bitrate: 192000,
                Passes: 1,
                highWaterMark: 1
            };
            const stream = await ytdl(musicList.get(guildID)[0],{
                filter: 'audioonly',
                quality: 'highestaudio',
                highWaterMark: 26214400 //25ms
            })

            dispatcher.set(guildID,connection.play(stream, streamOptions));
            dispatcher.get(guildID).on("finish", finish => {
                if (musicList.get(guildID).length > 0) musicList.get(guildID).shift();
                playMusic2(connection, guildID ,channelID);
            })
        } else disconnectMusic(guildID, channelID);
    } catch (err) {
        console.log(err, 'playMusic2Error');
}
}

function disconnectMusic(guildID, channelID) {
    try {
        if (client.voice.connections.get(guildID)) {
            musicList.set(guildID,new Array());
            client.voice.connections.get(guildID).disconnect();
            client.channels.fetch(channelID).then(channel => channel.send('音樂已結束或中斷'));
        } else client.channels.fetch(channelID).then(channel => channel.send('可是..我還沒進來'))
    } catch (err) {
        console.log(err, 'disconnectMusicError');
    }
}

function skipMusic(guildID){
    if (dispatcher.get(guildID) !== undefined) dispatcher.get(guildID).end();
}

// 重播歌曲
function replayMusic(guildID) {
    if (musicList.get(guildID).length > 0) {
        musicList.get(guildID).unshift(musicList[0]);
        if (dispatcher.get(guildID) !== undefined) dispatcher.get(guildID).end();
    }
}

async function queueShow(guildID, channelID) {
    try {
        if (musicList.get(guildID).length > 0) {
            let info;
            let message = '';
            for (i = 0; i < musicList.get(guildID).length; i++) {
                info = await ytdl.getInfo(musicList.get(guildID)[i]);
                author = info.videoDetails.ownerChannelName;
                title = info.videoDetails.title;
                songLength = info.videoDetails.lengthSeconds
                const H = parseInt(songLength/3600);
                const M = parseInt((songLength-(60*H))/60);
                const S = parseInt(songLength%60);
                message = message + `\n[${i+1}] *${author}*｜ **${title}** (\`${H}:${M}:${S}\`)`;
            }
            message = message.substring(1, message.length);
            if (message.length > 1900) message =message.substring(0, 1900);
            client.channels.fetch(channelID).then(channel => channel.send(message))
        }
    } catch (err) {
        console.log(err, 'queueShowError');
    }
}

async function nowPlayMusic(guildID,channelID) {
    try {
        if (dispatcher.get(guildID) !== undefined && musicList.get(guildID).length > 0) {
            const info = await ytdl.getInfo(musicList.get(guildID)[0]);
            const author = info.videoDetails.ownerChannelName;
            const title = info.videoDetails.title;
            const songLength = info.videoDetails.lengthSeconds;
            //songLength
            const H = parseInt(songLength/3600);
            const M = parseInt((songLength-(60*H))/60);
            const S = parseInt(songLength%60);
            
            const nowSongLength = Math.floor(dispatcher.get(guildID).streamTime / 1000);
            //nowSongLength
            const h = parseInt(nowSongLength/3600);
            const m = parseInt((nowSongLength-(60*H))/60);
            const s = parseInt(nowSongLength%60);
            const message = `頻道：${author}\n歌曲名稱：${title} 曲目時間：\`${H}:${M}:${S}\`\n${streamString(songLength,nowSongLength)} \`${h}:${m}:${s}\/${H}:${M}:${S}\``
            client.channels.fetch(channelID).then(channel => channel.send(message))
        }
    } catch (err) {
        console.log(err, 'nowPlayMusicError');
    }
}

function streamString(songLength, nowSongLength) {
    let mainText = '🔘';
    const secondText = '▬';
    const whereMain = Math.floor((nowSongLength / songLength) * 100);
    let message = '';
    for (i = 1 ; i <= 10 ; i++) {
        if (i * 9.9 + 1 >= whereMain) {
            message = message +mainText;
            mainText =secondText;
        } else {
            message = message +secondText;
        }
    }
    return message;
}

async function playListMusic(guildID, msg) {
    try {
        if (!client.voice.connections.get(guildID)) {
            msg.channel.send(`請先正常啟用音樂指令後，再使用歌單載入喔`);
            return false;
        }
        const valueED = msg.content.split(' ');
        const canPlay = await ytpl.validateID(valueED[1]);
        let a = 0;
        let b = 0;
        if (canPlay) {
            const listED = await ytpl(valueED[1]);
            await listED.items.forEach(async function(element) {
                a = a + 1;
                if (element.title !== '[Deleted video]') {
                    canPlay2 = await ytdl.validateURL(element.url_simple);
                    if (canPlay2) {
                        b = b + 1;
                        musicList.get(guildID).push(element.url_simple);
                    }
                }
            });
            msg.channel.send(`播放清單： ${listED.title}\n 共載入 \`${b}\` 首歌曲，\`${a-b}\` 首載入失敗`);
        } else {
            msg.channel.send(`This Url isn't working in function.`);
        }
    } catch (err) {
        console.log(err, 'playListMusicError');
    }
}
//#endregion

client.login(token);