import json
import os
from datetime import datetime

class Database:
    def __init__(self):
        self.data_dir = 'data'
        self.warnings_file = f'{self.data_dir}/warnings.json'
        self.filters_file = f'{self.data_dir}/filters.json'
        self.settings_file = f'{self.data_dir}/settings.json'
        
        self._ensure_files()
    
    def _ensure_files(self):
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)
        
        files = [self.warnings_file, self.filters_file, self.settings_file]
        for file in files:
            if not os.path.exists(file):
                with open(file, 'w') as f:
                    json.dump({}, f)
    
    def _read_file(self, filepath):
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except:
            return {}
    
    def _write_file(self, filepath, data):
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=4)
    
    def add_warning(self, guild_id, user_id, reason, moderator_id):
        warnings = self._read_file(self.warnings_file)
        guild_key = str(guild_id)
        user_key = str(user_id)
        
        if guild_key not in warnings:
            warnings[guild_key] = {}
        
        if user_key not in warnings[guild_key]:
            warnings[guild_key][user_key] = []
        
        warning_data = {
            'reason': reason,
            'moderator': moderator_id,
            'timestamp': datetime.now().isoformat()
        }
        
        warnings[guild_key][user_key].append(warning_data)
        self._write_file(self.warnings_file, warnings)
        
        return len(warnings[guild_key][user_key])
    
    def get_warnings(self, guild_id, user_id):
        warnings = self._read_file(self.warnings_file)
        guild_key = str(guild_id)
        user_key = str(user_id)
        
        if guild_key in warnings and user_key in warnings[guild_key]:
            return warnings[guild_key][user_key]
        return []
    
    def clear_warnings(self, guild_id, user_id):
        warnings = self._read_file(self.warnings_file)
        guild_key = str(guild_id)
        user_key = str(user_id)
        
        if guild_key in warnings and user_key in warnings[guild_key]:
            del warnings[guild_key][user_key]
            self._write_file(self.warnings_file, warnings)
            return True
        return False
    
    def add_filter(self, guild_id, word):
        filters = self._read_file(self.filters_file)
        guild_key = str(guild_id)
        
        if guild_key not in filters:
            filters[guild_key] = []
        
        if word.lower() not in [w.lower() for w in filters[guild_key]]:
            filters[guild_key].append(word.lower())
            self._write_file(self.filters_file, filters)
            return True
        return False
    
    def remove_filter(self, guild_id, word):
        filters = self._read_file(self.filters_file)
        guild_key = str(guild_id)
        
        if guild_key in filters:
            try:
                filters[guild_key] = [w for w in filters[guild_key] if w.lower() != word.lower()]
                self._write_file(self.filters_file, filters)
                return True
            except:
                pass
        return False
    
    def get_filters(self, guild_id):
        filters = self._read_file(self.filters_file)
        guild_key = str(guild_id)
        return filters.get(guild_key, [])
