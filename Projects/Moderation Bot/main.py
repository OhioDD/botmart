import discord
from discord.ext import commands
import json
import asyncio
import os
from datetime import datetime

from utils.logger import setup_logger
from utils.database import Database

class ModerationBot(commands.Bot):
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        intents.members = True
        intents.guilds = True
        
        super().__init__(
            command_prefix=self.get_prefix,
            intents=intents,
            help_command=None
        )
        
        self.config = self.load_config()
        self.db = Database()
        self.logger = setup_logger()
        self.spam_tracker = {}
        self.raid_tracker = {}
        
    def load_config(self):
        try:
            with open('config.json', 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            self.logger.error("Config file not found!")
            raise
    
    async def get_prefix(self, message):
        return self.config.get('prefix', '!')
    
    async def setup_hook(self):
        # Load all cogs
        cogs_to_load = [
            'cogs.moderation',
            'cogs.automod',
            'cogs.logging',
            'cogs.warnings',
            'cogs.filters',
            'cogs.admin'
        ]
        
        for cog in cogs_to_load:
            try:
                await self.load_extension(cog)
                self.logger.info(f"Loaded {cog}")
            except Exception as e:
                self.logger.error(f"Failed to load {cog}: {e}")
    
    async def on_ready(self):
        self.logger.info(f"Bot is ready! Logged in as {self.user}")
        self.logger.info(f"Connected to {len(self.guilds)} guilds")
        self.logger.info(f"Message Content Intent: {self.intents.message_content}")
        
        # Sync slash commands
        try:
            synced = await self.tree.sync()
            self.logger.info(f"Synced {len(synced)} commands")
        except Exception as e:
            self.logger.error(f"Failed to sync commands: {e}")
        
        await self.change_presence(
            activity=discord.Activity(
                type=discord.ActivityType.watching,
                name="for rule breakers"
            )
        )
    
    async def on_message(self, message):
        """Process messages - call automod manually"""
        if message.author.bot or not message.guild:
            await self.process_commands(message)
            return
        
        # Get automod cog and run checks
        automod = self.get_cog('AutoMod')
        if automod:
            await automod.check_message(message)
        
        await self.process_commands(message)

if __name__ == "__main__":
    bot = ModerationBot()
    bot.run(bot.config['token'])
