const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const axios = require('axios');
const express = require('express');

const app = express();
app.use(express.json());

const token = process.env.DISCORD_TOKEN;
const guildId = '1091808508497899612';
const channelId = '1091808509571629101';
const ttsUrl = 'http://coqui-tts-svc.default.svc.cluster.local/api/tts';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

let connection;
const player = createAudioPlayer();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  connection = joinVoiceChannel({
    channelId: channelId,
    guildId: guildId,
    adapterCreator: client.guilds.cache.get(guildId).voiceAdapterCreator,
  });
  connection.subscribe(player);
});

app.post('/speak', async (req, res) => {
  const { text } = req.body;
  try {
    const response = await axios.get(ttsUrl, {
      params: { text: text, speaker_id: 'Rebecca', style_id: '' },
      responseType: 'arraybuffer'
    });

    const resource = createAudioResource(Buffer.from(response.data));
    player.play(resource);
    res.send({ status: 'speaking' });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

client.login(token);
app.listen(8080, () => console.log('Voice Box listening on 8080'));
