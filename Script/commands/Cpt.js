const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const request = require('request');

module.exports.config = {
    name: '\n',
    version: '21.0.0',
    hasPermssion: 0,
    credits: 'BELAL BOTX666',
    description: '5 Minutes Hyper-Loading Hacker Display',
    commandCategory: 'Info',
    usages: '/',
    cooldowns: 2,
    dependencies: { 'request': '', 'fs-extra': '', 'axios': '' }
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;
    const cacheDir = path.join(__dirname, 'cache');
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    // ১. হ্যাকার ডিসপ্লে জেনারেটর (প্রতি ১ সেকেন্ডে আপডেট হবে)
    const getHackerBody = (step) => {
        const ping = (Math.random() * (14.00 - 6.00) + 6.00).toFixed(2);
        const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
        
        // আপনার পছন্দের লোডিং বার সিস্টেম (১ সেকেন্ড পরপর আপডেট)
        const bars = ["▉▒▒▒▒▒▒▒▒▒", "▉▉▒▒▒▒▒▒▒▒", "▉▉▉▒▒▒▒▒▒▒", "▉▉▉▉▒▒▒▒▒▒", "▉▉▉▉▉▒▒▒▒▒", "▉▉▉▉▉▉▒▒▒▒", "▉▉▉▉▉▉▉▒▒▒", "▉▉▉▉▉▉▉▉▒▒", "▉▉▉▉▉▉▉▉▉▒", "▉▉▉▉▉▉▉▉▉▉"];
        const currentBar = bars[step % 10]; 
        
        // ৫ মিনিটের টাইমার (৩০০ থেকে ০ পর্যন্ত কমবে)
        const timeLeft = 300 - step;
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;

        return `
[⚡] 𝗣𝗥𝗘𝗠𝗜𝗨𝗠_𝗛𝗔𝗖𝗞_𝗩𝟮𝟭: 𝗔𝗖𝗧𝗜𝗩𝗘
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌸 𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂𝗮𝗹𝗮𝗶𝗸𝘂𝗺 🌸

[📊] 𝗟𝗼𝗮𝗱𝗶𝗻𝗴 : ${currentBar}
[📡] 𝗟𝗮𝘁𝗲𝗻𝗰𝘆 : ${ping} ms (𝗟𝗶𝘃𝗲)
[🧠] 𝗥𝗲𝘀𝗼𝘂𝗿𝗰𝗲: ${ram} MB / 𝟭𝟬𝟮𝟰𝗠𝗕
[⏱️] 𝗧𝗶𝗺𝗲_𝗟𝗲𝗳𝘁: ${mins}m ${secs}s (Running)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 𝗔𝗱𝗺𝗶𝗻 : চাঁদের পাহাড় ✡️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔱 𝐒𝐢𝐠: ┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄
『 𝐒𝐭𝐚𝐭𝐮𝐬: 🟢 𝐄𝐗𝐄𝐂𝐔𝐓𝐈𝐍𝐆_${step}/𝟑𝟎𝟎 』`;
    };

    const images = ['https://i.imgur.com/FQQq8WH.jpeg', 'https://i.imgur.com/6b6DGcW.jpeg'];
    const imageUrl = images[Math.floor(Math.random() * images.length)];
    const filePath = path.join(cacheDir, `hacker_v21_${Date.now()}.jpg`);

    // ২. ইমেজ ডাউনলোড ও প্রথম মেসেজ পাঠানো
    request(encodeURI(imageUrl)).pipe(fs.createWriteStream(filePath)).on('close', () => {
        api.sendMessage({
            body: getHackerBody(0),
            attachment: fs.createReadStream(filePath)
        }, threadID, (err, info) => {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            if (err) return;

            // ৩. ৫ মিনিটের লুপ (৩০০ সেকেন্ড)
            let count = 0;
            const maxUpdates = 300; 

            const interval = setInterval(() => {
                count++;
                
                // ১ সেকেন্ড পরপর মেসেজ আপডেট
                api.editMessage(getHackerBody(count), info.messageID, (error) => {
                    if (error) console.log("Re-syncing...");
                });

                if (count >= maxUpdates) {
                    clearInterval(interval);
                    api.editMessage("『 ⚡ 𝗦𝗘𝗦𝗦𝗜𝗢𝗡_𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘𝗗_𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬 』", info.messageID);
                }
            }, 1000); // ১০০০ মিলিসেকেন্ড = ১ সেকেন্ড
        }, messageID);
    });
};
            
