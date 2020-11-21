const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const pdb = new qdb.table("puanlar");
const limit = new qdb.table("limitler");
const ayar = require("../settings.json");
module.exports.execute = async (client, message, args) => {

    let embed = new MessageEmbed().setTitle(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter('Aether & Serendia').setColor("RANDOM").setTimestamp();
    if (!message.member.roles.cache.has(ayar.banHammer) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`Bu komudu kullanmak için gerekli izinlere sahip değilsin.`)).then(x => x.delete({timeout: 10000}));

    if (args[0] && args[0].includes("list")) {
        message.guild.fetchBans().then(x => {
            let siralama = message.channel.send(`${x.size > 0 ? x.map(z => `${z.user.tag.replace("`", "")} - ${z.user.id}`).join("\n") : "Bu Sunucuda Mevcut Yasaklama Bulunmuyor."}`);
                return siralama;
        });
    };

    if (args[0] && args[0].includes("sorgu")) {
        let uID = args.slice(1).join(" ");
        uID = Number (uID);
        if (!uID) return message.channel.send(embed.setDescription(`Geçerli bir kullanıcı idsi belirtmelisin.`)).then(x => x.delete({timeout: 10000}));
        message.guild.fetchBan(uID).then(({user, reason}) => message.channel.send(embed.setDescription(`${user.tag.replace("`", "")} (\`${user.id}\`) adlı kullanıcı **${reason ? reason : "Sebep Bulunamadı"}** nedeniyle bu sunucudan yasaklanmış.`))).catch(e => message.channel.send("Belirtilen ID'ye ait yasaklanmış kullanıcı bulunamadı.")).then(x => x.delete({timeout: 5000}));
        return;
    };

    let banLimit = limit.get(`banLimit.${message.author.id}.${message.guild.id}`);
    let victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let victimfetch = client.users.fetch(args[0]);
    let reason = args.splice(1).join(" ");
    if (!victim || reason.length < 1) return message.channel.send(embed.setDescription(`Komutu doğru kullanmalısın! \`Örnek: ${ayar.prefix || ""}ban @üye [sebep]\``)).then(x => x.delete({timeout: 10000}));
    if (message.member.roles.highest.position <= victim.roles.highest.position) return message.channel.send(embed.setDescription(`Bu üyenin yetkileri senden yüksek veya aynı yetkide olduğunuz için işlemi gerçekleştiremiyorum.`)).then(x => x.delete({timeout: 10000}));
    if (victim.user.bot) return message.channel.send(embed.setDescription(`Bu komutu botlar üzerinde kullanamazsın!`)).then(x => x.delete({timeout: 10000}));
    
    if (banLimit >= 5) {
        message.guild.owner.send(embed.setDescription(`${message.author} (\`${message.author.id}\`) adlı yetkili 30 dkda 5 tane ban attığı için ban yetkisi alındı.`)).catch();
        message.member.roles.remove(ayar.banHammer).catch();
        limit.delete(`banLimit.${message.author.id}.${message.guild.id}`);
        return;
    }

    message.guild.members.ban(victimfetch.id, {reason: reason}).catch();
    victim.send(embed.setDescription(`**${message.guild.name}** adlı sunucudan **${reason}** gerekçesiyle yasaklandın!`)).catch();
    let cezaID = cdb.get(`cezaid.${message.guild.id}`)+1
    cdb.push("bans", {id: victim.id});
    cdb.add(`cezaid.${message.guild.id}`, +1);
    cdb.set(`punishments.${cezaID}.${message.guild.id}`, { mod: message.author.id, sebep: reason, kisi: victim.id, id: cezaID, zaman: Date.now(), komut: "BAN" });
    cdb.push(`sicil.${victim.id}.${message.guild.id}`, { mod: message.author.id, sebep: reason, id: cezaID, zaman: Date.now(), komut: "BAN" });
    pdb.add(`cezapuan.${victim.id}.${message.guild.id}`, +50);
    pdb.add(`banCez.${message.author.id}.${message.guild.id}`, +1);
    pdb.add(`ban.${victim.id}.${message.guild.id}`, +1);
    if (!message.member.hasPermission("ADMINISTRATOR")) { limit.add(`banLimit.${message.author.id}.${message.guild.id}`, +1)};

    message.channel.send(embed.setDescription(`${victim} (\`${victim.id}\`) adlı üye **${reason}** sebebi ile sunucudan yasaklandı. (\`#${cezaID}\`)`));
    if (message.guild.channels.cache.has(ayar.banLogKanali)) message.guild.channels.cache.get(ayar.banLogKanali).send(embed.setDescription(`${victim} (\`${victim.id}\`) adlı üye **${reason}** sebebi ile ${message.author} (\`${message.author.id}\`) tarafından sunucudan yasaklandı. (\`#${cezaID}\`)`))
    
};

module.exports.configuration = {
    name: "ban",
    aliases: ["yasakla", "yasak"],
    usage: "ban @üye [sebep] / ban list / ban sorgu",
    description: "Ban komududur."
};
