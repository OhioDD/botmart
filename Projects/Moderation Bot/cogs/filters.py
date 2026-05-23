import discord
from discord.ext import commands
from discord import app_commands
from utils.embeds import success_embed, error_embed, info_embed

class Filters(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    
    def has_mod_perms():
        async def predicate(interaction: discord.Interaction):
            if interaction.user.guild_permissions.moderate_members:
                return True
            
            mod_role_id = interaction.client.config.get('mod_role_id')
            admin_role_id = interaction.client.config.get('admin_role_id')
            
            user_roles = [role.id for role in interaction.user.roles]
            return mod_role_id in user_roles or admin_role_id in user_roles
        
        return app_commands.check(predicate)
    
    @app_commands.command(name="addfilter", description="Add a word to the filter list")
    @app_commands.describe(word="The word to filter")
    @has_mod_perms()
    async def addfilter(self, interaction: discord.Interaction, word: str):
        success = self.bot.db.add_filter(interaction.guild.id, word)
        
        if success:
            await interaction.response.send_message(
                embed=success_embed(f"Added `{word}` to the filter list"),
                ephemeral=True
            )
        else:
            await interaction.response.send_message(
                embed=error_embed(f"`{word}` is already in the filter list"),
                ephemeral=True
            )
    
    @app_commands.command(name="removefilter", description="Remove a word from the filter list")
    @app_commands.describe(word="The word to remove")
    @has_mod_perms()
    async def removefilter(self, interaction: discord.Interaction, word: str):
        success = self.bot.db.remove_filter(interaction.guild.id, word)
        
        if success:
            await interaction.response.send_message(
                embed=success_embed(f"Removed `{word}` from the filter list"),
                ephemeral=True
            )
        else:
            await interaction.response.send_message(
                embed=error_embed(f"`{word}` is not in the filter list"),
                ephemeral=True
            )
    
    @app_commands.command(name="listfilters", description="List all filtered words")
    @has_mod_perms()
    async def listfilters(self, interaction: discord.Interaction):
        filters = self.bot.db.get_filters(interaction.guild.id)
        
        if not filters:
            return await interaction.response.send_message(
                embed=info_embed("No words are currently filtered"),
                ephemeral=True
            )
        
        embed = discord.Embed(
            title="Filtered Words",
            description="\n".join([f"• `{word}`" for word in filters]),
            color=0xFF6B6B
        )
        
        await interaction.response.send_message(embed=embed, ephemeral=True)

async def setup(bot):
    await bot.add_cog(Filters(bot))
