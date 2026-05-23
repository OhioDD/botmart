DISCORD MODERATION BOT
======================

A professional moderation bot for Discord servers with AI-powered content filtering,
auto-moderation, and comprehensive logging features.

FEATURES
--------
- AI-powered content filtering using Google Gemini
- Automatic ban and kick systems
- Comprehensive logging of all server events
- Custom word filters
- Raid protection
- Anti-spam detection
- Role management
- Warning system with auto-actions
- Slash commands for easy use

INSTALLATION
------------
1. Make sure you have Python 3.8 or higher installed

2. Install required packages:
   pip install -r requirements.txt

3. Run the setup script:
   python setup.py

4. Follow the prompts to configure your bot

CONFIGURATION
-------------
The bot uses config.json for settings. You can manually edit this file to adjust:
- max_warnings: Number of warnings before auto-kick (default: 3)
- spam_threshold: Messages in interval before timeout (default: 5)
- spam_interval: Time window for spam detection in seconds (default: 5)
- raid_threshold: Joins in interval to trigger raid alert (default: 10)
- raid_interval: Time window for raid detection in seconds (default: 10)

COMMANDS
--------
Moderation:
  /kick <member> [reason] - Kick a member
  /ban <member> [reason] [delete_days] - Ban a member
  /unban <user_id> [reason] - Unban a user
  /timeout <member> <duration> [reason] - Timeout a member
  /untimeout <member> - Remove timeout
  /purge <amount> - Delete multiple messages

Warnings:
  /warn <member> <reason> - Warn a member
  /warnings [member] - Check warnings
  /clearwarnings <member> - Clear all warnings

Filters:
  /addfilter <word> - Add word to filter
  /removefilter <word> - Remove word from filter
  /listfilters - Show all filtered words

PERMISSIONS
-----------
The bot needs these permissions to work properly:
- Manage Messages
- Kick Members
- Ban Members
- Moderate Members
- View Channels
- Send Messages
- Embed Links

GETTING API KEYS
----------------
Gemini API Key:
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy it to your config.json

Discord Bot Token:
1. Go to https://discord.com/developers/applications
2. Create a new application
3. Go to Bot section and create a bot
4. Copy the token to your config.json

RUNNING THE BOT
---------------
After setup is complete, run:
  python main.py

The bot will log in and start monitoring your server.

SUPPORT
-------
For issues or questions, check the logs folder for error messages.
Make sure all IDs in config.json are correct and the bot has proper permissions.

PROJECT STRUCTURE
-----------------
main.py - Bot initialization and startup
cogs/ - Command modules
  - moderation.py - Kick, ban, timeout commands
  - automod.py - Spam detection, AI filtering
  - warnings.py - Warning system
  - filters.py - Word filter management
  - logging.py - Event logging
utils/ - Helper modules
  - database.py - Data storage
  - embeds.py - Embed templates
  - logger.py - Logging setup
  - ai_filter.py - AI content filtering
data/ - Stored data (warnings, filters)
logs/ - Bot logs

NOTES
-----
- The AI filter only acts on high-confidence violations to avoid false positives
- Spam detection automatically times out users for 5 minutes
- Raid detection sends alerts but doesn't auto-ban (manual review recommended)
- All moderation actions are logged to the configured log channel
- Users receive DMs when warned (if they have DMs enabled)
