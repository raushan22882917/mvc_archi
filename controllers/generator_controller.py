from flask import Blueprint, request, jsonify
from services.generator_service import GeneratorService

generator_bp = Blueprint('generator', __name__)
generator_service = GeneratorService()

@generator_bp.route('/api/generate', methods=['POST'])
def generate_mvc():
    try:
        data = request.get_json()
        if not data or 'prompt' not in data:
            return jsonify({'error': 'Prompt is required'}), 400
        
        prompt = data['prompt']
        result = generator_service.generate_mvc_structure(prompt)
        return jsonify(result)
    except Exception as e:
        print(f"Controller error details: {str(e)}")  # Add this for debugging
        return jsonify({'error': str(e)}), 500