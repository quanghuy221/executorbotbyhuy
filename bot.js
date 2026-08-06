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
                ))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

client.once('ready', async () => {
    console.log(`=> Bot executorbotbyhuy đã online thành công: ${client.user.tag}`);
    try {
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        console.log('=> Đã cập nhật đúng chuẩn 23 tên Executor trên npoint!');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'status') {
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

                // Xử lý riêng cho Delta Android & Delta iOS
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
                    // Các Executor khác
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
                await interaction.editReply(`✅ Cập nhật thành công! **${displayTargetName}** -> **${newState}** (By Admin Siêu Đẹp Trai).`);
            } else {
                await interaction.editReply(`⚠️ Lỗi khi lưu dữ liệu lên hệ thống npoint.`);
            }

        } catch (err) {
            console.error(err);
            await interaction.editReply(`❌ Lỗi kết nối cơ sở dữ liệu!`);
        }
    }
});

client.login(TOKEN);
