from flask import Blueprint, request, jsonify
import json
import os
from models import db, EmailConfig
from utils.auth_middleware import token_required
from utils.email_sender import send_email_report

email_config_bp = Blueprint('email_config', __name__)

@email_config_bp.route('/', methods=['GET'])
@token_required
def get_email_configs(current_user_id, current_username):
    """Get all configured email addresses"""
    try:
        configs = EmailConfig.query.all()
        return jsonify({
            'emails': [config.to_dict() for config in configs]
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@email_config_bp.route('/', methods=['POST'])
@token_required
def add_email_config(current_user_id, current_username):
    """Add new email configuration"""
    try:
        data = request.get_json()
        
        if not data or not data.get('sender_email'):
            return jsonify({'error': 'Email address is required'}), 400
        
        sender_email = data['sender_email'].strip()
        
        # Validate email format (basic)
        if '@' not in sender_email:
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Check if email already exists
        existing = EmailConfig.query.filter_by(sender_email=sender_email).first()
        if existing:
            return jsonify({'error': 'Email already configured'}), 409
        
        # Create new config
        new_config = EmailConfig(sender_email=sender_email)
        db.session.add(new_config)
        db.session.commit()
        
        return jsonify({
            'message': 'Email added successfully',
            'email': new_config.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@email_config_bp.route('/<int:config_id>', methods=['DELETE'])
@token_required
def delete_email_config(current_user_id, current_username, config_id):
    """Delete email configuration"""
    try:
        config = EmailConfig.query.get(config_id)
        
        if not config:
            return jsonify({'error': 'Email configuration not found'}), 404
        
        db.session.delete(config)
        db.session.commit()
        
        return jsonify({'message': 'Email deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@email_config_bp.route('/send-report', methods=['POST'])
@token_required
def send_report(current_user_id, current_username):
    """Send job report to all configured email addresses"""
    try:
        # Get all configured emails
        configs = EmailConfig.query.all()
        
        if not configs:
            return jsonify({'error': 'No email addresses configured'}), 400
        
        recipients = [config.sender_email for config in configs]
        
        # Read job data
        json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'weekly data.json')
        
        with open(json_path, 'r') as f:
            jobs = json.load(f)
        
        # Send email
        success, message = send_email_report(recipients, jobs)
        
        if success:
            return jsonify({'message': message}), 200
        else:
            return jsonify({'error': message}), 500
    
    except FileNotFoundError:
        return jsonify({'error': 'Job data file not found'}), 404
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON format in data file'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
