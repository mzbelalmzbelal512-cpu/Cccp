module.exports.config = {
  name: "rankup",
  version: "1.4.0",
  hasPermssion: 0,
  credits: "NTKhang (Mirai Version)",
  description: "লেভেল আপ নোটিফিকেশন অন/অফ করুন।",
  commandCategory: "rank",
  usages: "[on/off]",
  cooldowns: 5,
};

// লেভেল ক্যালকুলেশন লজিক
const deltaNext = 5;
const expToLevel = exp => Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);

module.exports.handleEvent = async function ({ event, api, Users, Threads }) {
  const { threadID, senderID } = event;
  if (!senderID || threadID === senderID) return;

  try {
    let threadData = (await Threads.getData(threadID)).data || {};
    
    // যদি rankup মেসেজ অফ থাকে তবে কাজ করবে না
    if (threadData.rankup === false) return;

    const userData = await Users.getData(senderID);
    const exp = userData.exp || 0;
    const currentLevel = expToLevel(exp);
    const oldLevel = expToLevel(exp - 1);

    if (currentLevel > oldLevel && currentLevel > 1) {
      const name = userData.name || (await Users.getNameUser(senderID));
      
      const msg = {
        body: `🎉🎉 অভিনন্দন ${name}, আপনি level ${currentLevel} এ পৌঁছেছেন!`,
        mentions: [{ tag: name, id: senderID }]
      };

      return api.sendMessage(msg, threadID);
    }
  } catch (e) {
    // console.log(e);
  }
};

module.exports.run = async function ({ api, event, args, Threads }) {
  const { threadID, messageID } = event;
  const data = (await Threads.getData(threadID)).data || {};

  if (args[0] == "on") {
    data.rankup = true;
    await Threads.setData(threadID, { data });
    return api.sendMessage("✅ লেভেল আপ নোটিফিকেশন চালু করা হয়েছে।", threadID, messageID);
  } 
  else if (args[0] == "off") {
    data.rankup = false;
    await Threads.setData(threadID, { data });
    return api.sendMessage("✅ লেভেল আপ নোটিফিকেশন বন্ধ করা হয়েছে।", threadID, messageID);
  } 
  else {
    return api.sendMessage("❌ ভুল কমান্ড! ব্যবহার করুন: rankup [on/off]", threadID, messageID);
  }
};
