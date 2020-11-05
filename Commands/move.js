const { MessageEmbed } = require('discord.js');
module.exports.execute = async (client, message, args) => {

    let embed = new MessageEmbed().setTitle(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RANDOM").setTimestamp();
    let victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!victim || message.author.id == victim.id) return message.channel.send(embed.setDescription(`Bir üye belirtmelisin.`)).then(x => x.delete({timeout: 10000}));
    if (!message.member.voice.channel || !victim.voice.channel || message.member.voice.channelID == victim.voice.channelID) return message.channel.send(embed.setDescription(`Belirtilen üye veya sen sesli kanalda değilsin.`)).then(x => x.delete({timeout: 10000}));
    if (message.member.hasPermission("ADMINISTRATOR")) {
        victim.voice.setChannel(message.member.voice.channelID).catch();
        message.delete();

    }else{

    const filter = (reaction, user) => {
        return ["✅"].includes(reaction.emoji.name) && user.id === victim.id; 
        };

        message.channel.send(embed.setDescription(`${victim}, ${message.author} adlı üye seni sesli kanalına davet etmek istiyor, kabul ediyor musun?`).setFooter(`Kabul etmek için 15 saniyen mevcut.`)).then(x => {
            x.react("✅");
            x.awaitReactions(filter, {max: 1, time: 15000, error: ['time']}).then(resp => {
                let response = resp.first();
                if (response) {
                    victim.voice.setChannel(message.member.voice.channelID).catch();
                    x.delete();
                    message.delete();
                };
            });
        });
    };
};

module.exports.configuration = {
    name: "move",
    aliases: ["çek"],
    usage: "çek @üye",
    description: "Belirtilen üyeyi yanınıza çekersiniz/çekmek için istek gönderirsiniz."
};
