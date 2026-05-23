import asyncio
from functools import partial
import aiohttp

class AIContentFilter:
    def __init__(self, api_key, provider="gemini"):
        self.api_key = api_key
        self.provider = provider.lower()
        
        # Initialize provider-specific settings
        if self.provider == "gemini":
            from google import genai
            self.client = genai.Client(api_key=api_key)
        elif self.provider == "openai":
            self.api_url = "https://api.openai.com/v1/chat/completions"
            self.model_name = "gpt-3.5-turbo"
        elif self.provider == "anthropic":
            self.api_url = "https://api.anthropic.com/v1/messages"
            self.model_name = "claude-3-haiku-20240307"
        elif self.provider == "cohere":
            self.api_url = "https://api.cohere.ai/v1/chat"
            self.model_name = "command"
        
    def get_moderation_prompt(self, text):
        return f"""Analyze this message for Discord server moderation. Check for:
- Hate speech or discrimination
- Harassment or bullying
- Sexual content
- Violence or threats
- Spam or scams
- Self-harm content

Message: "{text}"

Respond in this exact format:
SAFE: yes/no
REASON: brief explanation
CONFIDENCE: low/medium/high"""
    
    async def check_content(self, text):
        """
        Check if content violates community guidelines
        Returns: (is_safe, reason, confidence)
        """
        try:
            if self.provider == "gemini":
                return await self._check_gemini(text)
            elif self.provider == "openai":
                return await self._check_openai(text)
            elif self.provider == "anthropic":
                return await self._check_anthropic(text)
            elif self.provider == "cohere":
                return await self._check_cohere(text)
            else:
                return (True, "Unknown provider", "low")
        except Exception as e:
            # Default to safe on errors to avoid false positives
            return (True, f"AI check failed: {str(e)[:100]}", "low")
    
    async def _check_gemini(self, text):
        prompt = self.get_moderation_prompt(text)
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            partial(self.client.models.generate_content, model='gemini-2.5-flash', contents=prompt)
        )
        return self._parse_response(response.text)
    
    async def _check_openai(self, text):
        prompt = self.get_moderation_prompt(text)
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model_name,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.3
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(self.api_url, json=payload, headers=headers) as resp:
                data = await resp.json()
                content = data['choices'][0]['message']['content']
                return self._parse_response(content)
    
    async def _check_anthropic(self, text):
        prompt = self.get_moderation_prompt(text)
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model_name,
            "max_tokens": 256,
            "messages": [{"role": "user", "content": prompt}]
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(self.api_url, json=payload, headers=headers) as resp:
                data = await resp.json()
                content = data['content'][0]['text']
                return self._parse_response(content)
    
    async def _check_cohere(self, text):
        prompt = self.get_moderation_prompt(text)
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model_name,
            "message": prompt,
            "temperature": 0.3
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(self.api_url, json=payload, headers=headers) as resp:
                data = await resp.json()
                content = data['text']
                return self._parse_response(content)
    
    def _parse_response(self, response_text):
        """Parse AI response into structured format"""
        try:
            lines = response_text.strip().split('\n')
            
            is_safe = True
            reason = "No issues detected"
            confidence = "low"
            
            for line in lines:
                line = line.strip()
                if line.startswith('SAFE:'):
                    is_safe = 'yes' in line.lower()
                elif line.startswith('REASON:'):
                    reason = line.split(':', 1)[1].strip()
                elif line.startswith('CONFIDENCE:'):
                    confidence = line.split(':', 1)[1].strip().lower()
            
            return (is_safe, reason, confidence)
        except Exception as e:
            return (True, f"Parse error: {str(e)}", "low")
