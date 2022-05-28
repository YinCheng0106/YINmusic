module.exports.run = (client, message, args, queue, searcher) => {
    message.channel.send(`📡｜測量中`).then(resultMessage => {
        const ping = resultMessage.createdTimestamp - message.createdTimestamp;

        resultMessage.edit(`🤖 PING : ${ping} | 🌐 PING : ${client.ws.ping}`)
    })
}

module.exports.config = {
    name: "ping",
    aliases: ["PING"]
}