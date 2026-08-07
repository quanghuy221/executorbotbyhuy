const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const http = require('http');

// --- CỔNG WEB GIẢ ĐỂ RENDER CHẠY 24/7 FREE ---
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot Online 24/7');
}).listen(process.env.PORT || 3000, () => {
    console.log('Web server gia da khoi chay thanh cong!');
});

// --- THÔNG TIN BOT CỦA HUY ---
const TOKEN = process.env.TOKEN;
const CLIENT_ID = '1534889412125786174'; 
const API_URL = 'https://api.npoint.io/9d78b91f5a0f7c9f5ec8';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const commands = [
    // Lệnh 1: Cập nhật trạng thái Executor
    new SlashCommandBuilder()
        .setName('status')
        .setDescription('Cập nhật trạng thái Executor trên Website')
        .addStringOption(option => 
            option.setName('name')
                .setDescription('Chọn tên Executor trên Website')
                .setRequired(true)
                .addChoices(
                    { name: 'Yub X', value: 'yub x' },
                    { name: 'Nexomia', value: 'nexomia' },
                    { name: 'Potassium', value: 'potassium' },
                    { name: 'Volt', value: 'volt' },
                    { name: 'Wave', value: 'wave' },
                    { name: 'Ronix', value: 'ronix' },
                    { name: 'Synapse Z', value: 'synapse z' },
                    { name: 'Seliware', value: 'seliware' },
                    { name: 'Madium V2', value: 'madium v2' },
                    { name: 'Cosmic', value: 'cosmic' },
                    { name: 'Velocity', value: 'velocity' },
                    { name: 'SirHurt', value: 'sirhurt' },
                    { name: 'Xeno', value: 'xeno' },
                    { name: 'Solara', value: 'solara' },
                    { name: 'TDT', value: 'tdt' },
                    { name: 'Sapphire', value: 'sapphire' },
                    { name: 'Real', value: 'real' },
                    { name: 'Vortex', value: 'vortex' },
                    { name: 'Opiumware', value: 'opiumware' },
                    { name: 'MacSploit', value: 'macsploit' },
                    { name: 'Delta (Android)', value: 'delta_android' },
                    { name: 'Codex', value: 'codex' },
                    { name: 'Vega X', value: 'vega x' },
                    { name: 'Delta (iOS)', value: 'delta_ios' }
                ))
        .addStringOption(option => 
            option.setName('state')
                .setDescription('Trạng thái mới')
                .setRequired(true)
                .addChoices(
                    { name: 'WORKING', value: 'WORKING' },
                    { name: 'PATCHED', value: 'PATCHED' },
                    { name: 'UNSTABLE', value: 'UNSTABLE' },
                    { name: 'OUTDATED', value: 'OUTDATED' }
                )),

    // Lệnh 2: Đổi Tiêu Đề Chính (H1)
    new SlashCommandBuilder()
        .setName('settitle')
        .setDescription('Đổi Tiêu Đề Chính (H1) trên Website')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('Nhập tiêu đề mới (H1)')
                .setRequired(true)),

    // Lệnh 3: Đổi Dòng Mô Tả Phụ (Subtitle)
    new SlashCommandBuilder()
        .setName('setsubtitle')
        .setDescription('Đổi Dòng Mô Tả Phụ (Subtitle) trên Website')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('Nhập dòng mô tả phụ mới')
                .setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

client.once('ready', async () => {
    console.log(`=> Bot executorbotbyhuy đã online thành công: ${client.user.tag}`);
    try {
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        console.log('=> Đã cập nhật xong tất cả các lệnh (/status, /settitle, /setsubtitle)!');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    // --- XỬ LÝ LỆNH /status ---
    if (commandName === 'status') {
        const rawChoice = interaction.options.getString('name');
        const newState = interaction.options.getString('state');

        await interaction.deferReply();

        try {
            const res = await fetch(API_URL);
            const data = await res.json();

            let itemsList = [];
            let siteTitle = "Executors Status By Huy";
            let siteSubtitle = "...";

            if (Array.isArray(data)) {
                itemsList = data;
            } else if (data && typeof data === 'object') {
                siteTitle = data.title || siteTitle;
                siteSubtitle = data.subtitle || siteSubtitle;
                itemsList = Array.isArray(data.items) ? data.items : [];
            }

            let found = false;
            let displayTargetName = rawChoice;

            for (let item of itemsList) {
                const itemNameLower = item.name.trim().toLowerCase();
                const itemPlatLower = (item.plat || '').trim().toLowerCase();

                if (rawChoice === 'delta_android') {
                    displayTargetName = 'Delta (Android)';
                    if (itemNameLower === 'delta' && itemPlatLower === 'android') {
                        item.status = newState;
                        found = true;
                        break;
                    }
                } else if (rawChoice === 'delta_ios') {
                    displayTargetName = 'Delta (iOS)';
                    if (itemNameLower === 'delta' && itemPlatLower === 'ios') {
                        item.status = newState;
                        found = true;
                        break;
                    }
                } else {
                    if (itemNameLower === rawChoice.trim().toLowerCase()) {
                        displayTargetName = item.name;
                        item.status = newState;
                        found = true;
                        break;
                    }
                }
            }

            if (!found) {
                await interaction.editReply(`❌ Không tìm thấy Executor **"${displayTargetName}"** trên website!`);
                return;
            }

            const payload = {
                title: siteTitle,
                subtitle: siteSubtitle,
                items: itemsList
            };

            const updateRes = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (updateRes.ok) {
                await interaction.editReply(`✅ Cập nhật thành công! **${displayTargetName}** -> **${newState}**.`);
            } else {
                await interaction.editReply(`⚠️ Lỗi khi lưu dữ liệu lên hệ thống data by Admin.`);
            }

        } catch (err) {
            console.error(err);
            await interaction.editReply(`❌ Lỗi kết nối cơ sở dữ liệu!`);
        }
    }

    // --- XỬ LÝ LỆNH /settitle ---
    if (commandName === 'settitle') {
        const newTitle = interaction.options.getString('text');
        await interaction.deferReply();

        try {
            const res = await fetch(API_URL);
            const data = await res.json();

            let itemsList = Array.isArray(data) ? data : (data.items || []);
            let currentSubtitle = data.subtitle || "...";

            const payload = {
                title: newTitle,
                subtitle: currentSubtitle,
                items: itemsList
            };

            const updateRes = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (updateRes.ok) {
                await interaction.editReply(`✅ Đã đổi **Tiêu Đề Chính (H1)** thành: **"${newTitle}"**`);
            } else {
                await interaction.editReply(`⚠️ Lỗi khi lưu dữ liệu lên Data by Admin.`);
            }
        } catch (err) {
            console.error(err);
            await interaction.editReply(`❌ Lỗi kết nối cơ sở dữ liệu!`);
        }
    }

    // --- XỬ LÝ LỆNH /setsubtitle ---
    if (commandName === 'setsubtitle') {
        const newSubtitle = interaction.options.getString('text');
        await interaction.deferReply();

        try {
            const res = await fetch(API_URL);
            const data = await res.json();

            let itemsList = Array.isArray(data) ? data : (data.items || []);
            let currentTitle = data.title || "Executors Status By Huy";

            const payload = {
                title: currentTitle,
                subtitle: newSubtitle,
                items: itemsList
            };

            const updateRes = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (updateRes.ok) {
                await interaction.editReply(`✅ Đã đổi **Dòng Mô Tả Phụ (Subtitle)** thành: **"${newSubtitle}"**`);
            } else {
                await interaction.editReply(`⚠️ Lỗi khi lưu dữ liệu lên Data by Admin.`);
            }
        } catch (err) {
            console.error(err);
            await interaction.editReply(`❌ Lỗi kết nối cơ sở dữ liệu!`);
        }
    }
});

client.login(TOKEN);
