const { MessageEmbed } = require('discord.js');
module.exports.execute = async (client, message, args) => {
    
    let embed = new MessageEmbed().setTitle(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter('Aether & Serendia').setColor("RANDOM").setTimestamp();
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`Bu komudu kullanmak için gerekli izinlere sahip değilsin.`)).then(x => x.delete({timeout: 10000}));
    let miktar = Number (args[0]);
    if (!miktar || miktar < 1 || miktar > 100) return message.channel.send(embed.setDescription(`Geçerli bir miktar belirtmelisin.`)).then(x => x.delete({timeout: 10000}));
    message.delete();
    message.channel.bulkDelete(miktar).then(x => message.channel.send(`**${x.size}** adet mesaj başarılı bir şekilde silindi!`)).then(y => y.delete({timeout: 4000}));

};

module.exports.configuration = {
    name: "temizle",
    aliases: ["sil"],
    usage: "temizle [miktar]",
    description: "Belirtilen miktar kadar komutun kullanıldığı kanaldaki mesajları siler."
};
