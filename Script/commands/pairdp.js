const axios = require("axios");

module.exports.config = {
  name: "pairdp",
  version: "1.7.0",
  hasPermssion: 0,
  credits: "MahMUD (Mirai Version)",
  description: "এনিমে কাপল বা পেয়ার ডিপি পান।",
  commandCategory: "media",
  usages: "",
  cooldowns: 5,
};

// বেস এপিআই ইউআরএল সংগ্রহের ফাংশন
async function getBaseApi() {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
  return base.data.mahmud;
}

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  // ১. অথর নেম চেক (লজিক বজায় রাখা হয়েছে)
  const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68); 
  if (this.config.credits.split(" ")[0] !== obfuscatedAuthor) {
    return api.sendMessage("You are not authorized to change the author name.", threadID, messageID);
  }

  try {
    // লোডিং রিঅ্যাকশন
    api.setMessageReaction("⌛", messageID, () => {}, true);

    const apiBase = await getBaseApi();
    const baseUrl = `${apiBase}/api/cdpvip2`;

    // ইমেজ স্ট্রিম করার ফাংশন
    const getStream = async (url) => {
      const res = await axios({
        url,
        method: "GET",
        responseType: "stream",
        headers: { "User-Agent": "Mozilla/5.0" }
      });
      return res.data;
    };

    const category = "anime";
    const res = await axios.get(`${baseUrl}?category=${category}`);
    const groupImages = res.data?.group || [];

    if (!groupImages.length) {
      return api.sendMessage(`⚠ No DP found in "${category}" category.`, threadID, messageID);
    }

    const streamAttachments = [];
    for (const url of groupImages) {
      try {
        const stream = await getStream(url);
        streamAttachments.push(stream);
      } catch (e) {
        console.warn(`⚠ Failed to load image: ${url}`);
      }
    }

    if (streamAttachments.length === 0) {
      return api.sendMessage("❌ All image URLs failed to load.", threadID, messageID);
    }

    // সফল হলে রিঅ্যাকশন পরিবর্তন
    api.setMessageReaction("🎀", messageID, () => {}, true);

    return api.sendMessage({
      body: `🎀 𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐫𝐚𝐧𝐝𝐨𝐦 𝐚𝐧𝐢𝐦𝐞 𝐩𝐚𝐢𝐫 𝐝𝐩 𝐛𝐚𝐛𝐲.`,
      attachment: streamAttachments
    }, threadID, messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("🥹 error, contact MahMUD", threadID, messageID);
  }
};
