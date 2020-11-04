module.exports = () => {
    console.log("Bot başarıyla çalıştırıldı.");
    client.user.setPresence({ activity: { name: "AETHER" }, status: "idle" });
  }
  module.exports.configuration = {
    name: "ready"
  }