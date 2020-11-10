const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const pdb = new qdb.table("puanlar");
const ayar = require("../settings.json");
const moment = require("moment");
module.exports.execute = async (client, message, args) => {

    let embed = new MessageEmbed().setTitle(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RANDOM").setTimestamp();
    let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
    let uye = message.guild.member(victim)

    let jail = pdb.get(`jail.${victim.id}.${message.guild.id}`);
    let ban = pdb.get(`ban.${victim.id}.${message.guild.id}`);
    let cmute = pdb.get(`cmute.${victim.id}.${message.guild.id}`);
    let vmute = pdb.get(`vmute.${victim.id}.${message.guild.id}`);
    let jailCez = pdb.get(`jailCez.${victim.id}.${message.guild.id}`);
    let banCez = pdb.get(`banCez.${victim.id}.${message.guild.id}`);
    let cmuteCez = pdb.get(`cmuteCez.${victim.id}.${message.guild.id}`);
    let vmuteCez = pdb.get(`vmuteCez.${victim.id}.${message.guild.id}`);
    let cpuan = pdb.get(`cezapuan.${victim.id}.${message.guild.id}`);

    let durum;
    if (cpuan >= 50) durum = "Tehlikeli";
    if (cpuan < 50) durum = "Güvenli";
    if (cpuan == null || cpuan == undefined) durum = "Analiz Edilemedi";

    let cezabilgisi = `\`${jail || '0'}\` adet jail, \`${ban || '0'}\` adet ban, \`${cmute+vmute || '0'}\` mute (\`${cmute || '0'} chat\` - \`${vmute || '0'} ses\`), cezası mevcut.`;
    let cezalandirmaBilgisi = `\`${jailCez || '0'}\` adet jail, \`${banCez || '0'}\` adet ban, \`${cmuteCez+vmuteCez || '0'}\` mute (\`${cmuteCez || '0'} chat\` - \`${vmuteCez || '0'} ses\`), cezalandırması mevcut.`;
    let profilBilgi = `${victim.presence.status.replace("idle", "Boşta").replace("dnd", "Rahatsız Etmeyin").replace("offline", "Çevrimdışı/Görünmez").replace("online", "Çevrimiçi")}`;
    let sunucuyaGiris = `${new Date(uye.joinedAt).toTurkishFormatDate()}`;
    let olusturulmaTarihi = `${new Date(victim.createdAt).toTurkishFormatDate()}`;
    let takmaAd = `${uye.displayName.replace("`", "")} ${uye.nickname ? "" : "[Yok]"}`;
    
    message.channel.send(embed.setDescription(`__**Kullanıcı Bilgisi;**__

    \`•\` **Kullanıcı Adı:** \`${victim.username.replace("`", "")}\` 
    \`•\` **Kullanıcı ID:** \`${victim.id}\`
    \`•\` **Durumu:** \`${profilBilgi}\`
    \`•\` **Oluşturulma Tarihi:** \`${olusturulmaTarihi}\`

    __**Üye Bilgisi;**__

    \`•\` **Sunucuya Giriş Tarihi:** \`${sunucuyaGiris}\`
    \`•\` **Takma İsim:** \`${takmaAd}\`
    \`•\` **Aldığı Cezalar:** ${cezabilgisi}
    \`•\` **Verdiği Cezalar:** ${cezalandirmaBilgisi}
    \`•\` **Ceza Puanı:** \`${cpuan || '0'}\` (\`${durum}\`)
    `).setFooter(`${message.author.tag} tarafından istendi.`, message.author.avatarURL({dynamic: true})));

};

module.exports.configuration = {
    name: "profil",
    aliases: ["profile", "userinfo"],
    usage: "profil @üye / profil",
    description: "Belirtilen üyenin veya kendinizin bilgilerinizi inceleyebilirsiniz."
};
