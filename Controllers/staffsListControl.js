const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const pdb = new qdb.table("puanlar");
const ayar = require("../settings.json");
module.exports = () => {
    setInterval(() => {
      checkStaffList();
    }, 1000*60*5);
  };
  
  module.exports.configuration = {
    name: "ready"
  };

  function checkStaffList() {
    let sunucu = client.guilds.cache.get(ayar.sunucuID);
    let rol = sunucu.roles.cache.get(ayar.enAlttakiYetkiliRoluID);
    let yetkililer = sunucu.members.cache.filter(x => !x.user.bot && x.roles.highest.position >= rol.position);
    let yMesaj = sunucu.channels.cache.get(ayar.yetkiliSiralamaMesajKanal);
    yMesaj.messages.fetch(ayar.yetkiliSiralamaMesajID).then(x => {
    let embed = new MessageEmbed().setTitle("Sunucudaki Yetkililer").setFooter(`Toplam ${yetkililer.size} adet yetkili mevcut.`).setColor("RANDOM").setTimestamp();
    x.edit(embed.setDescription(`${yetkililer.size > 1 ? yetkililer.map(x => `${x}`) : "Yetkili Bulunamadı."}`)).catch();
    });
  };