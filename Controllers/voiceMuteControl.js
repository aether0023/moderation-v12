const {MessageEmbed}= require("discord.js");
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const db = new qdb.table("ayarlar");
const ayar = require("../settings.json");

module.exports = (oldState, newState) => {

    if ((oldState.channelID && !newState.channelID)) {
        let control = cdb.get(`vstatus.${oldState.id}.${oldState.guild.id}`);
        if (control) {
            let veri = cdb.get("voicemute") || [{id: null, bitis: null}];
            let uye = oldState.member;
            if (veri.some(x => x.id == uye.id)){
                let data = veri.find(x => x.id == uye.id);
                if (Date.now() < data.bitis) {
                    let kalanZaman = data.bitis-Date.now();
                    cdb.set(`vmute.cikis.${uye.id}`, true);
                    cdb.set("voicemute", {id: uye.id, bitis: data.bitis, kalanZaman: kalanZaman })
                    uye.roles.add(ayar.voiceMuteRol).catch();
                }
            }
        } 
    }

    /*
        Buradaki amaç eğer üye sesli kanaldan çıkarsa sesmutesi durucak sesli kanala girdiğinde devam edicek.
    */

    if ((!oldState.channelID && newState.channelID) || (oldState.channelID && newState.channelID)) {
        let uye = newState.member;
        let control = cdb.get(`vstatus.${oldState.id}.${oldState.guild.id}`);
        let status = cdb.get(`vmute.cikis.${uye.id}`);
        let veri = cdb.get("voicemute") || [{id: null, bitis: null}];
            if (control) {
                let data = veri.find(x => x.id == uye.id);
                if (status) {
                    if (veri.some(x => x.id == uye.id)) {
                    let yeniBitis = Date.now()+data.kalanZaman;
                    cdb.set(`vmute.cikis.${uye.id}`, false);
                    uye.voice.setMute(true);
                    cdb.set("voicemute", {id: uye.id, bitis: yeniBitis});
                    uye.roles.add(ayar.voiceMuteRol).catch();
                }
            }else{
                let data = veri.find(x => x.id == uye.id);
                if (Date.now() >= data.bitis) {
                    veri = veri.filter(x => x.id != uye.id);
                    uye.voice.setMute(false);
                    uye.roles.remove(ayar.voiceMuteRol).catch();
                    cdb.set("voicemute", veri)
                }
            }
            if (uye.voice.channel && !uye.voice.serverMute) {
                uye.roles.add(ayar.voiceMuteRol).catch();
                uye.voice.setMute(true);
            }
        }
    }

};

module.exports.configuration = {
    name: "voiceStateUpdate"
  }
