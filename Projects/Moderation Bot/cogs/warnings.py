import discord
from discord.ext import commands
from discord import app_commands
from utils.embeds import success_embed, error_embed, info_embed, log_embed

class Warnings(commands.Cog):
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
    
    @app_commands.command(name="warn", description="Warn a member")
    @app_commands.describe(member="The member to warn", reason="Reason for warning")
    @has_mod_perms()
    async def warn(self, interaction: discord.Interaction, member: discord.Member, reason: str):
        if member.bot:
            return await interaction.response.send_message(
                embed=error_embed("You cannot warn bots!"),
                ephemeral=True
            )
        
        warning_count = self.bot.db.add_warning(
            interaction.guild.id,
            member.id,
            reason,
            interaction.user.id
        )
        
        await interaction.response.send_message(
            embed=success_embed(f"Warned {member.mention}\nReason: {reason}\nTotal warnings: {warning_count}")
        )
        
        # DM the user
        try:
            dm_embed = discord.Embed(
                title="You have been warned",
                description=f"**Server:** {interaction.guild.name}\n**Reason:** {reason}\n**Total warnings:** {warning_count}",
                color=0xFFA500
            )
            await member.send(embed=dm_embed)
        except:
            pass  # User has DMs disabled
        
        # Log the warning
        log_channel = self.bot.get_channel(int(self.bot.config.get('log_channel_id', 0)))
        if log_channel:
            embed = log_embed("Member Warned", interaction.user, member, reason)
            embed.add_field(name="Total Warnings", value=str(warning_count), inline=False)
            await log_channel.send(embed=embed)
        
        # Auto-action based on warning count
        max_warnings = self.bot.config.get('max_warnings', 3)
        if warning_count >= max_warnings:
            try:
                await member.kick(reason=f"Reached {max_warnings} warnings")
                await interaction.channel.send(
                    embed=info_embed(f"{member.mention} has been kicked for reaching {max_warnings} warnings")
                )
            except:
                pass
    
    @app_commands.command(name="warnings", description="Check warnings for a member")
    @app_commands.describe(member="The member to check warnings for")
    async def warnings(self, interaction: discord.Interaction, member: discord.Member = None):
        if member is None:
            member = interaction.user
        
        warnings = self.bot.db.get_warnings(interaction.guild.id, member.id)
        
        if not warnings:
            return await interaction.response.send_message(
                embed=info_embed(f"{member.mention} has no warnings"),
                ephemeral=True
            )
        
        embed = discord.Embed(
            title=f"Warnings for {member.display_name}",
            color=0xFFA500
        )
        
        for idx, warning in enumerate(warnings, 1):
            moderator = await self.bot.fetch_user(warning['moderator'])
            embed.add_field(
                name=f"Warning #{idx}",
                value=f"**Reason:** {warning['reason']}\n**Moderator:** {moderator.mention}\n**Date:** {warning['timestamp'][:10]}",
                inline=False
            )
        
        embed.set_footer(text=f"Total warnings: {len(warnings)}")
        
        await interaction.response.send_message(embed=embed, ephemeral=True)
    
    @app_commands.command(name="clearwarnings", description="Clear all warnings for a member")
    @app_commands.describe(member="The member to clear warnings for")
    @has_mod_perms()
    async def clearwarnings(self, interaction: discord.Interaction, member: discord.Member):
        success = self.bot.db.clear_warnings(interaction.guild.id, member.id)
        
        if success:
            await interaction.response.send_message(
                embed=success_embed(f"Cleared all warnings for {member.mention}")
            )
            
            log_channel = self.bot.get_channel(int(self.bot.config.get('log_channel_id', 0)))
            if log_channel:
                await log_channel.send(embed=log_embed("Warnings Cleared", interaction.user, member))
        else:
            await interaction.response.send_message(
                embed=error_embed(f"{member.mention} has no warnings to clear"),
                ephemeral=True
            )

async def setup(bot):
    await bot.add_cog(Warnings(bot))
