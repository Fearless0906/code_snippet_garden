from django.test import TestCase
from django.conf import settings
from openai import OpenAI

class OpenAITestCase(TestCase):
    def setUp(self):
        self.client = OpenAI(api_key=settings.OPEN_AI_KEY)

    def test_openai_connection(self):
        try:
            completion = self.client.completions.create(
                model="gpt-3.5-turbo-instruct",
                prompt="Say this is a test",
                max_tokens=7,
                temperature=0
            )
            result = completion.choices[0].text.strip()
            self.assertIsNotNone(result)
            print(f"OpenAI Response: {result}")
        except Exception as e:
            self.fail(f"OpenAI API test failed: {str(e)}")