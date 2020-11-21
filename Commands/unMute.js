const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const ayar = require("../settings.json");
module.exports.execute = async (client, message, args) => {

    let embed = new MessageEmbed().setTitle(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter('Aether & Serendia').setColor("RANDOM").setTimestamp();
    if (!message.member.roles.cache.has(ayar.muteHammer) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`Bu komudu kullanmak için gerekli izinlere sahip değilsin.`)).then(x => x.delete({timeout: 10000}));
    let victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let reason = args.splice(1).join(" ");
    if (!victim || reason.length < 1) return message.channel.send(embed.setDescription(`Komutu doğru kullanmalısın! \`Örnek: ${ayar.prefix || ""}unmute @üye [sebep]\``)).then(x => x.delete({timeout: 10000}));
    if (message.member.roles.highest.position <= victim.roles.highest.position) return message.channel.send(embed.setDescription(`Bu üyenin yetkileri senden yüksek veya aynı yetkide olduğunuz için işlemi gerçekleştiremiyorum.`)).then(x => x.delete({timeout: 10000}));
    if (victim.user.bot) return message.channel.send(embed.setDescription(`Bu komutu botlar üzerinde kullanamazsın!`)).then(x => x.delete({timeout: 10000}));
    
    let mutes = cdb.get("tempmute") || [];
    let vmutes = cdb.get("voicemute") || [];

    victim.roles.remove(ayar.muteRol).catch();
    if (mutes.some(x => x.id === victim.id)) cdb.set("tempmute", mutes.filter(x => x.id !== victim.id));
    if (vmutes.some(x => x.id === victim.id)) cdb.set("voicemute", vmutes.filter(x => x.id !== victim.id));
    cdb.set(`mstatus.${victim.id}.${message.guild.id}`, false);
    cdb.set(`vstatus.${victim.id}.${message.guild.id}`, false);
    if (victim.voice.channel) victim.voice.setMute(false);

    message.channel.send(embed.setDescription(`${victim} adlı üyenin susturması **${reason}** sebebi ile kaldırıldı.`));
    if (message.guild.channels.cache.has(ayar.muteLogKanali)) message.guild.channels.cache.get(ayar.muteLogKanali).send(embed.setDescription(`${victim} adlı üyenin susturması **${reason}** sebebi ile ${message.author} tarafından kaldırıldı.`));
    victim.send(`**${message.guild.name}** adlı kanaldaki susturman bir yetkili tarafından kaldırıldı!`).catch();

};

module.exports.configuration = {
    name: "unmute",
    aliases: ["unmute"],
    usage: "unmute @üye [sebep]",
    description: "Belirtilen üyenin metin kanallarında ve ses kanallarında olan susturmasını kaldırır."
};
