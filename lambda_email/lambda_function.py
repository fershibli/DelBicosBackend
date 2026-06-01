import os
import json
import re
import smtplib
from email.message import EmailMessage

SMTP_HOST = os.environ.get('SMTP_HOST')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
SMTP_USER = os.environ.get('SMTP_USER')
SMTP_PASS = os.environ.get('SMTP_PASS')
FROM_EMAIL = os.environ.get('FROM_EMAIL')
DEFAULT_SUBJECT = os.environ.get('DEFAULT_SUBJECT', 'Teste de e-mail')


def send_email(to_address: str, subject: str, body: str) -> None:
    msg = EmailMessage()
    msg['From'] = FROM_EMAIL or SMTP_USER or 'no-reply@example.com'
    msg['To'] = to_address
    msg['Subject'] = subject
    # Provide a plain-text fallback and add HTML alternative so clients render correctly
    plain = re.sub('<[^<]+?>', '', body or '')
    msg.set_content(plain or (body or ''))
    # Add HTML alternative (email clients will prefer this when available)
    msg.add_alternative(body or '', subtype='html')

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as s:
        s.ehlo()
        if SMTP_PORT in (587, 25):
            s.starttls()
        if SMTP_USER and SMTP_PASS:
            s.login(SMTP_USER, SMTP_PASS)
        s.send_message(msg)


def _extract_payload(event: dict) -> dict:
    # Handle direct test events (keys at top-level)
    if isinstance(event.get('to'), str):
        return {
            'to': event.get('to'),
            'subject': event.get('subject'),
            'body': event.get('body'),
        }

    # Handle API Gateway / Function URL (v2) where body is a JSON string
    body = event.get('body')
    if body:
        if isinstance(body, str):
            try:
                parsed = json.loads(body)
                return {
                    'to': parsed.get('to'),
                    'subject': parsed.get('subject'),
                    'body': parsed.get('body'),
                }
            except Exception:
                # body may be raw text
                return {'to': None, 'subject': None, 'body': body}
        elif isinstance(body, dict):
            return {
                'to': body.get('to'),
                'subject': body.get('subject'),
                'body': body.get('body'),
            }

    # Fallback: try top-level keys again
    return {
        'to': event.get('recipient') or event.get('to'),
        'subject': event.get('subject'),
        'body': event.get('body'),
    }


def lambda_handler(event, context):
    print('Received event:', event)
    try:
        payload = _extract_payload(event or {})
        to = payload.get('to')
        subject = payload.get('subject') or DEFAULT_SUBJECT
        body = payload.get('body') or 'Mensagem enviada pela Lambda'

        if not to:
            return {'statusCode': 400, 'body': 'Missing "to" address'}

        if not SMTP_HOST:
            return {'statusCode': 500, 'body': 'SMTP_HOST não configurado'}

        send_email(to, subject, body)
        return {'statusCode': 200, 'body': 'Email enviado'}
    except Exception as e:
        print('Error sending email:', e)
        return {'statusCode': 500, 'body': f'Erro ao enviar email: {e}'}
