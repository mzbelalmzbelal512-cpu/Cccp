const axios = require("axios");
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "pinterest",
  version: "2.2.0",
  hasPermssion: 0,
  credits: "Mahi-- (Mirai Version)",
  description: "Pinterest থেকে ছবি খুঁজুন (ক্যানভাস ভিউ সহ)।",
  commandCategory: "Image",
  usages: "[query] [-count]",
  cooldowns: 10,
};

// ক্যানভাস জেনারেট করার ফাংশন
async function generatePinterestCanvas(imageObjects, query, page, totalPages) {
  const canvasWidth = 800;
  const canvasHeight = 1600;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1e1e1e';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = '#ffffff';
  ctx.font = '24px Arial';
  ctx.fillText('🔍 Pinterest Searcher', 20, 45);
  ctx.font = '16px Arial';
  ctx.fillStyle = '#b0b0b0';
  ctx.fillText(`Search results of "${query}", Showing ${imageObjects.length} images.`, 20, 75);

  const numColumns = 3;
  const padding = 15;
  const columnWidth = (canvasWidth - (padding * (numColumns + 1))) / numColumns;
  const columnHeights = Array(numColumns).fill(100);

  const loadedPairs = await Promise.all(
    imageObjects.map(obj =>
      loadImage(obj.url).then(img => ({ img, originalIndex: obj.originalIndex })).catch(() => null)
    )
  );

  const successful = loadedPairs.filter(x => x !== null);
  const displayedMap = [];
  let displayNumber = 0;

  for (let i = 0; i < successful.length; i++) {
    const { img, originalIndex } = successful[i];
    const minHeight = Math.min(...columnHeights);
    const columnIndex = columnHeights.indexOf(minHeight);
    const x = padding + columnIndex * (columnWidth + padding);
    const y = minHeight + padding;
    const scale = columnWidth / img.width;
    const scaledHeight = img.height * scale;

    ctx.drawImage(img, x, y, columnWidth, scaledHeight);
    displayNumber++;
    displayedMap.push(originalIndex);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(x, y, 50, 24);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`#${displayNumber}`, x + 25, y + 17);

    columnHeights[columnIndex] += scaledHeight + padding;
  }

  const cachePath = path.join(__dirname, 'cache', `pin_${Date.now()}.png`);
  if (!fs.existsSync(path.dirname(cachePath))) fs.mkdirpSync(path.dirname(cachePath));
  fs.writeFileSync(cachePath, canvas.toBuffer('image/png'));
  return { cachePath, displayedMap };
}

// ইউআরএল থেকে স্ট্রিম পাওয়ার ফাংশন
async function getStream(url) {
  return (await axios.get(url, { responseType: 'stream' })).data;
}

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  
  try {
    let count = null;
    const countIndex = args.findIndex(arg => /^-\d+$/.test(arg));
    if (countIndex !== -1) {
      count = parseInt(args[countIndex].slice(1), 10);
      args.splice(countIndex, 1);
    }

    const query = args.join(" ").trim();
    if (!query) return api.sendMessage("দয়া করে একটি সার্চ কুয়েরি দিন।", threadID, messageID);

    api.sendMessage("🔍 Pinterest-এ খোঁজা হচ্ছে...", threadID, async (err, info) => {
      try {
        const res = await axios.get(`https://egret-driving-cattle.ngrok-free.app/api/pin?query=${encodeURIComponent(query)}&num=90`);
        const allImageUrls = res.data.results || [];

        if (allImageUrls.length === 0) return api.sendMessage(`"${query}" এর জন্য কিছু পাওয়া যায়নি।`, threadID, messageID);

        if (count) {
          const urls = allImageUrls.slice(0, Math.min(count, 9));
          const attachments = await Promise.all(urls.map(url => getStream(url)));
          api.unsendMessage(info.messageID);
          return api.sendMessage({ body: `আপনার জন্য ${attachments.length}টি ছবি:`, attachment: attachments }, threadID, messageID);
        }

        const imagesPerPage = 21;
        const totalPages = Math.ceil(allImageUrls.length / imagesPerPage);
        const imagesForPage1 = allImageUrls.slice(0, imagesPerPage).map((url, idx) => ({ url, originalIndex: idx }));

        const { cachePath, displayedMap } = await generatePinterestCanvas(imagesForPage1, query, 1, totalPages);

        api.unsendMessage(info.messageID);
        api.sendMessage({
          body: `🖼️ "${query}" এর জন্য ${allImageUrls.length}টি ছবি পাওয়া গেছে।\nছবি পেতে নাম্বারে রিপ্লাই দিন অথবা 'next' লিখুন।`,
          attachment: fs.createReadStream(cachePath)
        }, threadID, (err, msgInfo) => {
          if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
          global.client.handleReply.push({
            name: this.config.name,
            messageID: msgInfo.messageID,
            author: senderID,
            allImageUrls,
            query,
            currentPage: 1,
            totalPages,
            displayedMap
          });
        }, messageID);
      } catch (e) {
        api.sendMessage("সার্ভার বা এপিআই এরর।", threadID, messageID);
      }
    }, messageID);

  } catch (error) {
    api.sendMessage("একটি ভুল হয়েছে।", threadID, messageID);
  }
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  const { threadID, messageID, senderID, body } = event;
  if (senderID !== handleReply.author) return;

  const { allImageUrls, query, currentPage, totalPages, displayedMap } = handleReply;
  const input = body.trim().toLowerCase();

  try {
    if (input === 'next') {
      if (currentPage >= totalPages) return api.sendMessage("এটিই শেষ পেজ।", threadID, messageID);
      
      const nextPage = currentPage + 1;
      const imagesPerPage = 21;
      const startIndex = (nextPage - 1) * imagesPerPage;
      const imagesForNextPage = allImageUrls.slice(startIndex, startIndex + imagesPerPage).map((url, idx) => ({ url, originalIndex: startIndex + idx }));

      const { cachePath, displayedMap: nextMap } = await generatePinterestCanvas(imagesForNextPage, query, nextPage, totalPages);

      api.unsendMessage(handleReply.messageID);
      api.sendMessage({
        body: `🖼️ Page ${nextPage}/${totalPages}.\nনাম্বারে রিপ্লাই দিন অথবা 'next' লিখুন।`,
        attachment: fs.createReadStream(cachePath)
      }, threadID, (err, msgInfo) => {
        if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
        global.client.handleReply.push({
          name: this.config.name,
          messageID: msgInfo.messageID,
          author: senderID,
          allImageUrls,
          query,
          currentPage: nextPage,
          totalPages,
          displayedMap: nextMap
        });
      }, messageID);

    } else {
      const number = parseInt(input, 10);
      if (!isNaN(number) && number > 0 && number <= displayedMap.length) {
        const imageUrl = allImageUrls[displayedMap[number - 1]];
        const stream = await getStream(imageUrl);
        api.sendMessage({ body: `Image #${number} for "${query}":`, attachment: stream }, threadID, messageID);
      }
    }
  } catch (e) {
    api.sendMessage("ছবি লোড করতে সমস্যা হয়েছে।", threadID, messageID);
  }
};
