const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const pdb = new qdb.table("puanlar");
const ms = require("ms");
const moment = require("moment");
const ayar = require("../settings.json");
module.exports.execute = async (client, message, args) => {

    let embed = new MessageEmbed().setTitle(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter('Aether & Serendia').setColor("RANDOM").setTimestamp();
    if (!message.member.roles.cache.has(ayar.muteHammer) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`Bu komudu kullanmak için gerekli izinlere sahip değilsin.`)).then(x => x.delete({timeout: 10000}));
    let victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let time = args[1]
    let reason = args.splice(2).join(" ");
    if (!victim || !time || !ms(time) || reason.length < 1) return message.channel.send(embed.setDescription(`Komutu doğru kullanmalısın! \`Örnek: ${ayar.prefix || ""}cmute @üye [süre (1s/1d/1m/1h) ] [sebep]\``)).then(x => x.delete({timeout: 10000}));
    if (message.member.roles.highest.position <= victim.roles.highest.position) return message.channel.send(embed.setDescription(`Bu üyenin yetkileri senden yüksek veya aynı yetkide olduğunuz için işlemi gerçekleştiremiyorum.`)).then(x => x.delete({timeout: 10000}));
    if (victim.user.bot) return message.channel.send(embed.setDescription(`Bu komutu botlar üzerinde kullanamazsın!`)).then(x => x.delete({timeout: 10000}));
    
    let yaziSure = time.replace("h", "Saat").replace("m", "Dakika").replace("d", "Gün").replace("s", "Saniye");
    let atilanAy = moment(Date.now()).format("MM");
    let atilanSaat = moment(Date.now()).format("HH:mm:ss");
    let atilanGün = moment(Date.now()).format("DD");
    let bitişAy = moment(Date.now()+ms(time)).format("MM");
    let bitişSaat = moment(Date.now()+ms(time)).format("HH:mm:ss");
    let bitişGün = moment(Date.now()+ms(time)).format("DD");

    let muteAtılma = `${atilanGün} ${atilanAy.replace("01", "Ocak").replace("02", "Şubat").replace("03", "Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık")} ${atilanSaat}`;
    let muteBitiş = `${bitişGün} ${bitişAy.replace("01", "Ocak").replace("02", "Şubat").replace("03", "Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık")} ${bitişSaat}`;

    victim.roles.add(ayar.muteRol).catch();
    let cezaID = cdb.get(`cezaid.${message.guild.id}`)+1
    cdb.add(`cezaid.${message.guild.id}`, +1);
    cdb.push("tempmute", { id: victim.id, bitis: Date.now()+ms(time) });
    cdb.set(`punishments.${cezaID}.${message.guild.id}`, { mod: message.author.id, sebep: reason, kisi: victim.id, id: cezaID, zaman: Date.now(), komut: "TEMP-MUTE" });
    cdb.set(`mstatus.${victim.id}.${message.guild.id}`, true);
    cdb.push(`sicil.${victim.id}.${message.guild.id}`, { mod: message.author.id, sebep: reason, id: cezaID, zaman: Date.now(), komut: "TEMP-MUTE" });
    pdb.add(`cezapuan.${victim.id}.${message.guild.id}`, +10);
    pdb.add(`cmuteCez.${message.author.id}.${message.guild.id}`, +1);
    pdb.add(`cmute.${victim.id}.${message.guild.id}`, +1);

    message.channel.send(embed.setDescription(`${victim} adlı üye **${reason}** sebebi ile **${yaziSure}** boyunca metin kanallarında susturuldu. (\`#${cezaID}\`)`));
    if (message.guild.channels.cache.has(ayar.muteLogKanali)) message.guild.channels.cache.get(ayar.muteLogKanali).send(embed.setDescription(`${victim} adlı üye **${reason}** sebebi ile **${yaziSure}** boyunca ${message.author} tarafından metin kanallarında susturuldu. \n\n• Ceza Numarası: \`#${cezaID}\` \n• Ceza Alan: ${victim} (\`${victim.id}\`) \n• Yetkili: ${message.author} (\`${message.author.id}\`) \n• Başlangıç Tarihi: \`${muteAtılma}\` \n• Bitiş Tarihi: \`${muteBitiş}\` \n• Sebep: \`${reason}\``));

};

module.exports.configuration = {
    name: "mute",
    aliases: ["cmute", "chatmute", "sustur"],
    usage: "cmute @üye [süre] [sebep]",
    description: "Belirtilen üyeyi metin kanallarında süreli bir şekilde susturur."
};
