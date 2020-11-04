const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const pdb = new qdb.table("puanlar");
const limit = new qdb.table("limitler");
const ayar = require("../settings.json");
module.exports = () => {
    setInterval(() => {
      checkBanLimits();
    }, 1000*60*30);
  };
  
  module.exports.configuration = {
    name: "ready"
  };

  function checkBanLimits() {
    limit.delete("limitler");
  };