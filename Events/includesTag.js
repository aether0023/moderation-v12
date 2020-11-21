const { MessageEmbed } = require("discord.js");
const ayar = require("../settings.json");
module.exports = (oldUser, newUser) => {

    if (oldUser.username === newUser.username || oldUser.bot || newUser.bot) return;
    let sunucu = client.guilds.cache.get(ayar.sunucuID);
    let xyz = sunucu.members.cache.get(oldUser.id);
    let family = sunucu.roles.cache.get(ayar.familyRol);
    if (!xyz) return;

    let embed = new MessageEmbed().setTitle(xyz.displayName, oldUser.avatarURL({dynamic: true})).setFooter('Aether & Serendia').setColor("RANDOM").setTimestamp();
        if (!oldUser.username.includes(ayar.tag) && newUser.username.includes(ayar.tag)) {
            xyz.roles.add(ayar.familyRol).catch();
            if (sunucu.channels.cache.has(ayar.ekipLogKanali)) sunucu.channels.cache.get(ayar.ekipLogKanali).send(embed.setDescription(`${xyz} adlı üye tagımızı (\`${ayar.tag}\`) aldığı için kendisine ekip rolü verildi.`))
            return;
        }

        if (oldUser.username.includes(ayar.tag) && !newUser.username.includes(ayar.tag)) {
            xyz.roles.remove(xyz.roles.cache.filter(x => family.position <= x.position)).catch();
            if (sunucu.channels.cache.has(ayar.ekipLogKanali)) sunucu.channels.cache.get(ayar.ekipLogKanali).send(embed.setDescription(`${xyz} adlı üye tagımızı (\`${ayar.tag}\`) saldığı için kendisinden ekip rolü alındı.`))
            return;
        }

};

module.exports.configuration = {
    name: "userUpdate"
  }
