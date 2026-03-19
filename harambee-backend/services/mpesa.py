import requests
import base64
import datetime
import json
from flask import current_app


class MpesaService:
    def __init__(self, app=None):
        self.consumer_key = None
        self.consumer_secret = None
        self.shortcode = None
        self.passkey = None
        self.env = None
        self.access_token = None
        self.token_expiry = None
        
        if app:
            self.init_app(app)
    
    def init_app(self, app):
        self.consumer_key = app.config.get('MPESA_CONSUMER_KEY')
        self.consumer_secret = app.config.get('MPESA_CONSUMER_SECRET')
        self.shortcode = app.config.get('MPESA_SHORTCODE')
        self.passkey = app.config.get('MPESA_PASSKEY')
        self.env = app.config.get('MPESA_ENV', 'sandbox')
    
    def get_base_url(self):
        if self.env == 'production':
            return 'https://api.safaricom.co.ke'
        return 'https://sandbox.safaricom.co.ke'
    
    def get_access_token(self):
        if self.access_token and self.token_expiry:
            if datetime.datetime.now() < self.token_expiry:
                return self.access_token
        
        auth_url = f"{self.get_base_url()}/oauth/v1/generate?grant_type=client_credentials"
        auth = (self.consumer_key, self.consumer_secret)
        
        try:
            response = requests.get(auth_url, auth=auth)
            data = response.json()
            
            if response.status_code == 200:
                self.access_token = data['access_token']
                self.token_expiry = datetime.datetime.now() + datetime.timedelta(seconds=3400)
                return self.access_token
            else:
                print(f"Error getting access token: {data}")
                return None
        except Exception as e:
            print(f"Exception getting access token: {e}")
            return None
    
    def stk_push(self, phone_number, amount, account_reference, transaction_desc):
        access_token = self.get_access_token()
        if not access_token:
            return {'success': False, 'error': 'Failed to get access token'}
        
        stk_url = f"{self.get_base_url()}/mpesa/stkpush/v1/processrequest"
        
        phone = str(phone_number).strip()
        if phone.startswith('0'):
            phone = '254' + phone[1:]
        elif not phone.startswith('254'):
            phone = '254' + phone
        
        timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
        
        password_str = f"{self.shortcode}{self.passkey}{timestamp}"
        password = base64.b64encode(password_str.encode()).decode()
        
        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerBuyGoodsOnline",
            "Amount": str(int(amount)),
            "PartyA": phone,
            "PartyB": self.shortcode,
            "PhoneNumber": phone,
            "CallBackURL": "https://yourdomain.com/api/mpesa/callback",
            "AccountReference": account_reference,
            "TransactionDesc": transaction_desc
        }
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.post(stk_url, json=payload, headers=headers)
            data = response.json()
            
            if response.status_code == 200:
                return {
                    'success': True,
                    'checkout_request_id': data.get('CheckoutRequestID'),
                    'response_code': data.get('ResponseCode'),
                    'response_desc': data.get('ResponseDescription')
                }
            else:
                return {
                    'success': False,
                    'error': data.get('errorMessage', 'STK Push failed'),
                    'response_code': data.get('ResponseCode')
                }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def query_transaction(self, checkout_request_id):
        access_token = self.get_access_token()
        if not access_token:
            return {'success': False, 'error': 'Failed to get access token'}
        
        query_url = f"{self.get_base_url()}/mpesa/stkpushquery/v1/query"
        
        timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
        password_str = f"{self.shortcode}{self.passkey}{timestamp}"
        password = base64.b64encode(password_str.encode()).decode()
        
        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "CheckoutRequestID": checkout_request_id
        }
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.post(query_url, json=payload, headers=headers)
            data = response.json()
            
            if response.status_code == 200:
                return {
                    'success': True,
                    'result_code': data.get('ResultCode'),
                    'result_desc': data.get('ResultDesc')
                }
            else:
                return {'success': False, 'error': data.get('errorMessage', 'Query failed')}
        except Exception as e:
            return {'success': False, 'error': str(e)}


mpesa_service = MpesaService()
