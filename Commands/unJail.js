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
    if (!victim || reason.length < 1) return message.channel.send(embed.setDescription(`Komutu doğru kullanmalısın! \`Örnek: ${ayar.prefix || ""}unjail @üye [sebep]\``)).then(x => x.delete({timeout: 10000}));
    if (message.member.roles.highest.position <= victim.roles.highest.position) return message.channel.send(embed.setDescription(`Bu üyenin yetkileri senden yüksek veya aynı yetkide olduğunuz için işlemi gerçekleştiremiyorum.`)).then(x => x.delete({timeout: 10000}));
    if (victim.user.bot) return message.channel.send(embed.setDescription(`Bu komutu botlar üzerinde kullanamazsın!`)).then(x => x.delete({timeout: 10000}));
    let ceza = cdb.get("jail") || [];


        victim.roles.cache.has(ayar.boosterRol) ? victim.roles.set([ayar.boosterRol, ayar.kayıtsızRol]) : victim.roles.set([ayar.kayıtsızRol]);
        if (ceza.some(x => x.id === victim.id)) cdb.set("jail", ceza.filter(x => x.id !== victim.id));

    message.channel.send(embed.setDescription(`${victim} adlı üyenin cezası **${reason}** sebebi ile kaldırıldı.`));
    if (message.guild.channels.cache.has(ayar.jailLogKanali)) message.guild.channels.cache.get(ayar.jailLogKanali).send(embed.setDescription(`${victim} (\`${victim.id}\`) adlı üyenin jaili ${message.author} adlı yetkili tarafından **${reason}** sebebi ile kaldırıldı.`))

};

module.exports.configuration = {
    name: "unjail",
    aliases: ["uncezalı"],
    usage: "unjail @üye [sebep]",
    description: "Belirtilen üyenin sunucudaki cezasını kaldırır."
};
