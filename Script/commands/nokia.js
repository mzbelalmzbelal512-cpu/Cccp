const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "nokia",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Helal", // মূল লেখকের নাম রাখা হয়েছে
  description: "আপনার বা ট্যাগ করা ইউজারের প্রোফাইল পিকচার নোকিয়া ফোনের স্ক্রিনে দেখান",
  commandCategory: "fun",
  usages: "[mention/reply]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID, type, messageReply, mentions } = event;

  // ১. ইউজার ID ডিটেক্ট করা (রিপ্লাই, মেনশন বা নিজের)
  let uid;
  if (type === "message_reply") {
    uid = messageReply.senderID;
  } else if (Object.keys(mentions).length > 0) {
    uid = Object.keys(mentions)[0];
  } else {
    uid = senderID;
  }

  // ২. প্রোফাইল পিকচার লিঙ্ক তৈরি
  const avatarURL = `https://graph.facebook.com/${uid}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

  api.sendMessage("📱 নোকিয়া ইফেক্ট তৈরি হচ্ছে... একটু অপেক্ষা করুন।", threadID, messageID);

  try {
    // ৩. API কল এবং ইমেজ প্রসেসিং
    const res = await axios.get(`https://api.popcat.xyz/v2/nokia?image=${encodeURIComponent(avatarURL)}`, {
      responseType: "arraybuffer"
    });

    const cachePath = path.join(__dirname, "cache", `nokia_${uid}.png`);
    
    // ক্যাশ ফোল্ডার না থাকলে তৈরি করে নেবে
    if (!fs.existsSync(path.join(__dirname, "cache"))) {
      fs.mkdirSync(path.join(__dirname, "cache"));
    }

    fs.writeFileSync(cachePath, Buffer.from(res.data, "utf-8"));

    // ৪. ছবি পাঠানো এবং ক্যাশ ডিলিট করা
    return api.sendMessage({
      body: `📱 | নোকিয়া ক্লাসিক স্ক্রিন ইফেক্ট!`,
      attachment: fs.createReadStream(cachePath)
    }, threadID, () => {
      fs.unlinkSync(cachePath);
    }, messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ | দুঃখিত! ইমেজ জেনারেট করতে সমস্যা হয়েছে। সার্ভার হয়তো ডাউন।", threadID, messageID);
  }
};
