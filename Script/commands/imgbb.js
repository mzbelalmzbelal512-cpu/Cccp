const axios = require("axios");
const FormData = require("form-data");

module.exports.config = {
  name: "imgbb",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "xnil6x (Mirai Version)",
  description: "ImgBB-তে ছবি আপলোড করে লিঙ্ক তৈরি করুন।",
  commandCategory: "uploader",
  usages: "[Reply to Image]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, messageReply } = event;
  const imgbbApiKey = "1b4d99fa0c3195efe42ceb62670f2a25";

  // রিপ্লাই চেক এবং ইমেজ ফিল্টার
  const attachments = messageReply?.attachments?.filter(att =>
    ["photo", "sticker", "animated_image"].includes(att.type)
  );

  if (!attachments || attachments.length === 0) {
    return api.sendMessage("❌ দয়া করে এক বা একাধিক ছবির রিপ্লাইয়ে কমান্ডটি ব্যবহার করুন।", threadID, messageID);
  }

  api.sendMessage(`⏳ ${attachments.length}টি ছবি আপলোড করা হচ্ছে...`, threadID, async (err, info) => {
    try {
      const uploadedLinks = await Promise.all(
        attachments.map(async (attachment, index) => {
          // ইমেজ ডাটা ফেচ করা
          const response = await axios.get(attachment.url, { responseType: "arraybuffer" });
          
          const formData = new FormData();
          formData.append("image", Buffer.from(response.data, "binary"), { filename: `image${index}.jpg` });

          // ImgBB এপিআই-তে আপলোড করা
          const res = await axios.post("https://api.imgbb.com/1/upload", formData, {
            headers: formData.getHeaders(),
            params: {
              key: imgbbApiKey
            }
          });

          return `🔗 Image ${index + 1}: ${res.data.data.url}`;
        })
      );

      // সফল হলে আপলোড করা লিঙ্কগুলো পাঠানো
      api.unsendMessage(info.messageID);
      return api.sendMessage(`✅ আপলোড সম্পন্ন হয়েছে!\n\n${uploadedLinks.join("\n")}`, threadID, messageID);

    } catch (err) {
      console.error("Upload error:", err);
      api.unsendMessage(info.messageID);
      return api.sendMessage("❌ ImgBB-তে ছবি আপলোড করতে সমস্যা হয়েছে।", threadID, messageID);
    }
  }, messageID);
};
