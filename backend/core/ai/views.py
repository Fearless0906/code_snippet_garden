import requests
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.conf import settings
import google.generativeai as genai
import logging
import json
import re

logger = logging.getLogger(__name__)

def clean_json_string(text):
    """Clean and extract JSON from the response text."""
    # Try to find JSON-like content between curly braces
    json_match = re.search(r'\{.*\}', text, re.DOTALL)
    if json_match:
        json_str = json_match.group(0)
        # Remove any markdown code block markers
        json_str = re.sub(r'```json\s*|\s*```', '', json_str)
        return json_str
    return text

@api_view(['POST'])
def generate_snippet_metadata(request):
    snippet_code = request.data.get('code', '')

    if not snippet_code:
        return Response({'error': 'Code snippet is required'}, status=400)

    try:
        # Configure Gemini API
        genai.configure(api_key=settings.GEMINI_API_KEY)

        model = genai.GenerativeModel('gemini-2.5-flash')
        logger.info(f"Sending request to Gemini API with code length: {len(snippet_code)}")

        prompt = f'''Analyze the following code snippet and generate structured metadata.

Respond strictly in this JSON format, with no additional text or markdown:
{{
  "title": "<descriptive title that summarizes what the code does>",
  "description": "<what the code does in 1-2 sentences>",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "language": "<primary programming language>",
  "difficulty_level": "<beginner|intermediate|advanced>"
}}

Code snippet:
{snippet_code}
'''

        # Generate response
        generation_config = {
            "temperature": 0.3,
            "top_p": 1,
            "top_k": 1,
            "max_output_tokens": 400,
        }

        response = model.generate_content(
            prompt,
            generation_config=generation_config,
        )

        if not response or not response.text:
            logger.error("Gemini API returned empty response")
            return Response({'error': 'No metadata generated'}, status=400)

        # Log the raw response for debugging
        logger.info(f"Raw response from Gemini API: {response.text}")

        # Clean and parse the response
        cleaned_response = clean_json_string(response.text)
        logger.info(f"Cleaned response: {cleaned_response}")

        try:
            data = json.loads(cleaned_response)

            # Validate and sanitize the data
            required_fields = ['title', 'description', 'tags', 'language', 'difficulty_level']
            if not all(field in data for field in required_fields):
                missing_fields = [field for field in required_fields if field not in data]
                logger.error(f"Missing required fields: {missing_fields}")
                raise ValueError(f"Missing fields in generated data: {missing_fields}")

            # Ensure tags is a list
            if isinstance(data['tags'], str):
                data['tags'] = [tag.strip() for tag in data['tags'].split(',')]
            
            # Capitalize the language
            if data['language']:
                data['language'] = data['language'].capitalize()
            
            # Validate difficulty level
            valid_levels = ['beginner', 'intermediate', 'advanced']
            if data['difficulty_level'].lower() not in valid_levels:
                data['difficulty_level'] = 'intermediate'  # default fallback

            return Response(data, status=200)

        except json.JSONDecodeError as je:
            logger.error(f"JSON parsing error: {str(je)}\nResponse content: {cleaned_response}")
            return Response({
                'error': 'Invalid JSON in response',
                'detail': str(je)
            }, status=500)
        except Exception as parse_error:
            logger.error(f"Error parsing metadata: {str(parse_error)}")
            return Response({
                'error': 'Failed to parse metadata from response',
                'detail': str(parse_error)
            }, status=500)

    except Exception as e:
        logger.error(f"Gemini API Error: {str(e)}", exc_info=True)
        return Response({
            'error': 'Failed to generate snippet metadata',
            'detail': str(e)
        }, status=500)
    


@api_view(['POST'])
def generate_code_snippet(request):
    prompt_text = request.data.get('prompt', '')

    if not prompt_text:
        return Response({'error': 'Prompt is required'}, status=400)

    try:
        # Configure Gemini API
        genai.configure(api_key=settings.GEMINI_API_KEY)

        model = genai.GenerativeModel('gemini-2.5-flash')
        logger.info(f"Sending prompt to Gemini API: {prompt_text}")

        # Create the prompt to Gemini
        prompt = f"""
You are a coding assistant.

Generate a complete and clean code snippet based on the following user request:

"{prompt_text}"

Respond in this JSON format (no extra text, no markdown):
{{
  "title": "<short descriptive title>",
  "description": "<short description of what the code does>",
  "language": "<programming language>",
  "code": "<full clean code here>"
}}
"""

        generation_config = {
            "temperature": 0.3,
            "top_p": 1,
            "top_k": 1,
            "max_output_tokens": 800,
        }

        response = model.generate_content(
            prompt,
            generation_config=generation_config,
        )

        if not response or not response.text:
            logger.error("Gemini API returned empty response")
            return Response({'error': 'No code generated'}, status=400)

        # Clean and parse
        cleaned_response = clean_json_string(response.text)
        logger.info(f"Cleaned AI response: {cleaned_response}")

        try:
            data = json.loads(cleaned_response)

            # Basic validation
            required_fields = ['title', 'description', 'language', 'code']
            if not all(field in data for field in required_fields):
                missing = [field for field in required_fields if field not in data]
                raise ValueError(f"Missing fields: {missing}")

            return Response(data, status=200)

        except json.JSONDecodeError as je:
            logger.error(f"JSON decoding error: {str(je)}\nContent: {cleaned_response}")
            return Response({'error': 'Invalid JSON response'}, status=500)
        except Exception as e:
            logger.error(f"Parsing error: {str(e)}")
            return Response({'error': 'Failed to parse code snippet', 'detail': str(e)}, status=500)

    except Exception as e:
        logger.error(f"Gemini API Error: {str(e)}", exc_info=True)
        return Response({'error': 'Failed to generate code', 'detail': str(e)}, status=500)


