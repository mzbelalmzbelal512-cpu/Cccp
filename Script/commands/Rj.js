const axios = require('axios');
const moment = require('moment-timezone');
const schedule = require('node-schedule');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "rj",
  version: "20.0.0",
  hasPermssion: 0,
  credits: "Belal x Gemini",
  description: "নির্দিষ্ট ইমেজের ওপর লাইভ ডাটা শো করার মাস্টার ফাইল",
  commandCategory: "system",
  usages: "/rj",
  cooldowns: 5
};

async function sendMasterUpdate(api, threadID = null) {
  const cachePath = path.join(__dirname, 'cache', `belal_final_${Date.now()}.png`);
  try {
    const now = moment().tz('Asia/Dhaka');
    const time = now.format('hh:mm A');
    const date = now.format('DD MMM, YYYY');

    // ১. কুড়িগ্রাম, রৌমারী ও সিরাজগঞ্জের ডাটা সংগ্রহ
    const locations = ["Kurigram", "Sirajganj"];
    let stats = "";
    for (const city of locations) {
      try {
        const res = await axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Bangladesh&method=2`);
        const t = res.data.data.timings;
        stats += `${city}: S-${t.Fajr} I-${t.Maghrib} | `;
      } catch (e) { stats += `${city}: Sync | `; }
    }

    // ২. আপনার দেওয়া ইমেজকে বেইজ হিসেবে ব্যবহার (Imgur Link)
    const baseImage = "https://i.imgur.com/KndNQ0w.jpeg";
    
    // ছবির ওপর লেখা বসানোর জন্য ডাইনামিক এপিআই
    // এখানে আপনার নাম, সময় এবং শহরের ডাটা ইমেজের ওপর লেয়ার হিসেবে বসবে
    const title = encodeURIComponent("👑 MASTER BELAL HUB 👑");
    const info = encodeURIComponent(`Date: ${date} | Time: ${time}\n${stats}\nRowmari: Same as Kurigram`);

    // এটি একটি পাওয়ারফুল ইমেজ এপিআই যা আপনার লিঙ্কের ছবির ওপর লেখাগুলো বসিয়ে দিবে
    const finalImageUrl = `https://api.memegen.link/images/custom/_/${title}.png?background=${baseImage}&font=titilliumweb-black&text0=${info}&text0_pos=middle`;

    if (!fs.existsSync(path.join(__dirname, 'cache'))) fs.mkdirSync(path.join(__dirname, 'cache'));

    const response = await axios({
      method: 'GET',
      url: finalImageUrl,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(cachePath);
    response.data.pipe(writer);

    return new Promise((resolve) => {
      writer.on('finish', () => {
        const msg = {
          body: `🌟 𝗨𝗟𝗧𝗥𝗔-𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗟𝗜𝗩𝗘 𝗨𝗣𝗗𝗔𝗧𝗘 🛰️\n━━━━━━━━━━━━━━━━━━━━━━\nমাস্টার বেলাল এর ডিজিটাল ব্যানার সফলভাবে তৈরি হয়েছে।\n━━━━━━━━━━━━━━━━━━━━━━\n🪬 𝐂 𝐡 𝐚 𝐧 𝐝 𝐞 𝐫   𝐏 𝐚 𝐡 𝐚 𝐫`,
          attachment: fs.createReadStream(cachePath)
        };

        if (threadID) {
          api.sendMessage(msg, threadID, () => {
            if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
            resolve();
          });
        } else {
          const allThreads = global.data.allThreadID || [];
          for (const id of allThreads) {
            api.sendMessage(msg, id);
            await new Promise(r => setTimeout(r, 2000));
          }
          if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
          resolve();
        }
      });
    });

  } catch (err) {
    console.error(err);
    if (threadID) api.sendMessage("❌ ছবি তৈরি করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।", threadID);
  }
}

module.exports.onLoad = async ({ api }) => {
  const rule = new schedule.RecurrenceRule();
  rule.tz = 'Asia/Dhaka';
  rule.minute = 0; 
  schedule.scheduleJob(rule, () => sendMasterUpdate(api));
};

module.exports.run = async ({ api, event }) => {
  api.sendMessage("⌛ মাস্টার বেলাল, আপনার দেওয়া ইমেজের ওপর লাইভ ডাটা বসানো হচ্ছে...", event.threadID);
  await sendMasterUpdate(api, event.threadID);
};
    
