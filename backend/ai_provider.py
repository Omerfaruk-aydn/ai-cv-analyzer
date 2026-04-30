import json
import re

class AIProvider:
    def __init__(self, provider: str, api_key: str):
        self.provider = provider.lower()
        self.api_key = api_key
        if not self.api_key:
            raise ValueError(f"API key for provider '{self.provider}' is missing.")
        self.client = self._init_client()

    def _init_client(self):
        if self.provider == "openai":
            from openai import OpenAI
            return OpenAI(api_key=self.api_key)
        elif self.provider == "anthropic":
            import anthropic
            return anthropic.Anthropic(api_key=self.api_key)
        elif self.provider == "google":
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)
            return genai
        elif self.provider == "groq":
            from groq import Groq
            return Groq(api_key=self.api_key)
        elif self.provider == "mistral":
            from mistralai import Mistral
            return Mistral(api_key=self.api_key)
        else:
            raise ValueError(f"Unsupported AI provider: {self.provider}")

    def complete(self, system: str, user: str) -> str:
        system_prompt = system + "\n\nCRITICAL: You must return ONLY a valid JSON object. Do not include markdown formatting like ```json or any other text. Return strictly the raw JSON object."
        
        try:
            if self.provider == "openai":
                response = self.client.chat.completions.create(
                    model="gpt-4o",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user}
                    ],
                    response_format={"type": "json_object"}
                )
                raw_text = response.choices[0].message.content
                
            elif self.provider == "anthropic":
                response = self.client.messages.create(
                    model="claude-sonnet-4-20250514",
                    max_tokens=4096,
                    system=system_prompt,
                    messages=[
                        {"role": "user", "content": user}
                    ]
                )
                raw_text = response.content[0].text
                
            elif self.provider == "google":
                model = self.client.GenerativeModel("gemini-1.5-pro", generation_config={"response_mime_type": "application/json"})
                prompt = f"{system_prompt}\n\nUser request:\n{user}"
                response = model.generate_content(prompt)
                raw_text = response.text
                
            elif self.provider == "groq":
                response = self.client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user}
                    ],
                    response_format={"type": "json_object"}
                )
                raw_text = response.choices[0].message.content
                
            elif self.provider == "mistral":
                response = self.client.chat.complete(
                    model="mistral-large-latest",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user}
                    ],
                    response_format={"type": "json_object"}
                )
                raw_text = response.choices[0].message.content
            else:
                raise Exception("Provider completion not implemented.")

            # Sanitize the output just in case models return markdown json blocks
            raw_text = raw_text.strip()
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
                
            return raw_text.strip()
            
        except Exception as e:
            raise Exception(f"AI Provider error ({self.provider}): {str(e)}")
