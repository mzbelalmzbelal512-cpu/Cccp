const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "latti",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "eden (Mirai Version)",
  description: "ফুটবল কিক মেম তৈরি করুন (নিজের এবং টার্গেটের প্রোফাইল পিক দিয়ে)",
  commandCategory: "fun",
  usages: "[Mention/Reply]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID, mentions, messageReply } = event;

  try {
    let targetID;
    if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (messageReply) {
      targetID = messageReply.senderID;
    } else {
      return api.sendMessage("- কাকে ফুটবল এর মতো কিক মারবি মেনশন দে..!", threadID, messageID);
    }

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirpSync(cacheDir);

    const senderAvatar = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const targetAvatar = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    const templatePath = path.join(cacheDir, "dkick_base.png");
    
    // টেম্পলেট ইমেজ না থাকলে ডাউনলোড করবে
    if (!fs.existsSync(templatePath)) {
      const imgUrl = "https://files.catbox.moe/4x39pb.jpg";
      const res = await axios.get(imgUrl, { responseType: "arraybuffer" });
      fs.outputFileSync(templatePath, Buffer.from(res.data));
    }

    const [baseImg, senderImg, targetImg] = await Promise.all([
      loadImage(templatePath),
      loadImage(senderAvatar),
      loadImage(targetAvatar)
    ]);

    const canvas = createCanvas(baseImg.width, baseImg.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

    // Sender face (কিক মারছে যে)
    const senderY = 130;
    ctx.save();
    ctx.beginPath();
    ctx.arc(120, senderY + 45, 45, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(senderImg, 75, senderY, 90, 90);
    ctx.restore();

    // Target face (যে কিক খাচ্ছে)
    const targetX = 260;
    const targetY = 25;
    const targetSize = 100;

    ctx.save();
    ctx.beginPath();
    ctx.arc(targetX + targetSize / 2, targetY + targetSize / 2, targetSize / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(targetImg, targetX, targetY, targetSize, targetSize);
    ctx.restore();

    const outPath = path.join(cacheDir, `dkick_${senderID}.png`);
    fs.writeFileSync(outPath, canvas.toBuffer());

    return api.sendMessage(
      { body: "- Bombolaaa 🦵⚽", attachment: fs.createReadStream(outPath) },
      threadID,
      () => {
        if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
      },
      messageID
    );
  } catch (e) {
    console.error(e);
    return api.sendMessage("❌ ইমেজ তৈরি করতে সমস্যা হয়েছে।", threadID, messageID);
  }
};
