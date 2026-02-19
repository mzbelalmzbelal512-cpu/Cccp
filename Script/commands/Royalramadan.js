const { execSync } = require('child_process');

// 🛠️ অটো-ইনস্টলার
try {
    require.resolve("canvas");
    require.resolve("axios");
    require.resolve("moment-timezone");
} catch (e) {
    execSync('npm install canvas axios fs-extra path moment-timezone', { stdio: 'inherit' });
}

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment-timezone');
const { createCanvas, loadImage } = require('canvas');

module.exports.config = {
  name: "royalramadan",
  version: "100.0.0",
  hasPermssion: 0,
  credits: "Belal x Gemini",
  description: "৬৪ জেলার অটো সেহরি-ইফতার রিমাইন্ডার উইথ মাল্টি-অ্যালার্ট",
  commandCategory: "system",
  usages: "[জেলার নাম]",
  cooldowns: 5
};

// 🕒 সেটিংস ও মেমোরি (যাতে একই এলার্ট বারবার না দেয়)
let alertHistory = { sehri: [], iftar: [] };

module.exports.onLoad = async function ({ api }) {
    console.log("🌙 Royal Ramadan System Active - Master Belal Ultra-Net");

    setInterval(async () => {
        try {
            const now = moment.tz("Asia/Dhaka");
            const currentTime = now.format("HH:mm");
            const currentDay = now.format("YYYY-MM-DD");

            // এপিআই থেকে কুড়িগ্রাম/ঢাকা বা ডিফল্ট জেলার সময় নেওয়া (এখানে কুড়িগ্রাম ডিফল্ট ধরা হয়েছে)
            // আপনি চাইলে এই অংশটি লুপ করে সব জেলার জন্য আলাদা এলার্ট দিতে পারেন, তবে গ্রুপে স্প্যাম হবে। 
            // তাই প্রধান সময়ের উপর ভিত্তি করে প্রিমিয়াম এলার্ট সেট করা হয়েছে।
            const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity/${now.format("DD-MM-YYYY")}?city=Kurigram&country=Bangladesh&method=1`);
            const timings = response.data.data.timings;
            
            const sehriTime = timings.Fajr; // সেহরির শেষ সময়
            const iftarTime = timings.Maghrib; // ইফতারের সময়

            // --- সেহরি অ্যালার্ট লজিক (৩ বার) ---
            checkAndSend(api, currentTime, sehriTime, 30, "𝗦𝗘𝗛𝗥𝗜 𝗥𝗘𝗠𝗜𝗡𝗗𝗘𝗥 🌙", "সেহরির আর ৩০ মিনিট বাকি। মেহেরবানী করে খাবার গ্রহণ করুন।", 1);
            checkAndSend(api, currentTime, sehriTime, 15, "𝗦𝗘𝗛𝗥𝗜 𝗔𝗟𝗘𝗥𝗧 ✨", "সেহরির আর মাত্র ১৫ মিনিট বাকি। দ্রুত অজু ও নিয়ত সেরে নিন।", 2);
            checkAndSend(api, currentTime, sehriTime, 5, "𝗟𝗔𝗦𝗧 𝗦𝗘𝗛𝗥𝗜 𝗪𝗔𝗥𝗡𝗜𝗡𝗚 ⚠️", "সতর্কতা! সেহরির সময় শেষ হতে আর মাত্র ৫ মিনিট। মুখ পরিষ্কার করে নিন।", 3);

            // --- ইফতার অ্যালার্ট লজিক (৩ বার) ---
            checkAndSend(api, currentTime, iftarTime, 15, "𝗜𝗙𝗧𝗔𝗥 𝗜𝗦 𝗡𝗘𝗔𝗥 🌅", "ইফতারের আর ১৫ মিনিট বাকি। দস্তরখান সাজিয়ে দোয়া করুন।", 4);
            checkAndSend(api, currentTime, iftarTime, 5, "𝗜𝗙𝗧𝗔𝗥 𝗖𝗢𝗨𝗡𝗧𝗗𝗢𝗪𝗡 ⏳", "মাত্র ৫ মিনিট বাকি। ইফতারের দোয়াটি পড়ে নিন।", 5);
            checkAndSend(api, currentTime, iftarTime, 0, "𝗜𝗙𝗧𝗔𝗥 𝗧𝗜𝗠𝗘 🎉", "আলহামদুলিল্লাহ! ইফতারের সময় হয়েছে। রোজা ইফতার করুন।", 6);

        } catch (err) { console.log("Timer Error: " + err); }
    }, 60000); // প্রতি ১ মিনিটে চেক
};

async function checkAndSend(api, currentTime, targetTime, subtractMinutes, title, note, alertID) {
    const alertTarget = moment(targetTime, "HH:mm").subtract(subtractMinutes, 'minutes').format("HH:mm");
    
    if (currentTime === alertTarget && !alertHistory[alertID]) {
        alertHistory[alertID] = true;
        setTimeout(() => alertHistory[alertID] = false, 70000); // ১ মিনিট পর হিস্ট্রি ক্লিয়ার

        const allThreads = await api.getThreadList(20, null, ["INBOX"]);
        const groupThreads = allThreads.filter(t => t.isGroup && t.isSubscribed);

        const bgLinks = [
            "https://i.imgur.com/MyIixkI.jpeg", "https://i.imgur.com/KiCRZXT.jpeg",
            "https://i.imgur.com/49AMxfD.jpeg", "https://i.imgur.com/8g7AhHw.jpeg",
            "https://i.imgur.com/ByJ3eBQ.jpeg", "https://i.imgur.com/gpJ3ubG.jpeg"
        ];
        const randomBG = bgLinks[Math.floor(Math.random() * bgLinks.length)];
        
        const cachePath = path.join(__dirname, 'cache', `royal_alert_${alertID}.png`);
        const response = await axios.get(randomBG, { responseType: 'arraybuffer' });
        fs.writeFileSync(cachePath, Buffer.from(response.data, 'utf-8'));

        const msg = `👑 𝗥𝗢𝗬𝗔𝗟 𝗜𝗦𝗟𝗔𝗠𝗜𝗖 𝗡𝗢𝗧𝗜𝗖𝗘 👑\n──────────────────\n✨ ${title}\n\n📢 ${note}\n\n📍 এলাকা: কুড়িগ্রাম ও পার্শ্ববর্তী (লাইভ)\n──────────────────\n🛰️ 𝗠𝗔𝗦𝗧𝗘𝗥 𝗕𝗘𝗟𝗔𝗟 𝗨𝗟𝗧𝗥𝗔-𝗡𝗘𝗧\n✡️⃝🅰🅳🅼🅸🇳─͢͢চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ✡️`;

        for (const thread of groupThreads) {
            api.sendMessage({ body: msg, attachment: fs.createReadStream(cachePath) }, thread.threadID);
        }
    }
}

module.exports.run = async function ({ api, event, args }) {
    // জেলার নাম দিয়ে সার্চ করার ম্যানুয়াল সিস্টেম
    const city = args.join(" ") || "Kurigram";
    try {
        const res = await axios.get(`https://api.aladhan.com/v1/timingsByAddress?address=${city},Bangladesh&method=1`);
        const t = res.data.data.timings;
        return api.sendMessage(`🌙 ${city} জেলার আজকের সময়সূচী:\n\n🔹 সেহরি (শেষ সময়): ${t.Fajr}\n🔸 ইফতার: ${t.Maghrib}\n✨ নামাজের সময়: ফজর ${t.Fajr}, জোহর ${t.Dhuhr}, আসর ${t.Asr}, মাগরিব ${t.Maghrib}, এশা ${t.Isha}\n\nমাস্টার বেলাল আপনার সহায়তায় সবসময়।`, event.threadID);
    } catch (e) { return api.sendMessage("❌ জেলার নামটি ইংরেজিতে সঠিকভাবে লিখুন (যেমন: Dhaka, Sirajganj, Kurigram)।", event.threadID); }
};
