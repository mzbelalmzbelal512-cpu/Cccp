const axios = require("axios");
const fs = require("fs-extra");
const path = __dirname + "/coinxbalance.json";

if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}, null, 2));

function getBalance(userID) {
  try {
    const data = JSON.parse(fs.readFileSync(path, "utf-8"));
    return data[userID]?.balance !== undefined ? data[userID].balance : 100;
  } catch { return 100; }
}

function setBalance(userID, balance) {
  try {
    const data = JSON.parse(fs.readFileSync(path, "utf-8"));
    data[userID] = { balance: Math.max(0, balance) };
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
  } catch {}
}

function formatBalance(num) {
  return num.toLocaleString() + " 🪙";
}

module.exports.config = {
  name: "quizv2",
  version: "10.0.0",
  hasPermssion: 0,
  credits: "MOHAMMAD AKASH",
  description: "সবচেয়ে সুন্দর এবং প্রিমিয়াম বাংলা কুইজ গেম",
  commandCategory: "game",
  usages: "quizv2",
  cooldowns: 10,
};

module.exports.run = async function ({ api, event, args, Users }) {
  const { threadID, senderID, messageID } = event;
  const balance = getBalance(senderID);
  const name = await Users.getNameUser(senderID);

  if (balance < 30) {
    return api.sendMessage(`🚫 𝗜𝗡𝗦𝗨𝗙𝗙𝗜𝗖𝗜𝗘𝗡𝗧 𝗙𝗨𝗡𝗗𝗦\n━━━━━━━━━━━━━━━━━━\nমাস্টার কুইজ খেলতে ৩০ 🪙 প্রয়োজন।\nআপনার ব্যালেন্স: ${formatBalance(balance)}`, threadID, messageID);
  }

  try {
    const { data } = await axios.get("https://rubish-apihub.onrender.com/rubish/quiz-api?category=Bangla&apikey=rubish69");

    const quizMsg = {
      body: `🌟 𝗤𝗨𝗜𝗭 𝗖𝗛𝗔𝗟𝗟𝗘𝗡𝗚𝗘 🌟\n━━━━━━━━━━━━━━━━━━\n👤 𝗣𝗟𝗔𝗬𝗘𝗥: ${name}\n✨ 𝗥𝗘𝗪𝗔𝗥𝗗: 1,000 🪙\n━━━━━━━━━━━━━━━━━━\n\n❓ 𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻:\n"${data.question}"\n\n  🅰️ ${data.A}\n  🅱️ ${data.B}\n  🅲️ ${data.C}\n  🅳️ ${data.D}\n\n━━━━━━━━━━━━━━━━━━\n⏳ 𝗧𝗶𝗺𝗲: ৩০ সেকেন্ড\n💡 উত্তর দিতে A/B/C/D লিখে রিপ্লাই দিন!`,
    };

    return api.sendMessage(quizMsg, threadID, (err, info) => {
      global.client.handleReply.push({
        step: 1,
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        answer: data.answer,
        timeout: setTimeout(() => {
          api.unsendMessage(info.messageID);
          api.sendMessage(`⌛ 𝗧𝗜𝗠𝗘'𝗦 𝗨𝗣!\n━━━━━━━━━━━━━━━━━━\nসঠিক উত্তরটি ছিল: ✨ ${data.answer}`, threadID);
        }, 30000)
      });
    }, messageID);

  } catch (err) {
    return api.sendMessage("❌ সার্ভার কানেকশন এরর! আবার চেষ্টা করুন।", threadID, messageID);
  }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  const { senderID, body, threadID, messageID } = event;
  if (senderID !== handleReply.author) return;

  const userReply = body.trim().toUpperCase();
  if (!["A", "B", "C", "D"].includes(userReply)) return;

  clearTimeout(handleReply.timeout);
  let balance = getBalance(senderID);

  if (userReply === handleReply.answer.toUpperCase()) {
    balance += 1000;
    setBalance(senderID, balance);
    api.unsendMessage(handleReply.messageID);
    
    const winResult = `🎊 𝗖𝗢𝗡𝗚𝗥𝗔𝗧𝗨𝗟𝗔𝗧𝗜𝗢𝗡𝗦 🎊\n━━━━━━━━━━━━━━━━━━\n✅ সঠিক উত্তর: [ ${handleReply.answer} ]\n💰 আপনি জিতেছেন: 1,000 🪙\n💳 নতুন ব্যালেন্স: ${formatBalance(balance)}\n━━━━━━━━━━━━━━━━━━\nআপনার বুদ্ধিমত্তা অসাধারণ! 🎖️`;
    api.sendMessage(winResult, threadID, messageID);
  } else {
    balance = Math.max(0, balance - 50);
    setBalance(senderID, balance);
    
    const loseResult = `💔 𝗕𝗘𝗧𝗧𝗘𝗥 𝗟𝗨𝗖𝗞 𝗡𝗘𝗫𝗧 𝗧𝗜𝗠𝗘\n━━━━━━━━━━━━━━━━━━\n❌ ভুল উত্তর দিয়েছিলেন।\n✅ সঠিক ছিল: ${handleReply.answer}\n💸 জরিমানা: -৫০ 🪙\n💳 ব্যালেন্স: ${formatBalance(balance)}\n━━━━━━━━━━━━━━━━━━\nআবার চেষ্টা করুন, হাল ছাড়বেন না! 💪`;
    api.sendMessage(loseResult, threadID, messageID);
  }

  const index = global.client.handleReply.findIndex(item => item.messageID === handleReply.messageID);
  global.client.handleReply.splice(index, 1);
};
