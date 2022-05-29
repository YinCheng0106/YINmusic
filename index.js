const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
//const {token} = require('./setting.json');
const fs =require('fs');
//const { YTSearcher } = require('yt-search')//

const { YTSearcher } = require('ytsearcher');


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

const searcher = new YTSearcher({
    key: process.env.yt_api,
    revealed: true
});

fs.readdir("./commands/", (e, f) => {
    if(e) return console.error(e);
    f.forEach(file => {
        if(!file.endsWith(".js")) return
        console.log(`${file} 完成載入`)
        let cmd = require(`./commands/${file}`);
        let cmdName = cmd.config.name;
        client.commands.set(cmdName, cmd)
        cmd.config.aliases.forEach(alias => {
            client.aliases.set(alias, cmdName);
        })
    })
})

const queue = new Map();

client.on('ready',() => {
    console.log('>>機器人啟動完成<<');
/*
    client.user.setPresence({
        status: "dnd",
        game: {
            name: `${len(client.guilds)} 個伺服器 ‖ YINmusic`,
            type: "PLAYING"
        }
    });
*/
});

client.on("message", async(message) => {
    const prefix = '!';

    if(!message.content.startsWith(prefix)) return
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

    if(!cmd) return

    try {
        cmd.run(client, message, args, queue, searcher);
    }catch (err){
        return console.error(err)
    }
        
})

client.login(process.env.token);