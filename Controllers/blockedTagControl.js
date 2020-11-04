const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const pdb = new qdb.table("puanlar");
const ayar = require("../settings.json");
module.exports = () => {
    setInterval(() => {
      checkYasakTaglar();
    }, 10000);
  };
  
  module.exports.configuration = {
    name: "ready"
  };

  function checkYasakTaglar() {
    let sunucu = client.guilds.cache.get(ayar.sunucuID);
    sunucu.members.cache.filter(x => !x.user.bot && x.user.username.includes(ayar.yasakliTag)).forEach(y => {
        y.roles.set([ayar.yasakliTagRol]).catch();
        cdb.push("yasakTag", y.map(x => `y${x.id}`));
    });
  };