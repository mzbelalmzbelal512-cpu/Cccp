const { execSync } = require('child_process');

// 🛠️ অটো-ইনস্টলার
try {
    require.resolve("canvas");
    require.resolve("axios");
    require.resolve("fs-extra");
} catch (e) {
    console.log("🛠️ প্রয়োজনীয় প্যাকেজ ইনস্টল হচ্ছে,✅🪪! একটু সবুর করুন...📥🪪");
    execSync('npm install canvas axios fs-extra path', { stdio: 'inherit' });
}

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

module.exports.config = {
  name: "ramadanphoto",
  version: "30.0.0",
  hasPermssion: 0,
  credits: "Belal x Gemini",
  description: "আল্ট্রা-প্রিমিয়াম রমজান ও ঈদ কার্ড ড্যাশবোর্ড",
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

    api.sendMessage("✨ 𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴... আপনার রাজকীয় কার্ডটি তৈরি হচ্ছে 🟢!", threadID, messageID);

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
    ctx.lineWidth = 15;
    ctx.strokeStyle = '#FFD700';
    ctx.stroke();
    ctx.clip();
    ctx.drawImage(avatar, 100, 187, 300, 300);
    ctx.restore();

    // প্রিমিয়াম টেক্সট স্টাইল ছবিতে
    ctx.textAlign = "left";
    ctx.fillStyle = "#FFD700"; 
    ctx.font = 'bold 55px Arial';
    ctx.fillText(targetName.toUpperCase(), 450, 240);

    ctx.fillStyle = "#ffffff";
    ctx.font = '32px Arial';
    ctx.fillText(`🆔 UID: ${targetID}`, 450, 310);
    ctx.fillText(`⚧ Gender: ${gender}`, 450, 370);
    ctx.fillText(`🔗 Status: Verified User`, 450, 430);

    ctx.fillStyle = "#00FFCC";
    ctx.font = 'italic bold 40px Arial';
    ctx.fillText("🌙 RAMADAN MUBARAK & EID SPECIAL", 450, 510);

    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = 'bold 22px Arial';
    ctx.fillText("👑 MASTER BELAL ULTRA-NET COMMAND CENTER 👑", 600, 630);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(cachePath, buffer);

    // ✨ রাজকীয় বডি মেসেজ আপডেট
    const msg = `🌟﹂﹂﹂﹂﹂﹂﹂﹂﹂﹂﹂﹂﹂﹂﹂﹂﹂﹂🌟
   ✨ 𝗔𝗦-𝗦𝗔𝗟𝗔𝗠𝗨 𝗔𝗟𝗔𝗜𝗞𝗨𝗠 ✨
🌟﹁﹁﹁﹁﹁﹁﹁﹁﹁﹁﹁﹁﹁﹁﹁﹁﹁﹁🌟

👤 𝗡𝗮𝗺𝗲: ${targetName}
🆔 𝗨𝗜𝗗: ${targetID}

🌙 পবিত্র রমজানের অশেষ রহমত আপনার উপর বর্ষিত হোক। আল্লাহ আপনার সকল সিয়াম ও ইবাদত কবুল করুন। 🤲

🎁 𝗘𝗶𝗱 𝗔𝗱𝘃𝗮𝗻𝗰𝗲: ঈদের আনন্দ ছড়িয়ে পড়ুক আপনার জীবন জুড়ে। মাস্টার বেলাল-এর পক্ষ থেকে আপনাকে অগ্রিম ঈদ মোবারক! 🎊

❃────────────────────────────❃
        🛰️ 𝗠𝗔𝗦𝗧𝗘𝗥 𝗕𝗘𝗟𝗔𝗟 𝗨𝗟𝗧𝗥𝗔-𝗡𝗘𝗧 🛰️
        ✡️⃝🅰🅳🅼🅸🇳─͢͢চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ✡️
❃────────────────────────────❃`;

    return api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(cachePath)
    }, threadID, () => fs.unlinkSync(cachePath), messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ , চাঁদের পাহাড় আপনার বট, কার্ড তৈরি করতে পারেনি 😔🙏। প্যানেল মেমোরি চেক করুন ✅।", threadID, messageID);
  }
};
        
