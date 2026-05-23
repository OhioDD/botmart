import discord
from discord.ext import commands
from discord import app_commands
from utils.embeds import success_embed, error_embed, info_embed

class Admin(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    
    def has_admin_perms():
        async def predicate(interaction: discord.Interaction):
            return interaction.user.guild_permissions.administrator
        return app_commands.check(predicate)
    
    @app_commands.command(name="testai", description="Test AI content filter")
    @app_commands.describe(text="Text to check with AI")
    @has_admin_perms()
    async def testai(self, interaction: discord.Interaction, text: str):
        await interaction.response.defer(ephemeral=True)
        
        # Get AI filter from automod cog
        automod = self.bot.get_cog('AutoMod')
        if not automod or not automod.ai_filter:
            return await interaction.followup.send(
                embed=error_embed("AI filter not initialized. Check your API key in config.json"),
                ephemeral=True
            )
        
        try:
            is_safe, reason, confidence = await automod.ai_filter.check_content(text)
            
            embed = discord.Embed(
                title="AI Filter Test Result",
                color=0x00FF00 if is_safe else 0xFF0000
            )
            embed.add_field(name="Safe", value="Yes" if is_safe else "No", inline=True)
            embed.add_field(name="Confidence", value=confidence.upper(), inline=True)
            embed.add_field(name="Reason", value=reason, inline=False)
            embed.add_field(name="Tested Text", value=text[:200], inline=False)
            
            await interaction.followup.send(embed=embed, ephemeral=True)
            
        except Exception as e:
            await interaction.followup.send(
                embed=error_embed(f"AI test failed: {str(e)}"),
                ephemeral=True
            )
    
    @app_commands.command(name="botstats", description="Show bot statistics")
    async def botstats(self, interaction: discord.Interaction):
        embed = discord.Embed(
            title="Bot Statistics",
            color=0x3498DB
        )
        
        embed.add_field(name="Servers", value=str(len(self.bot.guilds)), inline=True)
        embed.add_field(name="Users", value=str(len(self.bot.users)), inline=True)
        embed.add_field(name="Latency", value=f"{round(self.bot.latency * 1000)}ms", inline=True)
        
        # Check AI status
        automod = self.bot.get_cog('AutoMod')
        ai_status = "Enabled" if (automod and automod.ai_filter) else "Disabled"
        embed.add_field(name="AI Filter", value=ai_status, inline=True)
        
        # Get provider info
        if automod and automod.ai_filter:
            provider = self.bot.config.get('ai_provider', 'unknown')
            embed.add_field(name="AI Provider", value=provider.upper(), inline=True)
        
        await interaction.response.send_message(embed=embed, ephemeral=True)

async def setup(bot):
    await bot.add_cog(Admin(bot))
