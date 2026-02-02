const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

module.exports.config = {
    name: "meta",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Neoaz ゐ",
    description: "Meta.AI ব্যবহার করে ৪টি ইমেজ গ্রিড তৈরি করুন।",
    commandCategory: "AI-Image",
    usages: "[prompt]",
    cooldowns: 20,
};

const API_ENDPOINT = "https://metakexbyneokex.fly.dev/images/generate";
const cacheDir = path.join(__dirname, 'cache');

// ইমেজ ডাউনলোড ফাংশন
async function downloadImage(url, filename) {
    const tempFilePath = path.join(cacheDir, filename);
    const response = await axios({
        method: 'get',
        url: url,
        responseType: 'arraybuffer',
        timeout: 60000
    });
    await fs.writeFile(tempFilePath, response.data);
    return tempFilePath;
}

// গ্রিড ইমেজ তৈরি ফাংশন
async function createGridImage(imagePaths, outputPath) {
    const images = await Promise.all(imagePaths.map(p => loadImage(p)));
    const imgWidth = images[0].width;
    const imgHeight = images[0].height;
    const padding = 10;
    const numberSize = 40;

    const canvasWidth = (imgWidth * 2) + (padding * 3);
    const canvasHeight = (imgHeight * 2) + (padding * 3);

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const positions = [
        { x: padding, y: padding },
        { x: imgWidth + (padding * 2), y: padding },
        { x: padding, y: imgHeight + (padding * 2) },
        { x: imgWidth + (padding * 2), y: imgHeight + (padding * 2) }
    ];

    for (let i = 0; i < images.length && i < 4; i++) {
        const { x, y } = positions[i];
        ctx.drawImage(images[i], x, y, imgWidth, imgHeight);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.beginPath();
        ctx.arc(x + numberSize, y + numberSize, numberSize - 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((i + 1).toString(), x + numberSize, y + numberSize);
    }
    await fs.writeFile(outputPath, canvas.toBuffer('image/png'));
    return outputPath;
}

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const prompt = args.join(" ");

    if (!fs.existsSync(cacheDir)) await fs.mkdirp(cacheDir);
    if (!prompt) return api.sendMessage("❌ Please provide a prompt!\nExample: meta a cute cat", threadID, messageID);

    api.setMessageReaction("⏳", messageID, () => {}, true);
    const tempPaths = [];
    let gridPath = '';

    try {
        const response = await axios.post(API_ENDPOINT, { prompt: prompt.trim() }, { timeout: 150000 });
        const data = response.data;

        if (!data.success || !data.images || data.images.length === 0) throw new Error("API Error");

        const imageUrls = data.images.slice(0, 4).map(img => img.url);

        for (let i = 0; i < imageUrls.length; i++) {
            const imgPath = await downloadImage(imageUrls[i], `meta_${Date.now()}_${i + 1}.png`);
            tempPaths.push(imgPath);
        }

        gridPath = path.join(cacheDir, `meta_grid_${Date.now()}.png`);
        await createGridImage(tempPaths, gridPath);

        api.sendMessage({
            body: `✨ Meta AI generated 4 images\n\n📷 Reply with 1, 2, 3, 4 to select, or "all" for all images.`,
            attachment: fs.createReadStream(gridPath)
        }, threadID, (err, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                imageUrls: imageUrls,
                tempPaths: tempPaths,
                gridPath: gridPath
            });
        }, messageID);

        api.setMessageReaction("✅", messageID, () => {}, true);
    } catch (error) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
    }
};

module.exports.handleReply = async function({ api, event, handleReply }) {
    const { imageUrls, tempPaths, gridPath, author } = handleReply;
    if (event.senderID !== author) return;

    const userReply = event.body.trim().toLowerCase();
    const selectedImagePaths = [];

    try {
        api.setMessageReaction("⏳", event.messageID, () => {}, true);

        if (userReply === 'all') {
            for (let i = 0; i < imageUrls.length; i++) {
                const imgPath = await downloadImage(imageUrls[i], `selected_all_${Date.now()}_${i + 1}.png`);
                selectedImagePaths.push(imgPath);
            }
            await api.sendMessage({ body: `✨ All images:`, attachment: selectedImagePaths.map(p => fs.createReadStream(p)) }, event.threadID);
        } else {
            const selection = parseInt(userReply);
            if (isNaN(selection) || selection < 1 || selection > 4) return;

            const selectedPath = await downloadImage(imageUrls[selection - 1], `selected_${Date.now()}.png`);
            selectedImagePaths.push(selectedPath);
            await api.sendMessage({ body: `✨ Image ${selection}:`, attachment: fs.createReadStream(selectedPath) }, event.threadID);
        }
        api.setMessageReaction("✅", event.messageID, () => {}, true);
    } catch (error) {
        api.sendMessage(`❌ Failed: ${error.message}`, event.threadID);
    } finally {
        // ক্লিনআপ
        setTimeout(async () => {
            [...tempPaths, gridPath, ...selectedImagePaths].forEach(p => {
                if (fs.existsSync(p)) fs.unlinkSync(p);
            });
        }, 5000);
    }
};
