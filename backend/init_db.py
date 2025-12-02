from app import create_app
from models import db, User
from config import Config

def init_database():
    """Initialize database with tables and default admin user"""
    app = create_app()
    
    with app.app_context():
        # Create all tables
        print("Creating database tables...")
        db.create_all()
        print("Tables created successfully!")
        
        # Check if admin user exists
        admin = User.query.filter_by(username='admin').first()
        
        if not admin:
            # Create default admin user
            print("Creating default admin user...")
            admin = User(username='admin')
            admin.set_password('admin123')
            
            db.session.add(admin)
            db.session.commit()
            
            print("Admin user created successfully!")
            print("Username: admin")
            print("Password: admin123")
        else:
            print("Admin user already exists.")
        
        print("\nDatabase initialization complete!")


if __name__ == '__main__':
    init_database()
