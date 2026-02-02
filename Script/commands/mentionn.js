module.exports.config = {
 name: "mention",
 version: "1.0.0",
 hasPermssion: 2,
 credits: "𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐈𝐬𝐥𝐚𝐦",
 description: "একবার করে বারবার কাউকে মেনশন করার কমান্ড",
 commandCategory: "group",
 usages: "/mention @mention [count]",
 cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
 const { mentions, threadID } = event;

 if (Object.keys(mentions).length === 0) {
 return api.sendMessage("Boss আপনি কাউকে মেনশন করেননি!\n\nExample: /mention @চাঁদের পাহাড় 10", threadID);
 }

 const mentionID = Object.keys(mentions)[0];
 const mentionName = mentions[mentionID];
 
 let count = parseInt(args[args.length - 1]);
 const repeatCount = isNaN(count) ? 1 : Math.min(count, 100); 

 for (let i = 0; i < repeatCount; i++) {
 try {
 await api.sendMessage({
 body: `${mentionName}\n\n এই চিপা থেকে বের হও 🐸 সারাদিন চিপায় থাকিস গ্রুপ একটু সময় দিলে কি হয় 😌😌 চিপা থেকে বের হ চকলেট এনেছি তোদের জন্য 🤏🔪`,
 mentions: [{ tag: mentionName, id: mentionID }]
 }, threadID);
 
 if (i < repeatCount - 1) {
 await new Promise(resolve => setTimeout(resolve, 1000)); 
 }
 } catch (error) {
 console.error(" চাঁদের পাহাড় মেনশন পাঠাতে সমস্যা:", error);
 break;
 }
 }
};
