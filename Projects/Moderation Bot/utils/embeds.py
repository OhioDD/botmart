import discord
from datetime import datetime

def create_embed(title, description, color=0x2F3136):
    embed = discord.Embed(
        title=title,
        description=description,
        color=color,
        timestamp=datetime.now()
    )
    return embed

def success_embed(description):
    return create_embed("Success", description, 0x00FF00)

def error_embed(description):
    return create_embed("Error", description, 0xFF0000)

def warning_embed(description):
    return create_embed("Warning", description, 0xFFA500)

def info_embed(description):
    return create_embed("Info", description, 0x3498DB)

def log_embed(action, moderator, target, reason=None):
    embed = discord.Embed(
        title=f"{action}",
        color=0xFF6B6B,
        timestamp=datetime.now()
    )
    
    embed.add_field(name="Moderator", value=f"{moderator.mention}", inline=True)
    embed.add_field(name="Target", value=f"{target.mention if hasattr(target, 'mention') else target}", inline=True)
    
    if reason:
        embed.add_field(name="Reason", value=reason, inline=False)
    
    embed.set_footer(text=f"ID: {target.id if hasattr(target, 'id') else 'N/A'}")
    
    return embed
