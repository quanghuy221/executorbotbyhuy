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
                .setDescription('Chọn tên Executor')
                .setRequired(true)
                .addChoices(
                    { name: 'Potassium', value: 'potassium' },
                    { name: 'Wave', value: 'wave' },
                    { name: 'Banana Cat Hub', value: 'banana cat hub' },
                    { name: 'Maru Hub', value: 'maru hub' },
                    { name: 'Delta', value: 'delta' },
                    { name: 'Codex', value: 'codex' }
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
        console.log('=> Đã cập nhật lại menu chọn cho /status!');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'status') {
        const targetName = interaction.options.getString('name').trim().toLowerCase();
        const newState = interaction.options.getString('state');

        await interaction.deferReply();

        try {
            const res = await fetch(API_URL);
            const data = await res.json();

            let itemsList = [];
            let siteTitle = "Roblox Executors Status";
            let siteSubtitle = "Trạng thái cập nhật liên tục";

            if (Array.isArray(data)) {
                itemsList = data;
            } else if (data && typeof data === 'object') {
                siteTitle = data.title || siteTitle;
                siteSubtitle = data.subtitle || siteSubtitle;
                itemsList = Array.isArray(data.items) ? data.items : [];
            }

            let found = false;
            for (let item of itemsList) {
                if (item.name.trim().toLowerCase() === targetName) {
                    item.status = newState;
                    found = true;
                    break;
                }
            }

            if (!found) {
                await interaction.editReply(`❌ Không tìm thấy Executor **"${targetName}"** trên website!`);
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
                await interaction.editReply(`✅ Cập nhật thành công! **${targetName}** -> **${newState}** (Web & Admin đã tự đổi).`);
            } else {
                await interaction.editReply(`⚠️ Lỗi khi lưu dữ liệu lên hệ thống.`);
            }

        } catch (err) {
            console.error(err);
            await interaction.editReply(`❌ Lỗi kết nối cơ sở dữ liệu!`);
        }
    }
});

client.login(TOKEN);
