const { execSync } = require('child_process');

// 🛠️ অটো-ইনস্টলার: ফাইল রান হওয়ার সময় প্রয়োজনীয় প্যাকেজ না থাকলে নিজে নিজেই নামিয়ে নেবে
try {
    require.resolve("canvas");
    require.resolve("axios");
    require.resolve("fs-extra");
} catch (e) {
    console.log("🛠️ প্রয়োজনীয় কিছু ফাইল বাকি আছে, বেলাল ভাই! একটু অপেক্ষা করুন, আমি সব ঠিক করে দিচ্ছি...");
    execSync('npm install canvas axios fs-extra path', { stdio: 'inherit' });
    console.log("✅ সব ঠিক হয়ে গেছে! এবার কার্ড তৈরি শুরু হচ্ছে...");
}

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

module.exports.config = {
  name: "ramadanphoto",
  version: "25.0.0",
  hasPermssion: 0,
  credits: "Belal x Gemini",
  description: "ইউজারের ফুল ডিটেইলস সহ আল্ট্রা-প্রিমিয়াম কার্ড (অটো-ইনস্টল সিস্টেম)",
  commandCategory: "graphics",
  usages: "[@মেনশন / নাম]",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID, mentions } = event;
  const cachePath = path.join(__dirname, 'cache', `ramadan_premium_${senderID}.png`);

  try {
    if (!fs.existsSync(path.join(__dirname, 'cache'))) fs.mkdirSync(path.join(__dirname, 'cache'));

    let targetID = Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : senderID;
    const userInfo = await api.getUserInfo(targetID);
    const user = userInfo[targetID];
    const targetName = args.join(" ") || user.name;
    const gender = user.gender == 2 ? "Male" : (user.gender == 1 ? "Female" : "User");
    const fbLink = `fb.com/${targetID}`;

    api.sendMessage("✨ বেলাল ভাই, আপনার রাজকীয় কার্ডটি অটো-ডিজাইন হচ্ছে...", threadID, messageID);

    const bgLinks = [
      "https://i.imgur.com/MyIixkI.jpeg",
      "https://i.imgur.com/KiCRZXT.jpeg",
      "https://i.imgur.com/49AMxfD.jpeg",
      "https://i.imgur.com/8g7AhHw.jpeg",
      "https://i.imgur.com/ByJ3eBQ.jpeg",
      "https://i.imgur.com/gpJ3ubG.jpeg"
    ];
    const randomBG = bgLinks[Math.floor(Math.random() * bgLinks.length)];

    const canvas = createCanvas(1200, 675);
    const ctx = canvas.getContext('2d');

    const background = await loadImage(randomBG);
    ctx.drawImage(background, 0, 0, 1200, 675);

    const profilePicUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
    const avatar = await loadImage(profilePicUrl);
    
    // গোল প্রোফাইল ফটো ও গোল্ডেন ইফেক্ট
    ctx.save();
    ctx.beginPath();
    ctx.arc(250, 337, 150, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#FFD700';
    ctx.stroke();
    ctx.clip();
    ctx.drawImage(avatar, 100, 187, 300, 300);
    ctx.restore();

    // প্রিমিয়াম টেক্সট স্টাইল
    ctx.textAlign = "left";
    ctx.fillStyle = "#FFD700"; 
    ctx.font = 'bold 55px Arial';
    ctx.fillText(targetName.toUpperCase(), 450, 240);

    ctx.fillStyle = "#ffffff";
    ctx.font = '32px Arial';
    ctx.fillText(`🆔 UID: ${targetID}`, 450, 310);
    ctx.fillText(`⚧ Gender: ${gender}`, 450, 370);
    ctx.fillText(`🔗 Link: ${fbLink}`, 450, 430);

    ctx.fillStyle = "#00FFCC";
    ctx.font = 'italic bold 40px Arial';
    ctx.fillText("🌙 RAMADAN MUBARAK & EID SPECIAL", 450, 510);

    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = 'bold 22px Arial';
    ctx.fillText("👑 DESIGNED BY MASTER BELAL ULTRA-NET 👑", 600, 630);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(cachePath, buffer);

    return api.sendMessage({
      body: `✨ আসসালামু আলাইকুম ${targetName}!\nআপনার প্রিমিয়াম রমজান কার্ডটি রেডি।\n\n✡️⃝🅰🅳🅼🅸🇳─͢͢চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ✡️`,
      attachment: fs.createReadStream(cachePath)
    }, threadID, () => fs.unlinkSync(cachePath), messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ চাঁদের পাহাড়, একটু সমস্যা হয়েছে। সম্ভবত আপনার হোস্টিংয়ে 'canvas' সাপোর্ট করছে না।", threadID, messageID);
  }
};
    
