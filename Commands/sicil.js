const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const pdb = new qdb.table("puanlar");
const ayar = require("../settings.json");
module.exports.execute = async (client, message, args) => {

    let embed = new MessageEmbed().setTitle(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter('Aether & Serendia').setColor("RANDOM").setTimestamp();
    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
    let data = cdb.get(`sicil.${user.id}.${message.guild.id}`) || [];
    let siralama = data.length > 0 ? data.map((value, index) => `\`${index+1}.\` [**${value.komut}**] ${client.users.cache.get(value.mod) || value.mod} tarafından **${value.sebep}** nedeniyle ${new Date(value.zaman).toTurkishFormatDate()} zamanında cezalandırılmış. (\`#${value.cezaID}\`)`).join("\n") : "Bu Üyenin Ceza Bilgisi Bulunamadı."
    message.channel.send(embed.setDescription(`${siralama}`));

};

module.exports.configuration = {
    name: "sicil",
    aliases: ["sicil"],
    usage: "sicil",
    description: "Belirtilen üyenin yediği önceki cezaları sıralarsınız."
};
