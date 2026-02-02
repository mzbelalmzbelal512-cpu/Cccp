-cmd install jail.js const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports.config = {
  name: "jail",
  version: "2.0",
  author: "Akash × Fixed Jail",
  countDown: 10,
  role: 0,
  shortDescription: "Jail user avatar (fixed)",
  category: "fun",
  guide: { en: "{p}jail @tag" }
};

module.exports.onStart = async function ({ api, event, args }) {
  const { threadID, messageID, mentions } = event;

  let uid;
  let name = "You";

  if (Object.keys(mentions).length === 0) {
    uid = event.senderID;
  } else {
    uid = Object.keys(mentions)[0];
    name = mentions[uid];
  }

  try {
    // Get User Info for Name
    const userInfo = await api.getUserInfo(uid);
    name = userInfo[uid].name;

    // Avatar URL (No Token Needed)
    const avatarUrl = `https://graph.facebook.com/${uid}/picture?width=512&height=512&type=large`;

    // Download Avatar
    const avatarPath = path.join(__dirname, 'cache', `jail_avatar_${uid}.jpg`);
    const writer = fs.createWriteStream(avatarPath);
    const response = await axios.get(avatarUrl, { responseType: 'stream' });
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // Generate Jail
    const jailPath = await generateJailImage(avatarPath, name);

    await api.sendMessage({
      body: `@${name} JAILED! 🔒 Bars on!`,
      mentions: [{ tag: name, id: uid }],
      attachment: fs.createReadStream(jailPath)
    }, threadID, messageID);

    // Cleanup
    setTimeout(() => {
      [avatarPath, jailPath].forEach(file => fs.existsSync(file) && fs.unlinkSync(file));
    }, 10000);

  } catch (error) {
    console.error("Jail Error:", error);
    api.sendMessage("⚠️ Can't jail this user! Maybe private profile or FB block.", threadID, messageID);
  }
};

// === Generate Jail Image ===
async function generateJailImage(avatarPath, name) {
  const avatar = await loadImage(avatarPath);
  const size = 600;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // BG
  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, size, size);

  // Avatar Circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, 260, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(avatar, size / 2 - 260, size / 2 - 260, 520, 520);
  ctx.restore();

  // Jail Bars (Realistic)
  const barWidth = 30;
  const barSpacing = 75;
  const barColor = '#cccccc';
  ctx.strokeStyle = barColor;
  ctx.lineWidth = barWidth;
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 15;

  // Vertical Bars
  for (let i = 0; i < 9; i++) {
    const x = 50 + i * barSpacing;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }

  // Horizontal Bars
  ctx.lineWidth = barWidth - 5;
  for (let i = 0; i < 6; i++) {
    const y = 80 + i * 85;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  // JAILED Text
  ctx.font = 'bold 90px Arial';
  ctx.fillStyle = '#ff0000';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#ff0000';
  ctx.shadowBlur = 50;
  ctx.fillText('JAILED!', size / 2, size - 100);
  ctx.shadowColor = 'transparent';

  // Name
  ctx.font = 'italic 45px "Segoe UI"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(name.split(' ')[0].toUpperCase(), size / 2, size - 40);

  // Save
  const cacheDir = path.join(__dirname, 'cache');
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
  const filePath = path.join(cacheDir, `jail_fixed_${Date.now()}.png`);
  fs.writeFileSync(filePath, canvas.toBuffer());
  return filePath;
}
