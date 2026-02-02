module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "12.0.0",
  credits: "Belal YT x Gemini",
  description: "English details with Belal YT ✡️ branding and external roast text",
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": "",
    "canvas": "",
    "moment-timezone": ""
  }
};

module.exports.run = async function({ api, event, Users, Threads }) {
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const { createReadStream, existsSync, writeFileSync, unlinkSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];
  const axios = global.nodemodule["axios"];
  const Canvas = global.nodemodule["canvas"];
  const moment = require("moment-timezone");
  
  const { threadID } = event;
  const leftID = event.logMessageData.leftParticipantFbId;
  const name = global.data.userName.get(leftID) || await Users.getNameUser(leftID);
  const time = moment.tz("Asia/Dhaka").format("DD/MM/YYYY | hh:mm A");
  const sig = "┄┉❈✡️⋆⃝চাঁদের পাহাড়✿⃝🪬❈┉┄";

  // প্রিমিয়াম রোবোটিক/ডার্ক থিম ব্যাকগ্রাউন্ড
  const bgThemes = [
    "https://i.ibb.co/v4mK9R5/bg1.jpg", 
    "https://i.ibb.co/L8zB3Wp/bg2.jpg",
    "https://i.ibb.co/qyfD9wD/bg3.jpg", 
    "https://i.ibb.co/R0r0y2d/bg4.jpg"
  ];
  
  const randomBg = bgThemes[Math.floor(Math.random() * bgThemes.length)];

  // ইমেজের বাইরের হাস্যকর রোস্টিং মেসেজ (টেক্সট হিসেবে যাবে)
  const roastTxt = (event.author == leftID)
    ? `তোর এতো বড় সাহস! তুই আমাদের অনুমতি ছাড়াই পালালি? 😡 রাস্তা মাপ আবাল! যা ভাগ! 💩`
    : `এই গ্রুপে থাকার যোগ্যতা তোর নেই রে আবাল! 😡 তোকে সজোরে একটা লাথি মেরে বের করে দেওয়া হলো! 👞💥`;

  const path = join(__dirname, "cache", `leave_${leftID}.png`);
  
  try {
    const avatarUrl = `https://graph.facebook.com/${leftID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const [avatarRes, bgRes] = await Promise.all([
      axios.get(avatarUrl, { responseType: "arraybuffer" }),
      axios.get(randomBg, { responseType: "arraybuffer" })
    ]);

    const canvas = Canvas.createCanvas(1200, 700);
    const ctx = canvas.getContext("2d");

    // ১. ব্যাকগ্রাউন্ড
    ctx.drawImage(await Canvas.loadImage(bgRes.data), 0, 0, 1200, 700);

    // ২. ডিটেইলস বক্স (গ্লাস ইফেক্ট)
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(450, 250, 700, 350);
    ctx.strokeStyle = "#00FFFF";
    ctx.lineWidth = 5;
    ctx.strokeRect(450, 250, 700, 350);

    // ৩. প্রোফাইল পিকচার (রেড গ্লো)
    ctx.save();
    ctx.shadowColor = "#FF0000";
    ctx.shadowBlur = 40;
    ctx.beginPath();
    ctx.arc(230, 350, 160, 0, Math.PI * 2, true);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(230, 350, 150, 0, Math.PI * 2, true);
    ctx.clip();
    ctx.drawImage(await Canvas.loadImage(avatarRes.data), 80, 200, 300, 300);
    ctx.restore();

    // ৪. ইমেজের ভেতরের সকল টেক্সট (English)
    ctx.shadowBlur = 10;
    ctx.shadowColor = "black";
    
    // মেইন টাইটেল
    ctx.font = "bold 80px Arial";
    ctx.fillStyle = "#FF0000";
    ctx.fillText("GOODBYE ABAL", 470, 180);

    // এডিটর ব্র্যান্ডিং
    ctx.font = "italic 35px Arial";
    ctx.fillStyle = "#FFD700";
    ctx.fillText("Editor: Belal YT ✡️", 470, 310);

    // ইউজার ডিটেইলস
    ctx.font = "35px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`👤 Name: ${name}`, 480, 400);
    ctx.fillText(`🆔 User ID: ${leftID}`, 480, 460);
    ctx.fillText(`⏰ Left Time: ${time}`, 480, 520);
    ctx.fillText(`🏰 Group: Chander Pahar`, 480, 580);

    const imageBuffer = canvas.toBuffer();
    writeFileSync(path, imageBuffer);

    // ফাইনাল মেসেজ সেন্ড
    let finalMsg = `┏━━━━━━━ 🛑 ━━━━━━━┓\n   🔥 𝗚𝗢𝗢𝗗𝗕𝗬𝗘 𝗔𝗕𝗔𝗟 🔥\n┗━━━━━━━ ⚠️ ━━━━━━━┛\n\nআহারে ${name}! 🤧\n\n${roastTxt}\n\n${sig}`;

    return api.sendMessage({ body: finalMsg, attachment: createReadStream(path) }, threadID, () => {
        if (existsSync(path)) unlinkSync(path);
    });

  } catch (e) {
    return api.sendMessage(`আহারে ${name}! 🤧\n\n${roastTxt}\n\n${sig}`, threadID);
  }
};
    
