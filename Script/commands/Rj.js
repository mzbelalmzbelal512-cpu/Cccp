const axios = require('axios');
const moment = require('moment-timezone');
const schedule = require('node-schedule');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "rj",
  version: "1200.0.0",
  hasPermssion: 0,
  credits: "Belal x Gemini",
  description: "মাস্টার বেলাল: অল-ইন-ওয়ান প্রিমিয়াম অটো-ইমেজ",
  commandCategory: "system",
  usages: "/rj",
  cooldowns: 5
};

async function createPremiumImage(api, threadID = null) {
  const cachePath = path.join(__dirname, 'cache', `belal_final_${Date.now()}.png`);
  try {
    const now = moment().tz('Asia/Dhaka');
    const time = now.format('hh:mm A');
    const date = now.format('DD MMMM, YYYY');
    const hour = now.hour();

    // ১. ৫টি শহরের ডাটা সংগ্রহ
    const cities = ["Kurigram", "Rangpur", "Dhaka", "Sirajganj", "Sylhet"];
    let cityRows = "";
    for (const city of cities) {
      try {
        const res = await axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Bangladesh&method=2`);
        const t = res.data.data.timings;
        cityRows += `${city}: Fajr ${t.Fajr} | Maghrib ${t.Maghrib} <br>`;
      } catch (e) { cityRows += `${city}: Updating... <br>`; }
    }

    // ২. হাই-কোয়ালিটি গ্রাফিক্স রেন্ডারিং (সবকিছু ছবির ভেতরে)
    const title = "MASTER BELAL DIGITAL HUB";
    const sig = "Chander Pahar Ultra-Net";
    const bgColor = hour >= 18 || hour <= 5 ? "linear-gradient(135deg, #0f2027, #203a43, #2c5364)" : "linear-gradient(135deg, #f2994a, #f2c94c)";

    // ছবির ভেতরে সুন্দরভাবে সাজানোর জন্য HTML লজিক
    const htmlContent = `
    <div style="width: 800px; height: 500px; background: ${bgColor}; color: white; padding: 40px; font-family: Arial; border: 10px solid gold; box-sizing: border-box; text-align: center;">
      <h1 style="font-size: 45px; margin: 0; color: #fff; text-shadow: 2px 2px 5px black;">👑 ${title} 👑</h1>
      <h2 style="font-size: 25px; margin: 15px 0; border-bottom: 2px solid white; display: inline-block;">📅 ${date} | 🕒 ${time}</h2>
      <div style="text-align: left; margin: 20px auto; width: 80%; font-size: 22px; line-height: 1.6; background: rgba(0,0,0,0.3); padding: 20px; border-radius: 15px;">
        ${cityRows}
      </div>
      <p style="font-size: 20px; font-style: italic; margin-top: 15px;">🪬 ${sig}</p>
    </div>`.replace(/\n/g, "");

    // এটি আপনার HTML-কে ছবিতে রূপান্তর করবে (কোনো মডিউল ছাড়াই)
    const imageUrl = `https://api.screenshotmachine.com/?key=bc8930&dimension=800x500&format=png&cacheLimit=0&delay=200&url=data:text/html,${encodeURIComponent(htmlContent)}`;

    if (!fs.existsSync(path.join(__dirname, 'cache'))) fs.mkdirSync(path.join(__dirname, 'cache'));

    const response = await axios({ method: 'GET', url: imageUrl, responseType: 'stream' });
    const writer = fs.createWriteStream(cachePath);
    response.data.pipe(writer);

    return new Promise((resolve) => {
      writer.on('finish', () => {
        const msg = {
          body: `🌟 𝗨𝗟𝗧𝗥𝗔-𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗨𝗣𝗗𝗔𝗧𝗘 🛰️\nমাস্টার বেলাল এর ডিজিটাল আপডেট সফলভাবে তৈরি হয়েছে।`,
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
    if (threadID) api.sendMessage("❌ গ্রাফিক্স তৈরিতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।", threadID);
  }
}

module.exports.onLoad = async ({ api }) => {
  const rule = new schedule.RecurrenceRule();
  rule.tz = 'Asia/Dhaka';
  rule.minute = 0; 
  schedule.scheduleJob(rule, () => createPremiumImage(api));
};

module.exports.run = async ({ api, event }) => {
  api.sendMessage("⌛ মাস্টার বেলাল, আপনার অল-ইন-ওয়ান ডিজিটাল কার্ডটি তৈরি হচ্ছে...", event.threadID);
  await createPremiumImage(api, event.threadID);
};
