const { MessageEmbed } = require("discord.js");
module.exports.execute = async (client, message, args) => {
    
    let embed = new MessageEmbed().setTitle(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter('Aether & Serendia').setColor("RANDOM").setTimestamp();
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`Bu komudu kullanmak için gerekli izinlere sahip değilsin.`)).then(x => x.delete({timeout: 10000}));
    let miktar = Number (args[0]);
    message.channel.setRateLimitPerUser(miktar).catch();
    message.react("✅");

};

module.exports.configuration = {
    name: "slowmode",
    aliases: ["slowmod", "yavaşmod", "yavaş-mod"],
    usage: "slowmode [miktar]",
    description: "Belirtilen miktar kadar komutun kullanıldığı kanalı yavaşlatır."
};
