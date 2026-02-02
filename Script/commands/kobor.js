module.exports.config = {
  'name': "kobor",
  'version': "1.0.1",
  'hasPermssion': 0x0,
  'credits': "BELAL BOTX666",
  'description': "Admin info",
  'commandCategory': "...",
  'cooldowns': 0x1,
  'dependencies': {
    'request': '',
    'fs-extra': '',
    'axios': ''
  }
};
module.exports.run = async function ({
  api: _0x586245,
  event: _0x233118,
  args: _0x340f96,
  client: _0x5bc027,
  Users: _0x17b1ae,
  Threads: _0x21235a,
  __GLOBAL: _0x2ba20c,
  Currencies: _0x3f0fe3
}) {
  const _0x19ff11 = global.nodemodule.request;
  const _0x1ee31b = global.nodemodule["fs-extra"];
  var _0x2d4fe4 = ["https://i.imgur.com/wJZCJDt.mp4", "https://i.imgur.com/tvl71V8.mp4", "https://i.imgur.com/MddkgxW.mp4"];
  var _0x40a9af = () => _0x586245.sendMessage({
    'body': " ===== কবরের ডাক =====\n=======================\nপ্রতি দিন ডাকি তোমায়\n              নেই কোন চেতনা,,\nসময় থাকিতে কর,\n              পরকালের সাধনা।।।\n\nডাকার মত ডাকব একদিন\n              আমি  অন্ধকার কবর,,\nআসতে হবে আমার কোলে, \n              রাখনা কোন খবর।।\n\n সাপ বিচ্ছু  আজব গজব\n              থাকবে তুমি একলা,,,\n তোমার যে দিন ডাক পরিবে,\n              পরবে কান্নার মেলা।।\n\nছেলে মেয়ে কাঁদবে সবাই\n             কেউ হবে না সাথী,,,\nআমি কবর নিজর্ন গৃহ, \n             কেউ দিবে না বাতি।।\n\nতোমার সম্বল ঈমানের বল\n             হিসাব হবে পথে,,,\n শান্তি যদি পেতে চাও\n            আমল আনিও সাথে।।।\n\n𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━➢ ┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄",
    'attachment': _0x1ee31b.createReadStream(__dirname + "/cache/juswa.mp4")
  }, _0x233118.threadID, () => _0x1ee31b.unlinkSync(__dirname + "/cache/juswa.mp4"));
  return _0x19ff11(encodeURI(_0x2d4fe4[Math.floor(Math.random() * _0x2d4fe4.length)])).pipe(_0x1ee31b.createWriteStream(__dirname + "/cache/juswa.mp4")).on("close", () => _0x40a9af());
};
