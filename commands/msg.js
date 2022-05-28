module.exports.run = (message) => {
    message.chennel.send("Hello!");
}
module.exports.config = {
    name : "hello",
    aliases : ["hi","hey","yo"]
}