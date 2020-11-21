const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const pdb = new qdb.table("puanlar");
const ayar = require("../settings.json");
module.exports.execute = async (client, message, args) => {

    let embed = new MessageEmbed().setTitle(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter('Aether & Serendia').setColor("RANDOM").setTimestamp();
    if (!message.member.roles.cache.has(ayar.jailHammer) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`Bu komudu kullanmak için gerekli izinlere sahip değilsin.`)).then(x => x.delete({timeout: 10000}));
    let victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let reason = args.splice(1).join(" ");
    if (!victim || reason.length < 1) return message.channel.send(embed.setDescription(`Komutu doğru kullanmalısın! \`Örnek: ${ayar.prefix || ""}jail @üye [sebep]\``)).then(x => x.delete({timeout: 10000}));
    if (message.member.roles.highest.position <= victim.roles.highest.position) return message.channel.send(embed.setDescription(`Bu üyenin yetkileri senden yüksek veya aynı yetkide olduğunuz için işlemi gerçekleştiremiyorum.`)).then(x => x.delete({timeout: 10000}));
    if (victim.user.bot) return message.channel.send(embed.setDescription(`Bu komutu botlar üzerinde kullanamazsın!`)).then(x => x.delete({timeout: 10000}));
    
    victim.roles.cache.has(ayar.boosterRol) ? victim.roles.set([ayar.boosterRol, ayar.cezaliRol]) : victim.roles.set([ayar.cezaliRol]);
    let cezaID = cdb.get(`cezaid.${message.guild.id}`)+1
    cdb.add(`cezaid.${message.guild.id}`, +1);
    cdb.push("jail", { id: victim.id });
    cdb.set(`punishments.${cezaID}.${message.guild.id}`, { mod: message.author.id, sebep: reason, kisi: victim.id, id: cezaID, zaman: Date.now(), komut: "JAIL" });
    cdb.set(`jstatus.${victim.id}.${message.guild.id}`, true)
    cdb.push(`sicil.${victim.id}.${message.guild.id}`, { mod: message.author.id, sebep: reason, id: cezaID, zaman: Date.now(), komut: "JAIL" });
    pdb.add(`cezapuan.${victim.id}.${message.guild.id}`, +15);
    pdb.add(`jailCez.${message.author.id}.${message.guild.id}`, +1);
    pdb.add(`jail.${victim.id}.${message.guild.id}`, +1);

    if (victim.voice.channel) victim.voice.kick();
    message.channel.send(embed.setDescription(`${victim} adlı üye **${reason}** sebebi ile cezalıya gönderildi. (\`#${cezaID}\`)`));
    if (message.guild.channels.cache.has(ayar.jailLogKanali)) message.guild.channels.cache.get(ayar.jailLogKanali).send(embed.setDescription(`${victim} adlı üye **${reason}** sebebi ile ${message.author} tarafından cezalıya gönderildi! (\`${cezaID}\`)`))

};

module.exports.configuration = {
    name: "jail",
    aliases: ["cezalı", "ceza", "karantina"],
    usage: "jail @üye [sebep]",
    description: "Belirtilen üyeyi sunucuda hiç bir yeri göremeyecek şekilde cezalandırır."
};
