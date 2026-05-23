import discord
from discord.ext import commands
from utils.embeds import log_embed

class Logging(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    
    def get_log_channel(self, guild):
        channel_id = self.bot.config.get('log_channel_id')
        if channel_id:
            return guild.get_channel(int(channel_id))
        return None
    
    @commands.Cog.listener()
    async def on_message_delete(self, message):
        if message.author.bot or not message.guild:
            return
        
        log_channel = self.get_log_channel(message.guild)
        if not log_channel:
            return
        
        embed = discord.Embed(
            title="Message Deleted",
            color=0xFF6B6B
        )
        embed.add_field(name="Author", value=message.author.mention, inline=True)
        embed.add_field(name="Channel", value=message.channel.mention, inline=True)
        embed.add_field(name="Content", value=message.content[:1024] if message.content else "*No content*", inline=False)
        
        if message.attachments:
            embed.add_field(name="Attachments", value=f"{len(message.attachments)} file(s)", inline=False)
        
        await log_channel.send(embed=embed)
    
    @commands.Cog.listener()
    async def on_message_edit(self, before, after):
        if before.author.bot or not before.guild or before.content == after.content:
            return
        
        log_channel = self.get_log_channel(before.guild)
        if not log_channel:
            return
        
        embed = discord.Embed(
            title="Message Edited",
            color=0xFFA500
        )
        embed.add_field(name="Author", value=before.author.mention, inline=True)
        embed.add_field(name="Channel", value=before.channel.mention, inline=True)
        embed.add_field(name="Before", value=before.content[:512] if before.content else "*No content*", inline=False)
        embed.add_field(name="After", value=after.content[:512] if after.content else "*No content*", inline=False)
        embed.add_field(name="Jump", value=f"[Go to message]({after.jump_url})", inline=False)
        
        await log_channel.send(embed=embed)
    
    @commands.Cog.listener()
    async def on_member_join(self, member):
        log_channel = self.get_log_channel(member.guild)
        if not log_channel:
            return
        
        embed = discord.Embed(
            title="Member Joined",
            description=f"{member.mention} joined the server",
            color=0x00FF00
        )
        embed.add_field(name="Account Created", value=f"<t:{int(member.created_at.timestamp())}:R>", inline=True)
        embed.set_thumbnail(url=member.display_avatar.url)
        embed.set_footer(text=f"ID: {member.id}")
        
        await log_channel.send(embed=embed)
    
    @commands.Cog.listener()
    async def on_member_remove(self, member):
        log_channel = self.get_log_channel(member.guild)
        if not log_channel:
            return
        
        embed = discord.Embed(
            title="Member Left",
            description=f"{member.mention} left the server",
            color=0xFF0000
        )
        embed.add_field(name="Joined", value=f"<t:{int(member.joined_at.timestamp())}:R>" if member.joined_at else "Unknown", inline=True)
        embed.set_thumbnail(url=member.display_avatar.url)
        embed.set_footer(text=f"ID: {member.id}")
        
        await log_channel.send(embed=embed)
    
    @commands.Cog.listener()
    async def on_member_ban(self, guild, user):
        log_channel = self.get_log_channel(guild)
        if not log_channel:
            return
        
        embed = discord.Embed(
            title="Member Banned",
            description=f"{user.mention} was banned",
            color=0xFF0000
        )
        embed.set_thumbnail(url=user.display_avatar.url)
        embed.set_footer(text=f"ID: {user.id}")
        
        await log_channel.send(embed=embed)
    
    @commands.Cog.listener()
    async def on_member_unban(self, guild, user):
        log_channel = self.get_log_channel(guild)
        if not log_channel:
            return
        
        embed = discord.Embed(
            title="Member Unbanned",
            description=f"{user.mention} was unbanned",
            color=0x00FF00
        )
        embed.set_thumbnail(url=user.display_avatar.url)
        embed.set_footer(text=f"ID: {user.id}")
        
        await log_channel.send(embed=embed)

async def setup(bot):
    await bot.add_cog(Logging(bot))
