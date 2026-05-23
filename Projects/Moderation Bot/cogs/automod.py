import discord
from discord.ext import commands
from datetime import datetime, timedelta
from collections import defaultdict
from utils.embeds import warning_embed, log_embed
from utils.ai_filter import AIContentFilter

class AutoMod(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.spam_tracker = defaultdict(list)
        self.raid_tracker = []
        
        # Initialize AI filter if API key is provided
        api_key = bot.config.get('ai_api_key')
        provider = bot.config.get('ai_provider', 'gemini')
        self.ai_filter = AIContentFilter(api_key, provider) if api_key else None
    
    async def check_message(self, message):
        """Main message checking function called from bot"""
        # Check if user has mod permissions
        if message.author.guild_permissions.moderate_members:
            return
        
        self.bot.logger.info(f"AutoMod checking message from {message.author}: {message.content[:50]}")
        
        # Word filter check
        await self.check_word_filter(message)
        
        # Spam detection
        await self.check_spam(message)
        
        # AI content filtering (only if enabled and configured)
        if self.ai_filter and self.bot.config.get('ai_enabled', True):
            self.bot.logger.info(f"Running AI filter on message: {message.content[:50]}")
            await self.check_ai_filter(message)
        else:
            self.bot.logger.warning(f"AI filter not running - ai_filter: {bool(self.ai_filter)}, ai_enabled: {self.bot.config.get('ai_enabled', True)}")
    
    async def check_word_filter(self, message):
        filters = self.bot.db.get_filters(message.guild.id)
        
        self.bot.logger.info(f"Word filters for guild: {filters}")
        
        if not filters:
            return
        
        content_lower = message.content.lower()
        
        for word in filters:
            if word in content_lower:
                self.bot.logger.info(f"Found filtered word '{word}' in message")
                try:
                    await message.delete()
                    self.bot.logger.info(f"Deleted message with filtered word")
                    
                    warning = await message.channel.send(
                        embed=warning_embed(f"{message.author.mention}, your message contained a filtered word and was deleted")
                    )
                    
                    # Delete warning after 5 seconds
                    await warning.delete(delay=5)
                    
                    # Log the action
                    log_channel = self.bot.get_channel(int(self.bot.config.get('log_channel_id', 0)))
                    if log_channel:
                        embed = log_embed("Filtered Word Detected", self.bot.user, message.author)
                        embed.add_field(name="Channel", value=message.channel.mention, inline=True)
                        embed.add_field(name="Word", value=f"`{word}`", inline=True)
                        embed.add_field(name="Message", value=message.content[:100], inline=False)
                        await log_channel.send(embed=embed)
                    
                except discord.Forbidden:
                    self.bot.logger.warning(f"Missing permissions to delete message in {message.channel}")
                except Exception as e:
                    self.bot.logger.error(f"Error in word filter: {e}")
                
                break
    
    async def check_spam(self, message):
        user_id = message.author.id
        current_time = datetime.now()
        
        # Add message to tracker
        self.spam_tracker[user_id].append(current_time)
        
        # Remove old messages (older than spam_interval seconds)
        spam_interval = self.bot.config.get('spam_interval', 5)
        cutoff_time = current_time - timedelta(seconds=spam_interval)
        self.spam_tracker[user_id] = [
            msg_time for msg_time in self.spam_tracker[user_id]
            if msg_time > cutoff_time
        ]
        
        # Check if user exceeded spam threshold
        spam_threshold = self.bot.config.get('spam_threshold', 5)
        if len(self.spam_tracker[user_id]) >= spam_threshold:
            try:
                # Timeout the user for 5 minutes
                await message.author.timeout(
                    timedelta(minutes=5),
                    reason="Spam detected"
                )
                
                warning = await message.channel.send(
                    embed=warning_embed(f"{message.author.mention} has been timed out for spamming")
                )
                await warning.delete(delay=10)
                
                # Clear their spam tracker
                self.spam_tracker[user_id] = []
                
                # Log the action
                log_channel = self.bot.get_channel(int(self.bot.config.get('log_channel_id', 0)))
                if log_channel:
                    embed = log_embed("Spam Detected", self.bot.user, message.author, "Auto-timeout for 5 minutes")
                    embed.add_field(name="Channel", value=message.channel.mention, inline=True)
                    await log_channel.send(embed=embed)
                
            except discord.Forbidden:
                self.bot.logger.warning(f"Missing permissions to timeout {message.author}")
            except Exception as e:
                self.bot.logger.error(f"Error in spam detection: {e}")
    
    def should_check_with_ai(self, message):
        """Only use AI for suspicious messages to save API calls"""
        content = message.content.lower()
        
        # Skip very short messages
        if len(message.content) < 15:
            return False
        
        # Trigger words that indicate potential issues
        suspicious_keywords = [
            'kill', 'die', 'death', 'dead', 'hate', 'stupid', 'idiot', 'retard', 
            'fag', 'faggot', 'nigger', 'nigga', 'fuck', 'shit', 'bitch', 'ass', 
            'dick', 'cock', 'pussy', 'porn', 'sex', 'nude', 'naked', 'kys', 
            'suicide', 'hurt', 'attack', 'bomb', 'terrorist', 'rape', 'molest', 
            'abuse', 'scam', 'free money', 'click here', 'discord.gg', 'http', 
            'www.', 'bit.ly', 'tinyurl', 'gay', 'lesbian', 'tranny', 'whore',
            'slut', 'cunt', 'piss', 'damn', 'hell', 'bastard', 'dumb', 'loser'
        ]
        
        # Check for suspicious patterns
        has_suspicious = any(word in content for word in suspicious_keywords)
        has_caps = sum(1 for c in message.content if c.isupper()) > len(message.content) * 0.7
        has_mentions = len(message.mentions) > 3
        has_links = 'http' in content or 'www.' in content or 'discord.gg' in content
        has_repeated_chars = any(char * 5 in message.content for char in 'abcdefghijklmnopqrstuvwxyz')
        
        return has_suspicious or has_caps or has_mentions or has_links or has_repeated_chars
    
    async def check_ai_filter(self, message):
        # Only check messages that seem suspicious
        if not self.should_check_with_ai(message):
            self.bot.logger.info(f"Message not suspicious enough for AI check")
            return
        
        self.bot.logger.info(f"Message is suspicious, checking with AI")
        
        try:
            is_safe, reason, confidence = await self.ai_filter.check_content(message.content)
            
            self.bot.logger.info(f"AI result - Safe: {is_safe}, Confidence: {confidence}, Reason: {reason}")
            
            # Only act on high confidence violations
            if not is_safe and confidence == "high":
                self.bot.logger.info(f"Deleting message due to AI filter")
                try:
                    await message.delete()
                    
                    warning = await message.channel.send(
                        embed=warning_embed(f"{message.author.mention}, your message was flagged: {reason}")
                    )
                    await warning.delete(delay=10)
                    
                    # Log the action
                    log_channel = self.bot.get_channel(int(self.bot.config.get('log_channel_id', 0)))
                    if log_channel:
                        embed = log_embed("AI Filter Triggered", self.bot.user, message.author, reason)
                        embed.add_field(name="Channel", value=message.channel.mention, inline=True)
                        embed.add_field(name="Confidence", value=confidence, inline=True)
                        embed.add_field(name="Message", value=message.content[:200], inline=False)
                        await log_channel.send(embed=embed)
                    
                except discord.Forbidden:
                    self.bot.logger.warning(f"Missing permissions to delete message in {message.channel}")
                except Exception as e:
                    self.bot.logger.error(f"Error deleting flagged message: {e}")
        except Exception as e:
            self.bot.logger.error(f"AI filter error: {e}")
    
    @commands.Cog.listener()
    async def on_member_join(self, member):
        # Raid protection
        current_time = datetime.now()
        self.raid_tracker.append(current_time)
        
        # Remove old joins
        raid_interval = self.bot.config.get('raid_interval', 10)
        cutoff_time = current_time - timedelta(seconds=raid_interval)
        self.raid_tracker = [
            join_time for join_time in self.raid_tracker
            if join_time > cutoff_time
        ]
        
        # Check for raid
        raid_threshold = self.bot.config.get('raid_threshold', 10)
        if len(self.raid_tracker) >= raid_threshold:
            log_channel = self.bot.get_channel(int(self.bot.config.get('log_channel_id', 0)))
            if log_channel:
                embed = discord.Embed(
                    title="RAID DETECTED",
                    description=f"**{len(self.raid_tracker)} members** joined in the last {raid_interval} seconds",
                    color=0xFF0000
                )
                embed.add_field(
                    name="Recommendation",
                    value="Consider enabling verification or locking down the server",
                    inline=False
                )
                await log_channel.send(embed=embed)

async def setup(bot):
    await bot.add_cog(AutoMod(bot))
