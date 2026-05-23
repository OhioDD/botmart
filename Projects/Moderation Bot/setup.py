import json
import os

def setup_bot():
    print("=" * 50)
    print("Discord Moderation Bot Setup")
    print("=" * 50)
    print()
    
    # Check if config already exists
    if os.path.exists('config.json'):
        overwrite = input("Config file already exists. Overwrite? (y/n): ").lower()
        if overwrite != 'y':
            print("Setup cancelled.")
            return
    
    config = {}
    
    print("Enter your bot token:")
    config['token'] = input("> ").strip()
    
    print("\nChoose AI provider (gemini/openai/anthropic/cohere):")
    provider = input("> ").strip().lower()
    config['ai_provider'] = provider if provider else "gemini"
    
    print(f"\nEnter your {config['ai_provider'].upper()} API key (for AI moderation):")
    config['ai_api_key'] = input("> ").strip()
    
    print("\nEnter your log channel ID:")
    config['log_channel_id'] = input("> ").strip()
    
    print("\nEnter your admin role ID (optional, press Enter to skip):")
    admin_role = input("> ").strip()
    config['admin_role_id'] = admin_role if admin_role else ""
    
    print("\nEnter your moderator role ID (optional, press Enter to skip):")
    mod_role = input("> ").strip()
    config['mod_role_id'] = mod_role if mod_role else ""
    
    print("\nEnter command prefix (default: !):")
    prefix = input("> ").strip()
    config['prefix'] = prefix if prefix else "!"
    
    # Default settings
    config['max_warnings'] = 3
    config['spam_threshold'] = 5
    config['spam_interval'] = 5
    config['raid_threshold'] = 10
    config['raid_interval'] = 10
    config['embed_color'] = 0x2F3136
    
    # Save config
    with open('config.json', 'w') as f:
        json.dump(config, f, indent=4)
    
    # Create necessary directories
    os.makedirs('data', exist_ok=True)
    os.makedirs('logs', exist_ok=True)
    
    print("\n" + "=" * 50)
    print("Setup complete!")
    print("=" * 50)
    print("\nNext steps:")
    print("1. Install dependencies: pip install -r requirements.txt")
    print("2. Run the bot: python main.py")
    print("\nMake sure your bot has the following permissions:")
    print("- Manage Messages")
    print("- Kick Members")
    print("- Ban Members")
    print("- Moderate Members (for timeouts)")
    print("- View Channels")
    print("- Send Messages")
    print("- Embed Links")

if __name__ == "__main__":
    setup_bot()
