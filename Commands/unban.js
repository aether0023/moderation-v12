const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const ayar = require("../settings.json");
module.exports.execute = async (client, message, args) => {
    let embed = new MessageEmbed().setTitle(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter('Aether & Serendia').setColor("RANDOM").setTimestamp();
    if (!message.member.roles.cache.has(ayar.banHammer) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`Bu komudu kullanmak için gerekli izinlere sahip değilsin.`)).then(x => x.delete({timeout: 10000}));
  if (!args[0] || isNaN(args[0])) return message.channel.send(embed.setDescription("Geçerli bir kullanıcı IDsi girmelisin.")).then(x => x.delete({timeout: 5000}));
  let victim = await client.users.fetch(args[0]);
  if (victim) {
    message.guild.members.unban(victim.id).catch(err => message.channel.send(embed.setDescription("Belirtilen ID numarasına sahip bir ban bulunamadı!")).then(x => x.delete({timeout: 5000})));
    message.channel.send(embed.setDescription(`Belirtilen üyenin yasaklaması başarılı bir şekilde kaldırıldı!`));
    let bans = cdb.get("bans") || [];
    if (bans.some(yasak => yasak.id === victim.id)) cdb.set("bans", bans.filter(x => x.id !== victim.id));
    if(ayar.banLogKanali && client.channels.cache.has(ayar.banLogKanali)) client.channels.cache.get(ayar.banLogKanali).send(embed.setDescription(`${victim} (\`${victim.id}\`) adlı üyenin banı ${message.author} tarafından kaldırıldı.`));
  } else {
    message.channel.send(embed.setDescription("Geçerli bir kullanıcı IDsi girmelisin.")).then(x => x.delete({timeout: 5000}));
  };
};
module.exports.configuration = {
  name: "unban",
  aliases: ["yasak-kaldır"],
  usage: "unban [id] [isterseniz sebep]",
  description: "Belirtilen kişinin banını kaldırır."
};