// Creator: **cleanverse**
// I will not help setup the bot as I provided all the code that you can just copy and paste, if you get errors you probably don't have everything installed properly or you're missing things you can find everything used here --> https://pastebin.com/CTWckxYr
// Added tons of explainations/notes next to almost everything for your better understanding and tried making the code cleaner for people that are new and wanting to learn easier
// NOTE: this obviously isnt the best Discord Bot but I hope this helps more people understand how Discord Bots are made and hopefully you can make your own using this as a reference
// I dont need any credit for anything so feel free to do whatever you want with this


const path = require('path'); // KEEP THIS (FOR THE POINTS SYSTEM)
const { Client, GatewayIntentBits } = require('discord.js');  // KEEP THIS
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { OpenAI } = require('openai');   // KEEP THIS
const axios = require('axios');   // KEEP THIS
const { Player } = require('discord-player');   // KEEP THIS

// Store the current prefix (you can replace this with a database or JSON file for persistent storage)
let prefix = '!'; // Default prefix (There is a command made where you can change the prefix to whatever you want)

// Initialize OpenAI client with your API key
const openai = new OpenAI({
    apiKey: 'OpenAI-Key-Here', // Replace with your actual OpenAI API key, you need this for it to work (NOTE: PAID VERSION WILL WORK BETTER)
});


// Replace with your own API key from ExchangeRate-API, Currency Layer, or Fixer.io (this is setup for ExchangeRate-API. For Fixer.io use this code https://pastebin.com/RmV5ZJ4V   for Currency Layer use this code https://pastebin.com/ct1709idw 
const CURRENCY_API_KEY = 'your_currency_api_key_here';  // Need to add API Key from **exchangerate-api.com** & if that doesn't work or its giving issues try https://currencylayer.com/  or  https://fixer.io/ 
const API_URL = `https://v6.exchangerate-api.com/v6/${CURRENCY_API_KEY}/latest/`;

// Create a new bot client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,                   // General server-related events
        GatewayIntentBits.GuildMessages,            // For reading messages
        GatewayIntentBits.MessageContent,           // To read the content of the messages
        GatewayIntentBits.GuildVoiceStates,
    ]
});

// Reaction Role Database (In-memory example, replace with a DB for persistence)
let reactionRoles = {}; 

// Command List for Help Menu
const commands = [
    { 
        command: 'ping', 
        description: 'Check if the bot is online. 🏓' 
    },
    { 
        command: 'info', 
        description: 'Displays information about the bot.' 
    },
    { 
        command: 'about', 
        description: 'Provides some basic information about the bot.' 
    },
    { 
        command: 'setprefix', 
        description: 'Set a custom prefix for the bot. **(Owner/Admin only)**' 
    },
    { 
        command: 'kick', 
        description: 'Kick a user from the server. **(Owner/Admin only)**' 
    },
    { 
        command: 'ban', 
        description: 'Ban a user from the server. **(Owner/Admin only)**' 
    },
    { 
        command: 'unban', 
        description: 'Unban a user from the server. **(Owner/Admin only)**' 
    },
    { 
        command: 'mute', 
        description: 'Mute a user in the server. **(Owner/Admin only)**' 
    },
    { 
        command: 'unmute', 
        description: 'Unmute a user in the server. **(Owner/Admin only)**' 
    },
    { 
        command: 'nuke', 
        description: 'Delete all messages in the current channel. **(Owner/Admin only)**' 
    },
    { 
        command: 'poll', 
        description: 'Create a poll with Yes/No options. **(Owner/Admin only)**' 
    },
    { 
        command: 'userinfo', 
        description: 'Displays detailed information about a user.' 
    },
    { 
        command: 'chatgpt', 
        description: 'Ask ChatGPT a question or get help with something.' 
    },
    { 
        command: 'reactionroles', 
        description: 'Allow users to react to emojis to gain roles. **(Owner/Admin only)**' 
    },
    { 
        command: 'gamble', 
        description: 'Play a gambling game! Flip a coin and win or lose!' 
    },
    { 
        command: 'balance', 
        description: 'Displays how many coins you have left to gamble!' 
    },
    { 
        command: 'convert', 
        description: 'Convert X amount of USD to EUR, or vice versa.' 
    },
    {   
        command: 'leaderboard', 
        description: 'Displays the Top 5 users in the server by points. **(+1 point per message in chat)**' 
    },
    {   
        command: 'givepoints', 
        description: 'Allows the Owner of the server to give points to a User. **(Owner/Admin only)**' 
    },
    { 
       command: 'weather', 
       description: 'Allows you to check the weather in whatever city you put.' 
    },
    { 
       command: 'claim', 
       description: 'Claims your daily points to boost you on the leaderboard.'
    },
    { 
       command: 'play', 
       description: 'Play some music in a VC using Youtube, Spotify, or Soundcloud links.' 
    },
    { 
       command: 'stop', 
       description: 'Stops the music from playing.' 
    },
    { 
       command: 'CUSTOM', 
        description: 'Nothing yet.' 
    },
    { 
       command: 'CUSTOM', 
       description: 'Nothing yet.' 
    },
    { 
       command: 'CUSTOM', 
       description: 'Nothing yet.' 
    }

];

// Event: Bot is ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Command Handler
const handleCommand = async (message) => {
    if (message.author.bot) return;

    // Ignore messages without the correct prefix
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    // Command handler switch
    switch (command) {
        case 'ping':
            message.reply('Pong!');
            break;

        case 'info':
            message.reply(`Hello, I'm ${client.user.tag} and I'm currently looking for some bitches`);
            break;

        case 'about':
            sendAboutEmbed(message);
            break;

        case 'setprefix':
            setPrefixCommand(message, args);
            break;

        case 'kick':
            handleKick(message, args);
            break;

        case 'ban':
            handleBan(message, args);
            break;

        case 'unban':
            handleUnban(message, args);
            break;

        case 'mute':
            handleMute(message, args);
            break;

        case 'unmute':
            handleUnmute(message, args);
            break;

        case 'nuke':
            handleNuke(message);
            break;

        case 'help':
            sendHelpEmbed(message);
            break;

        case 'poll':
            handlePoll(message, args); // Handling Poll command
            break;

        case 'userinfo':
            handleUserInfo(message, args);
            break;

        case 'chatgpt':
            await handleChatGPT(message, args); // Handle ChatGPT command
            break;

        case 'reactionroles':
            await handleReactionRolesCommand(message, args);
            break;

        case 'gamble': // Coin flip gambling game
            handleGamble(message);
            break;

        case 'balance': // Command to check balance
            handleBalance(message);
            break;

        case 'convert': // Currency Converter command
            handleCurrencyConverter(message, args);
            break;

        case 'leaderboard':
            handleLeaderboard(message);
             break;
    
        case 'givepoints':
            givePoints(message, args);
             break;

        case 'claim':
            claimDailyPoints(message);
             break;

        case 'weather': // Weather command
            handleWeather(message, args); 
             break;
    
        default:
            message.reply(`Unknown command! Use ${prefix}help for a list of available commands.`);
    }
};

// PRETTY MUCH EVERYTHING BELOW THIS IS THE BOT COMMANDS CODE //
// --------------------------------------------------------- //


// Weather Command
const WEATHER_API_KEY = 'KEY_HERE'; // Replace with your own API Key from openweathermap.org

const handleWeather = async (message, args) => {
    const city = args.join(' '); // Combine all arguments to form the city name

    if (!city) {
        return message.reply('Please provide a city name. Example: `!weather London`');
    }

    try {
        const { data } = await axios.get(
            `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
        );

        const embed = new EmbedBuilder()
            .setColor(0x1d9bf0)
            .setTitle(`🌤️ Weather in ${data.name}`)
            .setDescription(data.weather[0].description)
            .addFields(
                { name: '🌡️ Temperature', value: `${data.main.temp}°C`, inline: true },
                { name: '💧 Humidity', value: `${data.main.humidity}%`, inline: true },
                { name: '🌬️ Wind Speed', value: `${data.wind.speed} m/s`, inline: true }
            )
            .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            message.reply('City not found. Please check the city name and try again.');
        } else {
            console.error('Weather API error:', error.message);
            message.reply('Could not fetch weather data. Please try again later.');
        }
    }
};




// Points
const fs = require('fs');

// File path for points
const pointsFilePath = './points.json';

// Ensure the points file exists
if (!fs.existsSync(pointsFilePath)) {
    fs.writeFileSync(pointsFilePath, JSON.stringify({ lastReset: null }, null, 2), 'utf8');
}

// Load points data
let points = JSON.parse(fs.readFileSync(pointsFilePath, 'utf8'));

// Function to reset points every month
const resetPointsMonthly = () => {
    const currentMonth = new Date().getMonth();
    if (!points.lastReset || points.lastReset !== currentMonth) {
        points = { lastReset: currentMonth }; // Reset points data and update last reset month
        fs.writeFileSync(pointsFilePath, JSON.stringify(points, null, 2), 'utf8');
        console.log('Points reset for the new month.');
    }
};

// Call resetPointsMonthly when the bot starts
resetPointsMonthly();

// Event: When a user sends a message
client.on('messageCreate', (message) => {
    // Ignore bot messages
    if (message.author.bot) return;

    // Add points to the user for every message they send
    const userId = message.author.id;
    points[userId] = points[userId] || { points: 0 };  // Ensure the structure is correct
    points[userId].points += 1;  // Add 1 point per message

    // Debugging: Log points before saving to file
    console.log('Points before saving to file:', points);

    // Save the updated points to the file
    fs.writeFileSync(pointsFilePath, JSON.stringify(points, null, 2), 'utf8');

    // Debugging: Log points after saving to file
    console.log('Points saved to file:', points);
});

// Claim daily points
const claimDailyPoints = (message) => {
    const userId = message.author.id;
    const currentTime = Date.now();
    const pointsPerDay = 10;

    // Ensure points structure is correct
    points[userId] = points[userId] || { points: 0 };

    // Debugging: Log points before claiming daily
    console.log('Points before claiming daily:', points);

    // Check if the user has already claimed today
    if (points[userId]?.lastClaimed && currentTime - points[userId].lastClaimed < 86400000) {
        const nextClaimTime = new Date(points[userId].lastClaimed + 86400000);
        return message.reply(`You have already claimed your daily points! You can claim again on ${nextClaimTime.toLocaleString()}.`);
    }

    // Add points and update the last claim time
    points[userId].points += pointsPerDay;
    points[userId].lastClaimed = currentTime;

    // Debugging: Log points after claiming daily
    console.log('Points after claiming daily:', points);

    // Save the updated points to the file
    fs.writeFileSync(pointsFilePath, JSON.stringify(points, null, 2), 'utf8');
    message.reply(`You have claimed your daily **${pointsPerDay}** points!`);
};



// Leaderboard Command
const handleLeaderboard = async (message) => {
    const leaderboardData = Object.entries(points)
        .filter(([key]) => key !== 'lastReset')
        .sort((a, b) => b[1].points - a[1].points);

    // Log leaderboard data before creating the embed
    console.log('Leaderboard Data:', leaderboardData); // Log the leaderboard data

    if (leaderboardData.length === 0) {
        return message.reply('No leaderboard data available.');
    }

    let page = 0;
    const itemsPerPage = 5;

    // Function to generate leaderboard embed
    const generateLeaderboardEmbed = async (page) => {
        const start = page * itemsPerPage;
        const end = start + itemsPerPage;
        const currentPageData = leaderboardData.slice(start, end);

        // Fetch user data asynchronously (ensure the correct user is fetched from the guild)
        const leaderboardEntries = await Promise.all(currentPageData.map(async ([userId, userData], index) => {
            let member = message.guild.members.cache.get(userId);

            if (!member) {
                // Try to fetch the member from the guild
                try {
                    member = await message.guild.members.fetch(userId);
                } catch (error) {
                    member = null; // Fallback if the member isn't found
                }
            }

            // Ensure member is valid
            const userTag = member ? member.user.tag : 'Unknown User';
            return `**${start + index + 1}. ${userTag}** - ${userData.points} points`;
        }));

        // Log the entries to verify correct data
        console.log('Leaderboard Entries:', leaderboardEntries);

        // Ensure description is never empty or invalid
        let description = leaderboardEntries.length > 0
            ? leaderboardEntries.join('\n')
            : 'No leaderboard data available!';

        // Final debug logging to ensure description is set
        console.log('Final Description:', description);

        // Create the embed
        const embed = new EmbedBuilder()
            .setColor(0x2C2F33) // A professional, sleek color
            .setTitle('🏆 Top 5 Leaderboard')
            .setDescription(description) // Ensure description is valid
            .setFooter({
                text: `Page ${page + 1} of ${Math.ceil(leaderboardData.length / itemsPerPage)} • Updated Monthly`,
            })
            .setTimestamp();

        return embed;
    };

    // Send the initial message with the leaderboard and buttons
    const messageEmbed = await message.reply({
        embeds: [await generateLeaderboardEmbed(page)],
        components: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel('⬅️ Previous')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('➡️ Next')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(leaderboardData.length <= itemsPerPage)
            ),
        ],
    });

    // Message component collector for pagination
    const collector = messageEmbed.createMessageComponentCollector({
        time: 60000, // Collect interactions for 1 minute
    });

    collector.on('collect', async (interaction) => {
        if (!interaction.isButton()) return;

        // Handle page navigation
        if (interaction.customId === 'prev' && page > 0) page--;
        else if (interaction.customId === 'next' && page < Math.ceil(leaderboardData.length / itemsPerPage) - 1) page++;

        await interaction.update({
            embeds: [await generateLeaderboardEmbed(page)],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('prev')
                        .setLabel('⬅️ Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 0),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('➡️ Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === Math.ceil(leaderboardData.length / itemsPerPage) - 1)
                ),
            ],
        });
    });

    collector.on('end', async () => {
        try {
            await messageEmbed.edit({
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('prev')
                            .setLabel('⬅️ Previous')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId('next')
                            .setLabel('➡️ Next')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true)
                    ),
                ],
            });
        } catch (error) {
            if (error.code === 10008) {
                console.log('Message deleted or expired.');
            } else {
                console.error(error);
            }
        }
    });
};



// Give Points Command 
const givePoints = (message, args) => {
    if (args.length < 2) {
        return message.reply('Try **!givepoints**  <**@user**>  <**points**>');
    }

    const user = message.mentions.users.first();
    const pointsToAdd = parseInt(args[1], 10);

    if (!user || isNaN(pointsToAdd)) {
        return message.reply('Invalid user or points value.');
    }

    const userId = user.id;
    points[userId] = (points[userId] || { points: 0 });
    points[userId].points += pointsToAdd;

    // Debugging: Log points before saving to file
    console.log('Points before saving to file:', points);

    fs.writeFileSync(pointsFilePath, JSON.stringify(points, null, 2), 'utf8');
    
    // Debugging: Log points after saving to file
    console.log('Points saved to file:', points);
    
    message.reply(`Awarded **${pointsToAdd}** points to **${user.username}**.`);
};




// Music Player
const player = new Player(client);

// Play command
client.on('messageCreate', async (message) => {
    if (!message.content.startsWith('!play')) return;

    const args = message.content.split(' ').slice(1);
    if (!args.length) return message.reply('Please provide a song name or URL!');

    const query = args.join(' ');
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) return message.reply('You need to be in a voice channel to play music.');

    try {
        const queue = player.createQueue(message.guild.id, {
            metadata: { channel: message.channel },
        });

        // Ensure bot connects to the voice channel
        if (!queue.connection) await queue.connect(voiceChannel);

        const track = await player.search(query, { requestedBy: message.author })
            .then((x) => x.tracks[0]);

        if (!track) return message.reply('No results found for your query.');

        queue.addTrack(track);
        if (!queue.playing) await queue.play();

        message.channel.send(`🎵 Added to queue: **${track.title}** by **${track.author}**`);
    } catch (error) {
        console.error(error);
        message.reply('An error occurred while trying to play music.');
    }
});

// Stop command
client.on('messageCreate', async (message) => {
    if (message.content === '!stop') {
        const queue = player.getQueue(message.guild.id);
        if (!queue) return message.reply('There is no music playing.');

        queue.destroy();
        message.reply('⏹️ Music stopped, and the queue has been cleared.');
    }
});



// Function to get the exchange rate
async function getExchangeRate(fromCurrency, toCurrency) {
    try {
        const response = await axios.get(`${API_URL}${fromCurrency}`);
        const exchangeRates = response.data.conversion_rates;

        return exchangeRates[toCurrency] || null;
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        return null;
    }
}

// Currency converter command
async function handleCurrencyConverter(message, args) {
    if (args.length !== 3) {
        return message.reply('Usage: !convert [amount] [fromCurrency] [toCurrency]');
    }

    const amount = parseFloat(args[0]);
    const fromCurrency = args[1].toUpperCase();
    const toCurrency = args[2].toUpperCase();

    if (isNaN(amount)) {
        return message.reply('Please provide a valid number for the amount.');
    }

    const rate = await getExchangeRate(fromCurrency, toCurrency);
    if (rate === null) {
        return message.reply(`Sorry, I couldn't find the exchange rate for ${fromCurrency} to ${toCurrency}.`);
    }

    const convertedAmount = (amount * rate).toFixed(2);
    message.reply(`${amount} ${fromCurrency} is equal to ${convertedAmount} ${toCurrency}.`);
}

// Coinflip gambling Command
const handleGamble = async (message) => {
    const userBalance = await getUserBalance(message.author.id);

    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Coin Flip Game')
        .setDescription(`You currently have **${userBalance} coins**.\nHow much do you want to gamble?`)
        .setFooter({ text: 'You can gamble between 1 and your current balance.' });

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder().setCustomId('gamble_1').setLabel('Gamble 1 coin').setStyle('Primary'),
            new ButtonBuilder().setCustomId('gamble_5').setLabel('Gamble 5 coins').setStyle('Primary'),
            new ButtonBuilder().setCustomId('gamble_10').setLabel('Gamble 10 coins').setStyle('Primary'),
            new ButtonBuilder().setCustomId('gamble_all').setLabel(`Gamble All (${userBalance} coins)`).setStyle('Danger')
        );

    await message.reply({ embeds: [embed], components: [row] });
};

// Handle button interaction for coin flip
const handleGambleButton = async (interaction) => {
    if (!interaction.isButton()) return;

    const betAmount = parseInt(interaction.customId.split('_')[1]);
    const userBalance = await getUserBalance(interaction.user.id);

    if (userBalance < betAmount) {
        return interaction.reply({ content: 'You do not have enough coins to gamble this amount.', ephemeral: true });
    }

    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const outcome = result === 'Heads' ? betAmount * 2 : 0;

    await updateUserBalance(interaction.user.id, userBalance + outcome - betAmount);

    const resultEmbed = new EmbedBuilder()
        .setColor(outcome > 0 ? '#28a745' : '#dc3545')
        .setTitle('Coin Flip Result')
        .setDescription(
            `You bet **${betAmount} coins** and the coin landed on **${result}**!\n` +
            (outcome > 0 ? `You won **${betAmount * 2} coins**!` : `You lost **${betAmount} coins**.`)
        )
        .setFooter({ text: 'Better luck next time!' });

    interaction.reply({ embeds: [resultEmbed] });

    const row = interaction.message.components[0];
    row.components.forEach((button) => button.setDisabled(true));
    await interaction.message.edit({ components: [row] });
};

// Command to check balance
const handleBalance = async (message) => {
    const userBalance = await getUserBalance(message.author.id);

    const balanceEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Your Balance')
        .setDescription(`You currently have **${userBalance} coins**.`)
        .setFooter({ text: 'Good luck and gamble responsibly!' });

    message.reply({ embeds: [balanceEmbed] });
};

// Example functions to handle balance (replace with actual DB calls or other logic)
const getUserBalance = async (userId) => {
    return 1000; // Example balance
};

const updateUserBalance = async (userId, newBalance) => {
    console.log(`User balance updated: ${newBalance}`);
};

module.exports = { handleCommand, handleGambleButton };


// Reaction Roles Command
const handleReactionRolesCommand = async (message, args) => {
    // Check if the user has the required permission
    if (!message.member.permissions.has('MANAGE_ROLES')) {
        return message.reply('You need the `MANAGE_ROLES` permission to set up reaction roles.');
    }

    // Step 1: Ask for the channel ID
    const channelId = args[0];
    if (!channelId) return message.reply('Please provide a valid channel ID.');

    const channel = await message.guild.channels.fetch(channelId).catch(() => null);
    if (!channel) return message.reply('Invalid channel ID.');

    // Step 2: Ask for the message ID (Assumed edit functionality)

    async function editMessage(messageId, newContent) {
        try {
            const message = await message.channel.messages.fetch(messageId);
            await message.edit(newContent);
            console.log("Message edited successfully.");
        } catch (error) {
            if (error.code === 10008) {
                console.error('Error: Message not found or has been deleted.');
            } else {
                console.error('Error while editing message:', error);
            }
        }
    }

    // Step 3: Collect emoji-role pairs from the user
    let roleMapping = {};

    message.reply('Please provide emoji-role pairs in the format `emoji roleID`. Type `done` when finished.');

    const filter = m => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector({ filter, time: 60000, max: 10 });

    collector.on('collect', async (msg) => {
        const content = msg.content.trim();
        if (content.toLowerCase() === 'done') {
            collector.stop();
            message.reply('Reaction roles setup is complete!');
            return;
        }

        const [emoji, roleId] = content.split(' ');
        if (!emoji || !roleId) {
            return msg.reply('Invalid input. Please provide emoji and role ID.');
        }

        const role = message.guild.roles.cache.get(roleId);
        if (!role) {
            return msg.reply('Invalid role ID.');
        }

        roleMapping[emoji] = roleId;
        msg.reply(`Added ${emoji} for the ${role.name} role.`);
    });

    collector.on('end', async () => {
        if (Object.keys(roleMapping).length === 0) {
            return message.reply('No emoji-role pairs were added.');
        }

        // Store role mappings in memory (or database)
        reactionRoles[message.guild.id] = reactionRoles[message.guild.id] || {};
        reactionRoles[message.guild.id][messageId] = roleMapping;

        // React to the message with the emojis
        for (const emoji of Object.keys(roleMapping)) {
            try {
                await msg.react(emoji);
            } catch (error) {
                console.error('Error reacting to message:', error);
            }
        }

        // Confirm reaction roles setup
        let roleList = '';
        for (const [emoji, roleId] of Object.entries(roleMapping)) {
            const role = message.guild.roles.cache.get(roleId);
            roleList += `${emoji} -> ${role.name}\n`;
        }

        message.channel.send(`Reaction roles setup complete!\n**Role mappings**:\n${roleList}`);
    });
};

// Chat GPT command
const handleChatGPT = async (message, args) => {
    const userInput = args.join(' ');

    if (!userInput) {
        return message.reply('Please provide a question or prompt for ChatGPT!');
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userInput }],
        });

        message.reply(response.choices[0].message.content);
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        message.reply('Oops! Something went wrong while communicating with ChatGPT. Please try again later.');
    }
};

// User Info Command
const handleUserInfo = (message, args) => {
    const member = message.mentions.members.first() || message.member; // Mentioned user or message author
    const user = member.user;

    const userEmbed = {
        color: 0x1E90FF,
        title: `${user.username}'s Info`,
        thumbnail: { url: user.displayAvatarURL({ dynamic: true, size: 512 }) },
        fields: [
            {
                name: '👤 Username',
                value: `${user.username}#${user.discriminator}`,
                inline: true,
            },
            {
                name: '🆔 User ID',
                value: `${user.id}`,
                inline: true,
            },
            {
                name: '📆 Account Created',
                value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
                inline: false,
            },
            {
                name: '📅 Joined Server',
                value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`,
                inline: false,
            },
            {
                name: '🎭 Roles',
                value: member.roles.cache
                    .filter(role => role.id !== message.guild.id) // Exclude @everyone role
                    .map(role => `<@&${role.id}>`)
                    .join(' ') || 'None',
                inline: false,
            },
        ],
        footer: {
            text: `Requested by ${message.author.tag}`,
            icon_url: message.author.displayAvatarURL({ dynamic: true }),
        },
        timestamp: new Date(),
    };

    message.reply({ embeds: [userEmbed] });
};



// Poll Command Handler
const handlePoll = async (message, args) => {
    const pollQuestion = args.join(' ');
    if (!pollQuestion) {
        return message.reply("Please provide a valid question for the poll. Example: `!poll 'Is is clean cool?'`");
    }

    const pollDuration = args[args.length - 1].match(/[0-9]+/) ? args.pop() : 1; // in minutes
    const pollDurationInMs = pollDuration * 60 * 1000; // convert to milliseconds

    const pollEmbed = {
        color: 0x3498db,
        title: `Poll: ${pollQuestion}`,
        description: `React below to cast your vote!`,
        fields: [
            { name: '👍 Yes', value: 'React with 👍 to vote Yes.', inline: true },
            { name: '👎 No', value: 'React with 👎 to vote No.', inline: true },
            { name: '⏳ Duration', value: `The poll will last for **${pollDuration} minutes**.`, inline: false }
        ],
        footer: { text: `Poll created by ${message.author.tag}`, icon_url: message.author.avatarURL() },
        timestamp: new Date(),
    };

    const pollMessage = await message.channel.send({ embeds: [pollEmbed] });

    await pollMessage.react('👍');
    await pollMessage.react('👎');

    message.reply(`Your poll has been created! It will last for **${pollDuration} minute(s)**.`);

    setTimeout(async () => {
        const updatedPollMessage = await message.channel.messages.fetch(pollMessage.id);
        const yesVotes = updatedPollMessage.reactions.cache.get('👍')?.count - 1; // excluding bot's own reaction
        const noVotes = updatedPollMessage.reactions.cache.get('👎')?.count - 1; // excluding bot's own reaction

        const resultEmbed = {
            color: 0x2ecc71,
            title: `Poll Closed: ${pollQuestion}`,
            description: `Here are the final results!`,
            fields: [
                { name: '👍 Yes', value: `Votes: ${yesVotes || 0}`, inline: true },
                { name: '👎 No', value: `Votes: ${noVotes || 0}`, inline: true },
            ],
            footer: { text: `Poll created by ${message.author.tag}`, icon_url: message.author.avatarURL() },
            timestamp: new Date(),
        };

        await message.channel.send({ embeds: [resultEmbed] });
        await updatedPollMessage.delete();
    }, pollDurationInMs);
};

// Helper function: Send About Embed
const sendAboutEmbed = (message) => {
    const aboutEmbed = {
        color: 0x00BFFF,
        title: "About This Bot",
        thumbnail: {
            url: client.user.avatarURL(),
        },
        description: "Welcome to **cleans bot**, a multipurpose bot designed to assist with server management and fun interactions.",
        fields: [
            { name: "🤖 Bot Name:", value: `${client.user.tag}`, inline: true },
            { name: "👨‍💻 Creator:", value: "clean", inline: true },
            { name: "⚙️ Purpose:", value: "I'm here to help you manage your server, assist with moderation tasks, and provide fun commands!", inline: false },
            { name: "📅 Launched On:", value: "December 2024", inline: true },
            { name: "📥 Invite Link", value: "[Click here to invite me to your server](https://discord.com/oauth2/authorize?client_id=1320247785102245988&permissions=8&integration_type=0&scope=bot)", inline: false },
        ],
        footer: { text: "Bot created by @cleanverse" },
        timestamp: new Date(),
    };
    message.reply({ embeds: [aboutEmbed] });
};

// Helper function: Set Prefix Command
const setPrefixCommand = (message, args) => {
    const allowedUserIds = ['your_developer_id']; // Replace with your actual developer ID
    if (!allowedUserIds.includes(message.author.id) && !message.member.permissions.has('ADMINISTRATOR')) {
        return message.reply('You do not have permission to change the bot prefix.');
    }
    const newPrefix = args[0];
    if (!newPrefix) {
        return message.reply('Please provide a new prefix.');
    }
    prefix = newPrefix;
    message.reply(`The bot prefix has been changed to **${newPrefix}**.`);
};

// Helper function: Kick User
const handleKick = async (message, args) => {
    if (!message.member.permissions.has('KICK_MEMBERS')) return message.reply("You don't have permission to kick members!");
    const member = message.mentions.members.first();
    if (!member) return message.reply("Please mention a member to kick!");
    if (!member.kickable) return message.reply("I cannot kick this member!");
    await member.kick();
    message.reply(`${member.user.tag} has been kicked.`);
};

// Helper function: Ban User
const handleBan = async (message, args) => {
    if (!message.member.permissions.has('BAN_MEMBERS')) return message.reply("You don't have permission to ban members!");
    const member = message.mentions.members.first();
    if (!member) return message.reply("Please mention a member to ban!");
    if (!member.bannable) return message.reply("I cannot ban this member!");
    await member.ban();
    message.reply(`${member.user.tag} has been banned.`);
};

// Helper function: Unban User
const handleUnban = async (message, args) => {
    if (!message.member.permissions.has('BAN_MEMBERS')) return message.reply("You don't have permission to unban members!");
    const userId = args[0];
    if (!userId) return message.reply("Please provide the user ID.");
    try {
        await message.guild.members.unban(userId);
        message.reply(`The user with ID ${userId} has been unbanned.`);
    } catch (error) {
        message.reply("Failed to unban the user.");
        console.error("Error while unbanning:", error);
    }
};

// Helper function: Mute User
const handleMute = async (message, args) => {
    if (!message.member.permissions.has('MUTE_MEMBERS')) return message.reply("You don't have permission to mute members!");
    const member = message.mentions.members.first();
    if (!member) return message.reply("Please mention a member to mute!");
    const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
    if (!muteRole) return message.reply("No 'Muted' role found. Please create one.");
    await member.roles.add(muteRole);
    message.reply(`${member.user.tag} has been muted.`);
};

// Helper function: Unmute User
const handleUnmute = async (message, args) => {
    if (!message.member.permissions.has('MUTE_MEMBERS')) return message.reply("You don't have permission to unmute members!");
    const member = message.mentions.members.first();
    if (!member) return message.reply("Please mention a member to unmute!");
    const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
    if (!muteRole) return message.reply("No 'Muted' role found. Please create one.");
    await member.roles.remove(muteRole);
    message.reply(`${member.user.tag} has been unmuted.`);
};

// Helper function: Nuke Channel
const handleNuke = async (message) => {
    // Log for extra debugging just incase other errors occur
    console.log(`Attempting to delete the command message in channel: ${message.channel.name}`);
    
    try {
        // Delete the command message itself
        await message.delete();
        console.log('Command message deleted.');
    } catch (error) {
        console.error('Error while deleting the command message:', error);
        message.reply('There was an error trying to delete the command message.');
    }

    // Check if the user has the necessary permission
    if (!message.member.permissions.has('MANAGE_MESSAGES')) {
        return message.reply('You do not have permission to nuke this channel.');
    }

    try {
        // Fetch the last 100 messages from the channel
        const messages = await message.channel.messages.fetch({ limit: 100 });
        
        // Log the messages that are being deleted for debugging
        console.log(`Deleting ${messages.size} messages in channel: ${message.channel.name}`);
        
        // Delete the fetched messages
        await message.channel.bulkDelete(messages);

        // Send a confirmation embed message
        const embed = {
            color: 0xFF0000,
            description: '💥 Channel Nuked! All messages have been deleted.',
            image: { url: 'https://i.redd.it/1qxuw0kkclgc1.gif' }
        };

        // Send the embed and delete it after 5 seconds
        message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 5000));

    } catch (error) {
        console.error('Error while nuking the channel:', error);
        message.reply('There was an error trying to nuke the channel.');
    }
};


// Helper function:Help Command
const sendHelpEmbed = async (message) => {
    const commandsPerPage = 5; // Number of commands per page
    const totalPages = Math.ceil(commands.length / commandsPerPage);

    // Function to generate an embed for a specific page
    const generateEmbed = (page) => {
        const start = (page - 1) * commandsPerPage;
        const end = start + commandsPerPage;

        const embed = new EmbedBuilder()
            .setColor(0x4CAF50) // Green color
            .setTitle("🤖 Bot Commands")
            .setDescription(`Page **${page}** of **${totalPages}**`)
            .addFields(
                commands.slice(start, end).map((cmd) => ({
                    name: `\`${prefix}${cmd.command}\``,
                    value: `${cmd.description}`,
                }))
            )
            .setFooter({
                text: `Use the arrows below to navigate pages.`,
            })
            .setTimestamp();

        return embed;
    };

    let currentPage = 1;

    // Generate the initial embed
    const embed = generateEmbed(currentPage);

    // Create buttons
    const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('previous')
            .setLabel('⬅️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === 1), // Disable if on the first page
        new ButtonBuilder()
            .setCustomId('next')
            .setLabel('➡️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === totalPages) // Disable if on the last page
    );

    const helpMessage = await message.reply({ embeds: [embed], components: [buttons] });

    // Create a message collector to handle button interactions
    const collector = helpMessage.createMessageComponentCollector({
        filter: (interaction) => interaction.user.id === message.author.id,
        time: 60000, // Collector runs for 60 seconds
    });

    collector.on('collect', async (interaction) => {
        if (interaction.customId === 'previous') {
            currentPage = Math.max(currentPage - 1, 1); // Decrease page, but not below 1
        } else if (interaction.customId === 'next') {
            currentPage = Math.min(currentPage + 1, totalPages); // Increase page, but not above total pages
        }

        // Update the embed and buttons
        const updatedEmbed = generateEmbed(currentPage);
        const updatedButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('previous')
                .setLabel('⬅️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === 1),
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('➡️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === totalPages)
        );

        await interaction.update({ embeds: [updatedEmbed], components: [updatedButtons] });
    });

    collector.on('end', () => {
        // Disable buttons when the collector stops
        const disabledButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('previous')
                .setLabel('⬅️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('➡️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true)
        );

        helpMessage.edit({ components: [disabledButtons] }).catch(console.error);
    });
};



// Listen to messages
client.on('messageCreate', handleCommand);

// Log in to Discord
client.login('TOKEN_HERE');  // replace this with your own developer portal bot TOKEN




// Made by cleanverse
// Date Started on Project: Dec 23th
// Date Stopped on Project: Dec 27th

// I Will Add More Features to This Project in The Future and Fix Some Features That Dont Work The Best, but that wont be for a bit.