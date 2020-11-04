const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const pdb = new qdb.table("puanlar");
const ayar = require("../settings.json");
module.exports = () => {
    setInterval(() => {
      checkingAll();
    }, 10000);
  };
  
  module.exports.configuration = {
    name: "ready"
  };

  function checkingAll() {
    let yasaklilar = cdb.get("yasakTag") || [];
    let jail = cdb.get("jail") || [];
    let mute = cdb.get("tempmute") || [];
    let vmute = cdb.get("voicemute") || [];
    let bans = cdb.get("bans") || [];

    for (let yasakUye of yasaklilar) {
        let kullanici = client.guilds.cache.get(ayar.sunucuID).members.cache.get(yasakUye.slice(1));
        if (kullanici && yasaklilar.some(x => kullanici.user.username.includes(ayar.yasakliTag)) && !kullanici.roles.cache.has(ayar.yasakliTagRol)) {
            kullanici.roles.cache.has(ayar.boosterRol) ? kullanici.roles.set([ayar.boosterRol, ayar.yasakliTagRol]) : kullanici.roles.set([ayar.yasakliTagRol]).catch();
            if (kullanici.voice.channel) kullanici.voice.kick();
        };
        if (kullanici && !yasaklilar.some(x => kullanici.user.username.includes(ayar.yasakliTag)) && kullanici.roles.cache.has(ayar.yasakliTagRol)) {
            cdb.set("yasakTag", yasaklilar.filter(x => !x.includes(kullanici.id)));
            kullanici.roles.set([ayar.kayıtsızRol]).catch();
        };
    };

    for (let jailUye of jail) {
        let kullanici = client.guilds.cache.get(ayar.sunucuID).members.cache.get(jailUye.id);
        if (kullanici && !kullanici.roles.cache.has(ayar.cezaliRol)) {
            kullanici.roles.cache.has(ayar.boosterRol) ? kullanici.roles.set([ayar.boosterRol, ayar.cezaliRol]) : kullanici.roles.set([ayar.cezaliRol]).catch();
            if (kullanici.voice.channel) kullanici.voice.kick();
        };
    };

    for (let muteUye of mute) {
        let kullanici = client.guilds.cache.get(ayar.sunucuID).members.cache.get(muteUye.id);
        if (Date.now() >= muteUye.bitis) {
            if (kullanici && kullanici.roles.cache.has(ayar.muteRol)) kullanici.roles.remove(ayar.muteRol).catch();
            cdb.set("tempmute", mute.filter(x => x.id !== muteUye.id));
        }else{
            if (kullanici && !kullanici.roles.cache.has(ayar.muteRol)) kullanici.roles.add(ayar.muteRol).catch();
        };
    };

    for (let vmuteUye of vmute) {
        let kullanici = client.guilds.cache.get(ayar.sunucuID).members.cache.get(vmuteUye.id);
        if (Date.now() >= vmuteUye.bitis) {
            if (kullanici && kullanici.roles.cache.has(ayar.voiceMuteRol)) kullanici.roles.remove(ayar.voiceMuteRol).catch();
            cdb.set("voicemute", vmute.filter(x => x.id !== vmuteUye.id));
            if (kullanici && kullanici.voice.channel && kullanici.voice.serverMute) kullanici.voice.setMute(false);
        }else{
            if (kullanici && !kullanici.roles.cache.has(ayar.voiceMuteRol)) kullanici.roles.add(ayar.voiceMuteRol).catch();
            if (kullanici && kullanici.voice.channel && !kullanici.voice.serverMute) kullanici.voice.setMute(true);
        };
    };

    for (let yasak of bans) {
        let kullanici = client.guilds.cache.get(ayar.sunucuID).members.cache.get(yasak.id);
        if (kullanici) {
            kullanici.ban({reason: "Ban Kontrol"}).catch();
        };
    };

    client.guilds.cache.get(ayar.sunucuID).members.cache.filter(x => !x.user.bot && x.user.username.includes(ayar.tag) && !x.roles.cache.has(ayar.familyRol)).array().forEach((tag, index) => {
        setTimeout(() => {
            tag.roles.add(ayar.familyRol).catch();
        }, index*3000);
    });



};