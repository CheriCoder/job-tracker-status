from flask import Blueprint, jsonify
import json
import os
from utils.auth_middleware import token_required

jobs_bp = Blueprint('jobs', __name__)

@jobs_bp.route('/', methods=['GET'])
@token_required
def get_jobs(current_user_id, current_username):
    """Get all jobs from JSON file"""
    try:
        # Path to the JSON file
        json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'weekly data.json')
        
        # Read JSON file
        with open(json_path, 'r') as f:
            jobs = json.load(f)
        
        return jsonify({
            'jobs': jobs,
            'count': len(jobs)
        }), 200
    
    except FileNotFoundError:
        return jsonify({'error': 'Job data file not found'}), 404
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON format in data file'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
