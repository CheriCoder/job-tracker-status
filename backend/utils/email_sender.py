import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import Config
from datetime import datetime

def format_job_table_html(jobs):
    """Format job data as HTML table"""
    
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
                background-color: #f5f5f5;
            }
            .container {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            h2 {
                color: #333;
                border-bottom: 3px solid #4CAF50;
                padding-bottom: 10px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            th {
                background-color: #4CAF50;
                color: white;
                padding: 12px;
                text-align: left;
                font-weight: bold;
            }
            td {
                padding: 10px;
                border-bottom: 1px solid #ddd;
            }
            tr:hover {
                background-color: #f5f5f5;
            }
            .positive {
                color: #4CAF50;
                font-weight: bold;
            }
            .negative {
                color: #f44336;
                font-weight: bold;
            }
            .neutral {
                color: #666;
            }
            .footer {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                color: #666;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Job Tracking Report</h2>
            <p>Generated on: """ + datetime.now().strftime('%B %d, %Y at %I:%M %p') + """</p>
            <table>
                <thead>
                    <tr>
                        <th>Process Name</th>
                        <th>Function</th>
                        <th>Forecasted Start</th>
                        <th>Forecasted End</th>
                        <th>Actual Start</th>
                        <th>Actual End</th>
                        <th>Comments</th>
                        <th>Est. Duration (min)</th>
                        <th>Actual Duration (min)</th>
                        <th>Variance</th>
                    </tr>
                </thead>
                <tbody>
    """
    
    for job in jobs:
        variance = job.get('variance')
        variance_class = 'neutral'
        if variance is not None:
            if variance > 0:
                variance_class = 'negative'
            elif variance < 0:
                variance_class = 'positive'
        
        variance_display = str(variance) if variance is not None else 'N/A'
        
        html += f"""
                    <tr>
                        <td>{job.get('processName', 'N/A')}</td>
                        <td>{job.get('processFunction', 'N/A')}</td>
                        <td>{job.get('forecastedStart', 'N/A')}</td>
                        <td>{job.get('forecastedEnd', 'N/A')}</td>
                        <td>{job.get('actualStart', 'N/A')}</td>
                        <td>{job.get('actualEnd', 'N/A')}</td>
                        <td>{job.get('comments', 'N/A')}</td>
                        <td>{job.get('estimatedDurationMinutes', 'N/A')}</td>
                        <td>{job.get('actualDurationMinutes', 'N/A')}</td>
                        <td class="{variance_class}">{variance_display}</td>
                    </tr>
        """
    
    html += """
                </tbody>
            </table>
            <div class="footer">
                <p>This is an automated report from the Job Tracking System.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return html


def send_email_report(recipients, jobs):
    """Send job report via email to multiple recipients"""
    
    if not Config.SMTP_USERNAME or not Config.SMTP_PASSWORD:
        raise ValueError("SMTP credentials not configured")
    
    if not recipients:
        raise ValueError("No recipients specified")
    
    # Create message
    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Job Tracking Report - {datetime.now().strftime("%Y-%m-%d")}'
    msg['From'] = Config.SENDER_EMAIL or Config.SMTP_USERNAME
    msg['To'] = ', '.join(recipients)
    
    # Create HTML content
    html_content = format_job_table_html(jobs)
    html_part = MIMEText(html_content, 'html')
    msg.attach(html_part)
    
    # Send email
    try:
        with smtplib.SMTP(Config.SMTP_HOST, Config.SMTP_PORT) as server:
            if Config.SMTP_USE_TLS:
                server.starttls()
            server.login(Config.SMTP_USERNAME, Config.SMTP_PASSWORD)
            server.send_message(msg)
        
        return True, f"Email sent successfully to {len(recipients)} recipient(s)"
    
    except Exception as e:
        return False, f"Failed to send email: {str(e)}"
