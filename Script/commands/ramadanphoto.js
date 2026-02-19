const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "ramadanphoto",
  version: "6.0.0",
  hasPermssion: 0,
  credits: "Belal x Gemini",
  description: "মেনশন করা ব্যক্তির প্রোফাইল পিকচার দিয়ে রমজান কার্ড তৈরি",
  commandCategory: "graphics",
  usages: "[@মেনশন / নাম]",
  cooldowns: 15
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID, mentions } = event;

  try {
    let targetID, targetName;

    // ১. মেনশন চেক করার লজিক
    if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0]; // প্রথম মেনশন করা ব্যক্তির আইডি
      targetName = mentions[targetID].replace('@', ''); // মেনশন থেকে নাম নেওয়া
    } else {
      targetID = senderID; // মেনশন না থাকলে নিজের আইডি
      const info = await api.getUserInfo(targetID);
      targetName = args.join(" ") || info[targetID].name;
    }

    const profileUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;

    api.sendMessage(`⏳ বেলাল ভাই, ${targetName}-এর জন্য রাজকীয় প্রোফাইল কার্ড তৈরি হচ্ছে...`, threadID, messageID);

    // ২. প্রিমিয়াম ডিজাইন এপিআই
    const designApi = `https://raiyan-api.onrender.com/api/ramadan_card?name=${encodeURIComponent(targetName)}&id=${targetID}&imgUrl=${encodeURIComponent(profileUrl)}`;
    
    const imagePath = path.join(__dirname, 'cache', `ramadan_pro_${targetID}.png`);
    
    // ৩. ইমেজ প্রসেসিং
    const response = await axios.get(designApi, { responseType: 'arraybuffer' });
    fs.writeFileSync(imagePath, Buffer.from(response.data, 'utf-8'));

    // ৪. ফাইনাল আউটপুট
    const msg = `👑 𝗥𝗔𝗠𝗔𝗗𝗔𝗡 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗖𝗔𝗥𝗗 👑
──────────────────
👤 𝗧𝗮𝗿𝗴𝗲𝘁 : ${targetName}
🆔 𝗨𝘀𝗲𝗿 𝗜𝗗 : ${targetID}
🌙 𝗪𝗶𝘀𝗵 : Ramadan Mubarak!
✨ 𝗗𝗲𝘀𝗶𝗴𝗻 : Master Belal Ultra
──────────────────
✡️⃝🅰🅳🅼🅸🇳─͢͢চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ✡️`;

    return api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(imagePath)
    }, threadID, () => fs.unlinkSync(imagePath), messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ সার্ভার বিজি! কাউকে মেনশন করার সময় নিশ্চিত করুন সে এই গ্রুপে আছে।", threadID, messageID);
  }
};
