const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "pair10",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "nexo_here",
  description: "Advanced Love Pairing with Ultra-Premium Aesthetics",
  commandCategory: "love",
  usages: "pair",
  cooldowns: 15,
};

module.exports.run = async function ({ api, event, Users }) {
  const { threadID, messageID, senderID } = event;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const participantIDs = threadInfo.participantIDs;
    const botID = api.getCurrentUserID();
    
    // ফিল্টারিং মেম্বার লিস্ট
    const listUserID = participantIDs.filter(ID => ID != botID && ID != senderID);
    if (listUserID.length == 0) return api.sendMessage("🚫 গ্রুপে পর্যাপ্ত সদস্য নেই!", threadID, messageID);

    const idPair = listUserID[Math.floor(Math.random() * listUserID.length)];
    const lovePercent = Math.floor(Math.random() * 81) + 20; // ২০% থেকে ১০০% এর মধ্যে

    const nameSender = await Users.getNameUser(senderID);
    const namePair = await Users.getNameUser(idPair);

    // প্রিমিয়াম লোডিং মেসেজ
    api.sendMessage("✨ 𝗔𝗻𝗮𝗹𝘆𝘇𝗶𝗻𝗴 𝗗𝗲𝘀𝘁𝗶𝗻𝘆... 💫\n━━━━━━━━━━━━━━━━━━━━\nআপনার হৃদয়ের জন্য নিখুঁত সঙ্গী খোঁজা হচ্ছে।", threadID, messageID);

    const cachePath = path.join(__dirname, "cache");
    if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });

    const avtPath1 = path.join(cachePath, `p1_${senderID}.png`);
    const avtPath2 = path.join(cachePath, `p2_${idPair}.png`);
    const gifPath = path.join(cachePath, `love_vibe.gif`);

    // প্রোফাইল পিকচার এবং লাভ অ্যানিমেশন সংগ্রহ
    const [res1, res2, resG] = await Promise.all([
      axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" }),
      axios.get(`https://graph.facebook.com/${idPair}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" }),
      axios.get(`https://i.ibb.co/y4dWfQq/image.gif`, { responseType: "arraybuffer" })
    ]);

    fs.writeFileSync(avtPath1, Buffer.from(res1.data));
    fs.writeFileSync(avtPath2, Buffer.from(res2.data));
    fs.writeFileSync(gifPath, Buffer.from(resG.data));

    // রোমান্টিক কোটস (Dynamic)
    const quotes = [
      "ভালোবাসা হলো দুটি হৃদয়ের একটি আত্মা।",
      "সত্যিকারের ভালোবাসা কখনোই শেষ হয় না।",
      "আপনারা একে অপরের পরিপূরক হতে পারেন।",
      "পৃথিবীর সবচেয়ে সুন্দর অনুভূতি হলো ভালোবাসা।"
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    // পার্সেন্টেজ অনুযায়ী ইউনিক স্ট্যাটাস বার
    const barFill = "▓";
    const barEmpty = "░";
    const barLength = 10;
    const progress = Math.round((lovePercent / 100) * barLength);
    const progressBar = barFill.repeat(progress) + barEmpty.repeat(barLength - progress);

    const msg = {
      body: `╭━━━ 💖 𝗗𝗘𝗦𝗧𝗜𝗡𝗬 𝗣𝗔𝗜𝗥 💖 ━━━╮\n\n  🌹 𝗣𝗹𝗮𝘆𝗲𝗿 𝟭: ${nameSender}\n  💍 𝗣𝗹𝗮𝘆𝗲𝗿 𝟮: ${namePair}\n\n━━━━━━━━━━━━━━━━━━━━\n  📊 𝗠𝗮𝘁𝗰𝗵 𝗥𝗮𝘁𝗶𝗼: [${progressBar}] ${lovePercent}%\n  📜 𝗩𝗶𝗯𝗲: ${randomQuote}\n━━━━━━━━━━━━━━━━━━━━\n  ✨ "আপনাদের জুড়িটি যেন সবসময় অটুট থাকে"\n\n╰━━━━━━━ 𝗨𝗟𝗧𝗥𝗔 𝗣𝗔𝗜𝗥 ━━━━━━━╯`,
      mentions: [
        { tag: nameSender, id: senderID },
        { tag: namePair, id: idPair }
      ],
      attachment: [
        fs.createReadStream(avtPath1),
        fs.createReadStream(gifPath),
        fs.createReadStream(avtPath2)
      ]
    };

    return api.sendMessage(msg, threadID, () => {
      [avtPath1, avtPath2, gifPath].forEach(p => fs.unlinkSync(p));
    }, messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage("⚠️ সার্ভার ব্যস্ত! কিছুক্ষণ পর চেষ্টা করুন।", threadID, messageID);
  }
};
