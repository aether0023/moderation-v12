const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const pdb = new qdb.table("puanlar");
const ayar = require("../settings.json");
module.exports.execute = async (client, message, args) => {
   
    let embed = new MessageEmbed().setTitle(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RANDOM").setTimestamp();
    const filter = (reaction, user) => {
        return ["✅"].includes(reaction.emoji.name) && user.id === message.author.id; 
    };

    let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
    let jail = pdb.get(`jail.${victim.id}.${message.guild.id}`);
    let ban = pdb.get(`ban.${victim.id}.${message.guild.id}`);
    let cmute = pdb.get(`cmute.${victim.id}.${message.guild.id}`);
    let vmute = pdb.get(`vmute.${victim.id}.${message.guild.id}`);
    let cpuan = pdb.get(`cezapuan.${victim.id}.${message.guild.id}`);

    let durum;
    if (cpuan >= 50) durum = "Tehlikeli";
    if (cpuan < 50) durum = "Güvenli";
    if (cpuan == null || cpuan == undefined) durum = "Analiz Edilemedi";

    message.channel.send(embed.setDescription(`${victim} adlı üyenin toplam ${cpuan || '0'} adet ceza puanı mevcut (\`${durum}\`)`).setFooter(`Daha detaylı bilgi için 10 saniye içerisinde emojiye tıklayabilirsin.`)).then(x => {
        x.react("✅");
        x.awaitReactions(filter, {max: 1, time: 10000, error: ['time']}).then(z => {
            let donut = z.first();
            if (donut) {
                x.edit(embed.setDescription(`${victim} adlı üyenin toplam ${cpuan || '0'} adet ceza puanı mevcut. \n\n\`•\` Toplam Jail Sayısı: ${jail || '0'} \n\`•\` Toplam Ban Sayısı: ${ban || '0'} \n\`•\` Toplam Susturulma Sayısı: (\`${cmute || '0'} chat\` - \`${vmute || '0'} ses\`) \n\`•\` Durumu: \`${durum}\``));
            };
        });
    });
};

module.exports.configuration = {
    name: "cezapuan",
    aliases: ["cpuan", "puan", "cezaprofil"],
    usage: "cezapuan @üye / cezapuan",
    description: "Belirtilen üyenin veya kendinizin sunucu içerisindeki cezapuan durumunuza bakabilirsiniz."
};
