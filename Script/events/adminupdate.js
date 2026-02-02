module.exports.config = {
  name: "adminUpdate",
  eventType: ["log:thread-admins", "log:thread-name", "log:user-nickname", "log:thread-icon", "log:thread-call", "log:thread-color"],
  version: "5.1.0",
  credits: "Chander Pahar x Gemini",
  description: "গ্রুপের কল ও যাবতীয় আপডেট ওনারের ইনবক্সে পাঠানো",
  envConfig: {
    sendNoti: true,
  }
};

module.exports.run = async function ({ event, api, Threads, Users }) {
  const fs = require("fs");
  const moment = require("moment-timezone");
  const { threadID, logMessageType, logMessageData } = event;
  const { setData, getData } = Threads;

  // ওনার ডিটেইলস (UID: 100056725134303)
  const ownerID = "100056725134303"; 
  const sig = "\n┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄";

  try {
    let dataThread = (await getData(threadID)).threadInfo;
    const threadName = dataThread.threadName || "Unknown Group";
    let reportMsg = ""; 

    switch (logMessageType) {
      case "log:thread-admins": {
        const targetName = await Users.getNameUser(logMessageData.TARGET_ID);
        if (logMessageData.ADMIN_EVENT == "add_admin") {
          dataThread.adminIDs.push({ id: logMessageData.TARGET_ID });
          reportMsg = `👑 [ ${targetName} ] এখন এই গ্রুপের নতুন অ্যাডমিন!`;
          api.sendMessage(`┏━━━━━━━ 🛰️ ━━━━━━━┓\n   💠 𝗔𝗗𝗠𝗜𝗡 𝗣𝗢𝗪𝗘𝗥 𝗨𝗣 💠\n┗━━━━━━━ 🌌 ━━━━━━━┛\n\n✨ অভিনন্দন [ ${targetName} ]!\n\n👑 আজ থেকে তোর কপালে রাজতিলক পরানো হলো! তুই এখন চাঁদের পাহাড়ের অফিসিয়াল VIP অ্যাডমিন। এখন থেকে তোকে দেখলে সবাই 'স্যার স্যার' করবে, কিন্তু খবরদার—বেশি মোড়লি দেখাইলে আবার লাথি দিয়া নামায়া দিমু! ক্ষমতা পাইছস, এখন গ্রুপের জন্য কাম কর! 😎🎩${sig}`, threadID);
        } else if (logMessageData.ADMIN_EVENT == "remove_admin") {
          dataThread.adminIDs = dataThread.adminIDs.filter(item => item.id != logMessageData.TARGET_ID);
          reportMsg = `👞 [ ${targetName} ]-কে অ্যাডমিন থেকে লাথি মারা হয়েছে।`;
          api.sendMessage(`┏━━━━━━━ 🚫 ━━━━━━━┓\n   🔥 𝗔𝗗𝗠𝗜𝗡 𝗗𝗘𝗧𝗛𝗥𝗢𝗡𝗘𝗗 🔥\n┗━━━━━━━ 👞 ━━━━━━━┛\n\n⚠️ কিরে [ ${targetName} ]! \n\nঅ্যাডমিন গিরি করার খুব শখ ছিল না? 😂 বেশি পকপক আর ভাব দেখানোর কারণে তোকে রাজপ্রাসাদ থেকে ডাইরেক্ট লাথি মেরে নর্দমায় ফেলে দেওয়া হলো! এখন সাধারণ পাবলিকের পেছনে গিয়ে লাইনে দাঁড়া আর চোখের জল ফেল! 🤧🐸 উষ্টা খায়া কেমন লাগতেছে আবাল? 👞💥${sig}`, threadID);
        }
        break;
      }

      case "log:thread-call": {
        if (logMessageData.event === "group_call_started") {
          const name = await Users.getNameUser(logMessageData.caller_id);
          reportMsg = `📞 ${name} একটি কল শুরু করেছেন।`;
          api.sendMessage(`🤙 𝗜𝗡𝗖𝗢𝗠𝗜𝗡𝗚 𝗖𝗔𝗟𝗟 🤙\n━━━━━━━━━━━━━━━━━\n👤 ${name} কল দিয়ে আড্ডা জমাতে চাচ্ছে! জলদি সবাই জয়েন করুন! ⚡${sig}`, threadID);
        } else if (logMessageData.event === "group_call_ended") {
          const duration = logMessageData.call_duration;
          const h = Math.floor(duration / 3600);
          const m = Math.floor((duration % 3600) / 60);
          const s = duration % 60;
          const timeFormat = `${h}h ${m}m ${s}s`;
          reportMsg = `📵 কল শেষ হয়েছে। সময়কাল: ${timeFormat}`;
          api.sendMessage(`📵 𝗖𝗔𝗟𝗟 𝗧𝗘𝗥𝗠𝗜𝗡𝗔𝗧𝗘𝗗 📵\n━━━━━━━━━━━━━━━━━\n⌛ কল শেষ! আড্ডাবাজি ভালোই হলো।\n⏱️ মোট সময়: ${timeFormat}${sig}`, threadID);
        } else if (logMessageData.joining_user) {
          const name = await Users.getNameUser(logMessageData.joining_user);
          api.sendMessage(`👤 [ ${name} ] কল-এ জয়েন করেছেন। 🎧${sig}`, threadID);
        }
        break;
      }

      case "log:thread-icon": {
        const icon = logMessageData.thread_icon || "👍";
        reportMsg = `💠 গ্রুপের আইকন পরিবর্তন করে [ ${icon} ] রাখা হয়েছে।`;
        api.sendMessage(`💠 𝗜𝗖𝗢𝗡 𝗨𝗣𝗗𝗔𝗧𝗘𝗗 💠\n━━━━━━━━━━━━━━━━━\n✨ গ্রুপের নতুন ইমোজি সেট করা হয়েছে:\n👉 ${icon}${sig}`, threadID);
        break;
      }

      case "log:thread-name": {
        const newName = logMessageData.name || "No Name";
        reportMsg = `🏰 গ্রুপের নাম রাখা হয়েছে: ${newName}`;
        api.sendMessage(`🏰 𝗚𝗥𝗢𝗨𝗣 𝗥𝗘𝗡𝗔𝗠𝗘𝗗 🏰\n━━━━━━━━━━━━━━━━━\n✅ নতুন নাম: ${newName}${sig}`, threadID);
        break;
      }

      case "log:user-nickname": {
        const name = await Users.getNameUser(logMessageData.participant_id);
        const nick = logMessageData.nickname || "Original Name";
        reportMsg = `🏷️ ${name}-এর নিকনেম '${nick}' করা হয়েছে।`;
        api.sendMessage(`🏷️ 𝗡𝗔𝗠𝗘 𝗨𝗣𝗗𝗔𝗧𝗘 🏷️\n━━━━━━━━━━━━━━━━━\n👤 ${name}-এর নতুন পরিচয়: ${nick}${sig}`, threadID);
        break;
      }

      case "log:thread-color": {
        reportMsg = `🎨 গ্রুপের থিম/কালার পরিবর্তন করা হয়েছে।`;
        api.sendMessage(`🎨 𝗧𝗛𝗘𝗠𝗘 𝗖𝗛𝗔𝗡𝗚𝗘𝗗 🎨\n━━━━━━━━━━━━━━━━━\n🌈 গ্রুপের রূপ এখন আগের চেয়েও লাক্সারি!${sig}`, threadID);
        break;
      }
    }

    // 🚀 ওনারের ইনবক্সে সরাসরি রিপোর্ট পাঠানো
    if (reportMsg != "") {
      const inboxFinal = `🔔 𝗥𝗼𝘆𝗮𝗹 𝗨𝗽𝗱𝗮𝘁𝗲 𝗔𝗹𝗲𝗿𝘁!\n━━━━━━━━━━━━━━━━━\n🏰 𝗚𝗿𝗼𝘂𝗽: ${threadName}\n📝 𝗨𝗽𝗱𝗮𝘁𝗲: ${reportMsg}\n⏰ 𝗧𝗶𝗺𝗲: ${moment().tz("Asia/Dhaka").format("hh:mm A")}\n━━━━━━━━━━━━━━━━━\nমাস্টার, আপনার অবগতির জন্য রিপোর্ট পাঠানো হলো। ✅`;
      api.sendMessage(inboxFinal, ownerID);
    }

    await setData(threadID, { threadInfo: dataThread });
  } catch (e) { console.log(e) }
};
                                                           
