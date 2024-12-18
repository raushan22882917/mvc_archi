from groq import Groq
from config import Config
from models.generator_model import MVCStructure
from diagram_generator import DiagramGenerator

class GeneratorService:
    def __init__(self):
        self.client = Groq(api_key=Config.GROQ_API_KEY)
        self.diagram_generator = DiagramGenerator()

    def generate_mvc_structure(self, prompt):
        try:
            enhanced_prompt = f"""
            Create a detailed MVC (Model-View-Controller) architecture for: "{prompt}"
            
            Format your response as follows:

            MODELS:
            [List all data models with their properties and methods]

            VIEWS:
            [List all views/templates with their components]

            CONTROLLERS:
            [List all controllers with their actions and business logic]
            """

            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert software architect. Generate detailed MVC architecture components."
                    },
                    {
                        "role": "user",
                        "content": enhanced_prompt
                    }
                ],
                model="mixtral-8x7b-32768",
                temperature=0.7,
                max_tokens=2000
            )

            generated_content = response.choices[0].message.content
            structured_response = self._process_generated_content(generated_content)
            
            # Generate diagram
            diagram_path = DiagramGenerator.save_diagram(structured_response['components'])
            structured_response['diagram_path'] = diagram_path
            
            return structured_response

        except Exception as e:
            print(f"Error details: {str(e)}")
            raise Exception(f"Error generating MVC structure: {str(e)}")

    def _process_generated_content(self, content):
        try:
            sections = {
                'models': '',
                'views': '',
                'controllers': ''
            }

            current_section = None
            lines = content.split('\n')
            current_content = []

            for line in lines:
                line = line.strip()
                
                if 'MODELS:' in line.upper():
                    current_section = 'models'
                    current_content = []
                elif 'VIEWS:' in line.upper():
                    if current_section:
                        sections[current_section] = '\n'.join(current_content)
                    current_section = 'views'
                    current_content = []
                elif 'CONTROLLERS:' in line.upper():
                    if current_section:
                        sections[current_section] = '\n'.join(current_content)
                    current_section = 'controllers'
                    current_content = []
                elif line and current_section:
                    current_content.append(line)

            if current_section and current_content:
                sections[current_section] = '\n'.join(current_content)

            components = {
                'models': self._extract_components(sections['models']),
                'views': self._extract_components(sections['views']),
                'controllers': self._extract_components(sections['controllers'])
            }

            return {
                'models': sections['models'],
                'views': sections['views'],
                'controllers': sections['controllers'],
                'components': components
            }

        except Exception as e:
            print(f"Processing error details: {str(e)}")
            raise Exception(f"Error processing content: {str(e)}")

    def _extract_components(self, content):
        if not content:
            return []
        
        components = []
        lines = content.split('\n')
        
        for line in lines:
            line = line.strip()
            if line and not line.startswith('-') and not line.startswith('*'):
                components.append(line.split(':')[0].strip())
        
        return components