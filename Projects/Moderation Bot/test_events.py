import discord
from discord.ext import commands
import json

# Quick test to see if on_message works
intents = discord.Intents.default()
intents.message_content = True
intents.members = True
intents.guilds = True

bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print(f'Bot logged in as {bot.user}')
    print(f'Intents: {bot.intents}')
    print(f'Message content enabled: {bot.intents.message_content}')

@bot.event
async def on_message(message):
    print(f'MESSAGE RECEIVED: {message.content}')
    if message.author.bot:
        return
    print(f'Processing message from {message.author}: {message.content}')
    await bot.process_commands(message)

with open('config.json', 'r') as f:
    config = json.load(f)

bot.run(config['token'])
