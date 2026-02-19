const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { createCanvas, loadImage, registerFont } = require('canvas');

module.exports.config = {
  name: "ramadanphoto",
  version: "15.0.0",
  hasPermssion: 0,
  credits: "Belal x Gemini",
  description: "বটের নিজস্ব সার্ভারে রাজকীয় রমজান কার্ড তৈরি",
  commandCategory: "graphics",
  usages: "[@মেনশন / নাম]",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID, mentions } = event;
  const cachePath = path.join(__dirname, 'cache', `ramadan_card_${senderID}.png`);

  try {
    let targetID = Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : senderID;
    const userInfo = await api.getUserInfo(targetID);
    const targetName = args.join(" ") || userInfo[targetID].name;

    api.sendMessage("⏳ বেলাল ভাই, আপনার রাজকীয় কার্ডটি তৈরি হচ্ছে...", threadID, messageID);

    // ১. ক্যানভাস সাইজ নির্ধারণ
    const canvas = createCanvas(1000, 600);
    const ctx = canvas.getContext('2d');

    // ২. ব্যাকগ্রাউন্ড ইমেজ (একটি স্থায়ী রমজান ব্যাকগ্রাউন্ড লিঙ্ক)
    const backgroundUrl = "https://i.imgur.com/KndNQ0w.jpeg"; 
    const background = await loadImage(backgroundUrl);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // ৩. ইউজারের প্রোফাইল পিকচার বসানো
    const profilePicUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
    const avatar = await loadImage(profilePicUrl);
    
    // প্রোফাইল পিকচারটি গোল করার ডিজাইন
    ctx.save();
    ctx.beginPath();
    ctx.arc(500, 200, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 400, 100, 200, 200);
    ctx.restore();

    // ৪. টেক্সট ডিজাইন (নাম ও উইশ)
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    
    // নাম
    ctx.font = 'bold 50px Arial';
    ctx.fillText(targetName, 500, 360);
    
    // রমজান উইশ
    ctx.fillStyle = "#FFD700"; // সোনালী রঙ
    ctx.font = '40px Arial';
    ctx.fillText("RAMADAN MUBARAK", 500, 430);
    
    // আপনার সিগনেচার
    ctx.fillStyle = "#ffffff";
    ctx.font = '20px Arial';
    ctx.fillText("Designed by Master Belal", 500, 550);

    // ৫. ইমেজ সেভ ও সেন্ড
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(cachePath, buffer);

    return api.sendMessage({
      body: `🌙 আসসালামু আলাইকুম ${targetName}!\nআপনার জন্য বিশেষ রমজান কার্ডটি তৈরি।`,
      attachment: fs.createReadStream(cachePath)
    }, threadID, () => fs.unlinkSync(cachePath), messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ বেলাল ভাই, ক্যানভাস সিস্টেমে সমস্যা হচ্ছে। দয়া করে 'npm install canvas' করেছেন কি না চেক করুন।", threadID, messageID);
  }
};
      
