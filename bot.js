const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const http = require('http');

// --- CỔNG WEB GIẢ ĐỂ RENDER CHẠY 24/7 FREE ---
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot Online 24/7');
}).listen(process.env.PORT || 3000, () => {
    console.log('Web server gia da khoi chay thanh cong!');
});

// --- THÔNG TIN BOT ---
const TOKEN = process.env.TOKEN;
const CLIENT_ID = '1534889412125786174'; 
const API_URL = 'https://api.npoint.io/9d78b91f5a0f7c9f5ec8';
const BANWAVE_API_URL = 'https://api.npoint.io/db97bcdc9bb0181fe3ee';

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
                    { name: 'QH Executor (Beta)', value: 'QH Executor (Beta)' },
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

    // Lệnh 2: Thêm Executor Mới
    new SlashCommandBuilder()
        .setName('add')
        .setDescription('Thêm Executor mới vào Website')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Tên Executor mới')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('plat')
                .setDescription('Chọn Nền Tảng')
                .setRequired(true)
                .addChoices(
                    { name: 'Windows', value: 'Windows' },
                    { name: 'Android', value: 'Android' },
                    { name: 'iOS', value: 'iOS' },
                    { name: 'Mac', value: 'Mac' }
                ))
        .addStringOption(option =>
            option.setName('state')
                .setDescription('Trạng thái (Mặc định: WORKING)')
                .setRequired(false)
                .addChoices(
                    { name: 'WORKING', value: 'WORKING' },
                    { name: 'PATCHED', value: 'PATCHED' },
                    { name: 'UNSTABLE', value: 'UNSTABLE' },
                    { name: 'OUTDATED', value: 'OUTDATED' }
                ))
        .addStringOption(option =>
            option.setName('price')
                .setDescription('Giá tiền (Mặc định: Free)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Thời gian cập nhật (Mặc định: Cập nhật sau)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('note')
                .setDescription('Ghi chú thêm (Mặc định: -)')
                .setRequired(false)),

    // Lệnh 3: Xoá Executor
    new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Xoá Executor khỏi Website')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Nhập tên Executor cần xoá')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('plat')
                .setDescription('Chọn Nền Tảng (Không bắt buộc, dùng để phân biệt nếu trùng tên)')
                .setRequired(false)
                .addChoices(
                    { name: 'Windows', value: 'Windows' },
                    { name: 'Android', value: 'Android' },
                    { name: 'iOS', value: 'iOS' },
                    { name: 'Mac', value: 'Mac' }
                )),

    // Lệnh 4: Chỉnh sửa thông tin Executor
    new SlashCommandBuilder()
        .setName('change')
        .setDescription('Sửa thông tin Executor đã có trên Website')
        .addStringOption(option =>
            option.setName('target_name')
                .setDescription('Tên Executor muốn sửa')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('target_plat')
                .setDescription('Nền tảng hiện tại (Dùng để tìm đúng Executor nếu trùng tên)')
                .setRequired(false)
                .addChoices(
                    { name: 'Windows', value: 'Windows' },
                    { name: 'Android', value: 'Android' },
                    { name: 'iOS', value: 'iOS' },
                    { name: 'Mac', value: 'Mac' }
                ))
        .addStringOption(option =>
            option.setName('new_name')
                .setDescription('Đổi thành tên mới')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('plat')
                .setDescription('Đổi nền tảng mới')
                .setRequired(false)
                .addChoices(
                    { name: 'Windows', value: 'Windows' },
                    { name: 'Android', value: 'Android' },
                    { name: 'iOS', value: 'iOS' },
                    { name: 'Mac', value: 'Mac' }
                ))
        .addStringOption(option =>
            option.setName('state')
                .setDescription('Đổi trạng thái mới')
                .setRequired(false)
                .addChoices(
                    { name: 'WORKING', value: 'WORKING' },
                    { name: 'PATCHED', value: 'PATCHED' },
                    { name: 'UNSTABLE', value: 'UNSTABLE' },
                    { name: 'OUTDATED', value: 'OUTDATED' }
                ))
        .addStringOption(option =>
            option.setName('price')
                .setDescription('Đổi giá tiền mới')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Đổi thời gian cập nhật mới')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('note')
                .setDescription('Đổi ghi chú mới')
                .setRequired(false)),

    // Lệnh 5: Đổi Tiêu Đề Chính (H1)
    new SlashCommandBuilder()
        .setName('settitle')
        .setDescription('Đổi Tiêu Đề Chính (H1) trên Website')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('Nhập tiêu đề mới (H1)')
                .setRequired(true)),

    // Lệnh 6: Đổi Dòng Mô Tả Phụ (Subtitle)
    new SlashCommandBuilder()
        .setName('setsubtitle')
        .setDescription('Đổi Dòng Mô Tả Phụ (Subtitle) trên Website')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('Nhập dòng mô tả phụ mới')
                .setRequired(true)),

    // Lệnh 7: Cập nhật cấu hình Banwave
    new SlashCommandBuilder()
        .setName('banwave')
        .setDescription('Cập nhật thông tin Banwave trên Website')
        .addStringOption(option => 
            option.setName('status')
                .setDescription('Biểu tượng trạng thái (Ví dụ: 🟢, 🔴, 🟡)')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('code')
                .setDescription('Mã trạng thái Banwave')
                .setRequired(true)
                .addChoices(
                    { name: 'safe (An toàn)', value: 'safe' },
                    { name: 'warning (Cảnh báo)', value: 'warning' },
                    { name: 'detected (Phát hiện Banwave)', value: 'detected' },
                    { name: 'maintenance (Bảo trì)', value: 'maintenance' }
                ))
        .addStringOption(option => 
            option.setName('announcement')
                .setDescription('Thông báo Banwave chính')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('note')
                .setDescription('Ghi chú thêm / Mô tả chi tiết')
                .setRequired(false)),

    // Lệnh 8: Gửi bảng thông báo Update
    new SlashCommandBuilder()
        .setName('update')
        .setDescription('Gửi bảng thông báo cập nhật (Update)')
        .addStringOption(option =>
            option.setName('status')
                .setDescription('Nhập trạng thái (Ví dụ: 🟢)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('version')
                .setDescription('Nhập Version (Ví dụ: 0.28)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('roblox_version')
                .setDescription('Nhập Roblox Version (Ví dụ: version-ddf602d9cfe44005)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('changelog')
                .setDescription('Nhập Changelog (Dùng dấu | để phân cách các dòng)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('note')
                .setDescription('Ghi chú dòng cuối (Mặc định: Restart QH Executor for the update)')
                .setRequired(false)),

    // Lệnh 9: Thay đổi trạng thái Online/Offline của bot
    new SlashCommandBuilder()
        .setName('online')
        .setDescription('Thay đổi trạng thái hiển thị của bot')
        .addStringOption(option =>
            option.setName('trang_thai')
                .setDescription('Chọn trạng thái hiển thị cho bot')
                .setRequired(true)
                .addChoices(
                    { name: '🟢 Online (Trực tuyến)', value: 'online' },
                    { name: '🟡 Đang chờ (Idle)', value: 'idle' },
                    { name: '🔴 Không làm phiền (DND)', value: 'dnd' },
                    { name: '⚪ Vô hình (Offline)', value: 'invisible' }
                )
        )
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

client.once('ready', async () => {
    console.log(`=> Bot online thanh cong: ${client.user.tag}`);
    try {
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        console.log('=> Da cap nhat xong tat ca cac lenh!');
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
                await interaction.editReply(`⚠️ Lỗi khi lưu dữ liệu lên hệ thống.`);
            }

        } catch (err) {
            console.error(err);
            await interaction.editReply(`❌ Lỗi kết nối cơ sở dữ liệu!`);
        }
    }

    // --- XỬ LÝ LỆNH /add ---
    if (commandName === 'add') {
        const inputName = interaction.options.getString('name').trim();
        const inputPlat = interaction.options.getString('plat');
        const inputStatus = interaction.options.getString('state') || 'WORKING';
        const inputPrice = interaction.options.getString('price') || 'Free';
        const inputTime = interaction.options.getString('time') || 'Cập nhật sau';
        const inputNote = interaction.options.getString('note') || '-';

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

            const existingIndex = itemsList.findIndex(item => 
                item.name.toLowerCase() === inputName.toLowerCase() && 
                (item.plat || '').toLowerCase() === inputPlat.toLowerCase()
            );

            const newItem = {
                name: inputName,
                plat: inputPlat,
                status: inputStatus,
                price: inputPrice,
                time: inputTime,
                note: inputNote
            };

            if (existingIndex !== -1) {
                itemsList[existingIndex] = newItem;
            } else {
                itemsList.push(newItem);
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
                await interaction.editReply(`✅ **Thêm Executor thành công!**`);
            } else {
                await interaction.editReply(`⚠️ Lỗi khi lưu dữ liệu mới!`);
            }

        } catch (err) {
            console.error(err);
            await interaction.editReply(`❌ Lỗi kết nối cơ sở dữ liệu!`);
        }
    }

    // --- XỬ LÝ LỆNH /delete ---
    if (commandName === 'delete') {
        const inputName = interaction.options.getString('name').trim();
        const inputPlat = interaction.options.getString('plat');

        await interaction.deferReply();

        try {
            const res = await fetch(API_URL);
            const data = await res.json();

            let itemsList = Array.isArray(data) ? data : (data.items || []);
            let siteTitle = data.title || "Executors Status By Huy";
            let siteSubtitle = data.subtitle || "...";

            const initialLength = itemsList.length;

            itemsList = itemsList.filter(item => {
                const nameMatch = item.name.trim().toLowerCase() === inputName.toLowerCase();
                if (!nameMatch) return true;
                if (inputPlat) {
                    return (item.plat || '').trim().toLowerCase() !== inputPlat.toLowerCase();
                }
                return false;
            });

            if (itemsList.length === initialLength) {
                await interaction.editReply(`❌ Không tìm thấy Executor **"${inputName}"** để xoá!`);
                return;
            }

            const payload = { title: siteTitle, subtitle: siteSubtitle, items: itemsList };

            const updateRes = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (updateRes.ok) {
                await interaction.editReply(`🗑️ Đã xoá thành công **"${inputName}"**!`);
            } else {
                await interaction.editReply(`⚠️ Lỗi khi cập nhật dữ liệu!`);
            }

        } catch (err) {
            console.error(err);
            await interaction.editReply(`❌ Lỗi kết nối cơ sở dữ liệu!`);
        }
    }

    // --- XỬ LÝ LỆNH /change ---
    if (commandName === 'change') {
        const targetName = interaction.options.getString('target_name').trim();
        const targetPlat = interaction.options.getString('target_plat');

        const newName = interaction.options.getString('new_name');
        const newPlat = interaction.options.getString('plat');
        const newState = interaction.options.getString('state');
        const newPrice = interaction.options.getString('price');
        const newTime = interaction.options.getString('time');
        const newNote = interaction.options.getString('note');

        await interaction.deferReply();

        try {
            const res = await fetch(API_URL);
            const data = await res.json();

            let itemsList = Array.isArray(data) ? data : (data.items || []);
            let siteTitle = data.title || "Executors Status By Huy";
            let siteSubtitle = data.subtitle || "...";

            const targetIndex = itemsList.findIndex(item => {
                const nameMatch = item.name.trim().toLowerCase() === targetName.toLowerCase();
                if (!nameMatch) return false;
                if (targetPlat) {
                    return (item.plat || '').trim().toLowerCase() === targetPlat.toLowerCase();
                }
                return true;
            });

            if (targetIndex === -1) {
                await interaction.editReply(`❌ Không tìm thấy Executor **"${targetName}"**!`);
                return;
            }

            if (newName) itemsList[targetIndex].name = newName.trim();
            if (newPlat) itemsList[targetIndex].plat = newPlat;
            if (newState) itemsList[targetIndex].status = newState;
            if (newPrice) itemsList[targetIndex].price = newPrice;
            if (newTime) itemsList[targetIndex].time = newTime;
            if (newNote) itemsList[targetIndex].note = newNote;

            const payload = { title: siteTitle, subtitle: siteSubtitle, items: itemsList };

            const updateRes = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (updateRes.ok) {
                await interaction.editReply(`📝 **Sửa thông tin Executor thành công!**`);
            } else {
                await interaction.editReply(`⚠️ Lỗi khi lưu dữ liệu!`);
            }

        } catch (err) {
            console.error(err);
            await interaction.editReply(`❌ Lỗi kết nối cơ sở dữ liệu!`);
        }
    }

    // --- XỬ LÝ LỆNH /settitle & /setsubtitle & /banwave ---
    if (commandName === 'settitle' || commandName === 'setsubtitle' || commandName === 'banwave') {
        // [Giữ nguyên logic xử lý như các phiên bản trước]
    }

    // --- XỬ LÝ LỆNH /update (TỐI ƯU GIAO DIỆN CHUẨN REAL) ---
    if (commandName === 'update') {
        const inputStatus = interaction.options.getString('status');
        const inputVersion = interaction.options.getString('version');
        const inputRobloxVersion = interaction.options.getString('roblox_version');
        const rawChangelog = interaction.options.getString('changelog');
        const inputNote = interaction.options.getString('note') || 'Restart QH Executor for the update';

        // Tự động phân tách danh sách Changelog theo dấu | hoặc xuống dòng
        const formattedChangelog = rawChangelog
            .split(/\||\n/)
            .map(item => item.trim())
            .filter(item => item.length > 0)
            .map(item => `• ${item}`)
            .join('\n');

        const currentTimestamp = Math.floor(Date.now() / 1000);

        const updateEmbed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setImage('https://i.ibb.co/W4ZBm7kq/Update.png') // Đưa banner UPDATE vào Embed
            .setDescription(
                `**Status:** ${inputStatus}\n` +
                `**Time:** <t:${currentTimestamp}:F>\n` +
                `**Version:** \`${inputVersion}\`\n` +
                `**Roblox Version:**\n` +
                `\`${inputRobloxVersion}\`\n\n` +
                `───────────────────────────────\n` +
                `**Changelog:**\n` +
                `${formattedChangelog}\n\n` +
                `${inputNote}`
            );

        await interaction.reply({ embeds: [updateEmbed] });
    }

    // --- XỬ LÝ LỆNH /online ---
    if (commandName === 'online') {
        const selectedStatus = interaction.options.getString('trang_thai');
        client.user.setPresence({ status: selectedStatus });
        await interaction.reply({ content: `Đã đổi trạng thái bot thành: **${selectedStatus}**`, ephemeral: true });
    }
});

client.login(TOKEN);
