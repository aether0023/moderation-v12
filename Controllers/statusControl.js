const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const pdb = new qdb.table("puanlar");
const limit = new qdb.table("limitler");
const ayar = require("../settings.json");
module.exports = () => {
    setInterval(() => {
      checkGuildUserStatus();
    }, 10000);
  };
  
  module.exports.configuration = {
    name: "ready"
  };

  function checkGuildUserStatus() {
    let jail = cdb.get("jail") || [];
    let mute = cdb.get("tempmute") || [];
    let vmute = cdb.get("voicemute") || [];

    let sunucu = client.guilds.cache.get(ayar.sunucuID);
    client.guilds.cache.get(ayar.sunucuID).members.cache.forEach(x => {
        if (cdb.has(`jstatus.${x.id}.${sunucu.id}`) && jail.some(y => y.id !== x.id)) {
            cdb.set(`jstatus.${x.id}.${sunucu.id}`, false);
        };
        if (cdb.has(`mstatus.${x.id}.${sunucu.id}`) && mute.some(y => y.id !== x.id)) {
            cdb.set(`mstatus.${x.id}.${sunucu.id}`, false);
        };
        if (cdb.has(`vstatus.${x.id}.${sunucu.id}`) && vmute.some(y => y.id !== x.id)) {
            cdb.set(`vstatus.${x.id}.${sunucu.id}`, false);
        };
    });
  };