import discord
from discord.ext import commands
from discord import app_commands
from datetime import timedelta
from utils.embeds import success_embed, error_embed, log_embed

class Moderation(commands.Cog):
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
    
    @app_commands.command(name="kick", description="Kick a member from the server")
    @app_commands.describe(member="The member to kick", reason="Reason for kicking")
    @has_mod_perms()
    async def kick(self, interaction: discord.Interaction, member: discord.Member, reason: str = "No reason provided"):
        if member.top_role >= interaction.user.top_role:
            return await interaction.response.send_message(
                embed=error_embed("You cannot kick someone with a higher or equal role!"),
                ephemeral=True
            )
        
        try:
            await member.kick(reason=f"{reason} | Kicked by {interaction.user}")
            
            await interaction.response.send_message(
                embed=success_embed(f"Successfully kicked {member.mention}\nReason: {reason}")
            )
            
            # Log the action
            log_channel = self.bot.get_channel(int(self.bot.config.get('log_channel_id', 0)))
            if log_channel:
                await log_channel.send(embed=log_embed("Member Kicked", interaction.user, member, reason))
            
        except discord.Forbidden:
            await interaction.response.send_message(
                embed=error_embed("I don't have permission to kick this member!"),
                ephemeral=True
            )
        except Exception as e:
            await interaction.response.send_message(
                embed=error_embed(f"An error occurred: {str(e)}"),
                ephemeral=True
            )
    
    @app_commands.command(name="ban", description="Ban a member from the server")
    @app_commands.describe(member="The member to ban", reason="Reason for banning", delete_days="Days of messages to delete (0-7)")
    @has_mod_perms()
    async def ban(self, interaction: discord.Interaction, member: discord.Member, reason: str = "No reason provided", delete_days: int = 0):
        if member.top_role >= interaction.user.top_role:
            return await interaction.response.send_message(
                embed=error_embed("You cannot ban someone with a higher or equal role!"),
                ephemeral=True
            )
        
        if delete_days < 0 or delete_days > 7:
            return await interaction.response.send_message(
                embed=error_embed("Delete days must be between 0 and 7!"),
                ephemeral=True
            )
        
        try:
            await member.ban(reason=f"{reason} | Banned by {interaction.user}", delete_message_days=delete_days)
            
            await interaction.response.send_message(
                embed=success_embed(f"Successfully banned {member.mention}\nReason: {reason}")
            )
            
            log_channel = self.bot.get_channel(int(self.bot.config.get('log_channel_id', 0)))
            if log_channel:
                await log_channel.send(embed=log_embed("Member Banned", interaction.user, member, reason))
            
        except discord.Forbidden:
            await interaction.response.send_message(
                embed=error_embed("I don't have permission to ban this member!"),
                ephemeral=True
            )
        except Exception as e:
            await interaction.response.send_message(
                embed=error_embed(f"An error occurred: {str(e)}"),
                ephemeral=True
            )
    
    @app_commands.command(name="unban", description="Unban a user from the server")
    @app_commands.describe(user_id="The ID of the user to unban", reason="Reason for unbanning")
    @has_mod_perms()
    async def unban(self, interaction: discord.Interaction, user_id: str, reason: str = "No reason provided"):
        try:
            user = await self.bot.fetch_user(int(user_id))
            await interaction.guild.unban(user, reason=f"{reason} | Unbanned by {interaction.user}")
            
            await interaction.response.send_message(
                embed=success_embed(f"Successfully unbanned {user.mention}\nReason: {reason}")
            )
            
            log_channel = self.bot.get_channel(int(self.bot.config.get('log_channel_id', 0)))
            if log_channel:
                await log_channel.send(embed=log_embed("Member Unbanned", interaction.user, user, reason))
            
        except discord.NotFound:
            await interaction.response.send_message(
                embed=error_embed("User not found or not banned!"),
                ephemeral=True
            )
        except Exception as e:
            await interaction.response.send_message(
                embed=error_embed(f"An error occurred: {str(e)}"),
                ephemeral=True
            )
    
    @app_commands.command(name="timeout", description="Timeout a member")
    @app_commands.describe(member="The member to timeout", duration="Duration in minutes", reason="Reason for timeout")
    @has_mod_perms()
    async def timeout(self, interaction: discord.Interaction, member: discord.Member, duration: int, reason: str = "No reason provided"):
        if member.top_role >= interaction.user.top_role:
            return await interaction.response.send_message(
                embed=error_embed("You cannot timeout someone with a higher or equal role!"),
                ephemeral=True
            )
        
        if duration < 1 or duration > 40320:  # Max 28 days
            return await interaction.response.send_message(
                embed=error_embed("Duration must be between 1 minute and 28 days!"),
                ephemeral=True
            )
        
        try:
            await member.timeout(timedelta(minutes=duration), reason=f"{reason} | Timed out by {interaction.user}")
            
            await interaction.response.send_message(
                embed=success_embed(f"Successfully timed out {member.mention} for {duration} minutes\nReason: {reason}")
            )
            
            log_channel = self.bot.get_channel(int(self.bot.config.get('log_channel_id', 0)))
            if log_channel:
                await log_channel.send(embed=log_embed(f"Member Timed Out ({duration}m)", interaction.user, member, reason))
            
        except discord.Forbidden:
            await interaction.response.send_message(
                embed=error_embed("I don't have permission to timeout this member!"),
                ephemeral=True
            )
        except Exception as e:
            await interaction.response.send_message(
                embed=error_embed(f"An error occurred: {str(e)}"),
                ephemeral=True
            )
    
    @app_commands.command(name="untimeout", description="Remove timeout from a member")
    @app_commands.describe(member="The member to remove timeout from")
    @has_mod_perms()
    async def untimeout(self, interaction: discord.Interaction, member: discord.Member):
        try:
            await member.timeout(None, reason=f"Timeout removed by {interaction.user}")
            
            await interaction.response.send_message(
                embed=success_embed(f"Successfully removed timeout from {member.mention}")
            )
            
            log_channel = self.bot.get_channel(int(self.bot.config.get('log_channel_id', 0)))
            if log_channel:
                await log_channel.send(embed=log_embed("Timeout Removed", interaction.user, member))
            
        except Exception as e:
            await interaction.response.send_message(
                embed=error_embed(f"An error occurred: {str(e)}"),
                ephemeral=True
            )
    
    @app_commands.command(name="purge", description="Delete multiple messages")
    @app_commands.describe(amount="Number of messages to delete (1-100)")
    @has_mod_perms()
    async def purge(self, interaction: discord.Interaction, amount: int):
        if amount < 1 or amount > 100:
            return await interaction.response.send_message(
                embed=error_embed("Amount must be between 1 and 100!"),
                ephemeral=True
            )
        
        try:
            await interaction.response.defer(ephemeral=True)
            deleted = await interaction.channel.purge(limit=amount)
            
            await interaction.followup.send(
                embed=success_embed(f"Successfully deleted {len(deleted)} messages"),
                ephemeral=True
            )
            
            log_channel = self.bot.get_channel(int(self.bot.config.get('log_channel_id', 0)))
            if log_channel:
                embed = log_embed("Messages Purged", interaction.user, interaction.channel)
                embed.add_field(name="Amount", value=str(len(deleted)), inline=False)
                await log_channel.send(embed=embed)
            
        except discord.Forbidden:
            await interaction.followup.send(
                embed=error_embed("I don't have permission to delete messages!"),
                ephemeral=True
            )
        except Exception as e:
            await interaction.followup.send(
                embed=error_embed(f"An error occurred: {str(e)}"),
                ephemeral=True
            )

async def setup(bot):
    await bot.add_cog(Moderation(bot))
