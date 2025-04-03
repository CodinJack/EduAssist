import firebase_admin
from firebase_admin import credentials, firestore
import google.auth.transport.requests
from google.auth.transport.requests import AuthorizedSession
import requests

# Place this in a utility file like firebase_utils.py

import os
import requests
import socket
from urllib.parse import urlparse
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud import firestore as google_firestore
from google.auth.transport.requests import Request
from google.auth.transport import requests as google_requests

class ProxyAwareFirestoreClient:
    def __init__(self, service_account_path, proxy_servers=None, test_url="https://firebase.google.com"):
        """
        Initialize a Firestore client that works with or without proxies.
        
        Args:
            service_account_path: Path to your Firebase service account JSON file
            proxy_servers: List of proxy servers to try, e.g., ['http://172.31.2.3:8080', 'http://172.31.2.4:8080']
            test_url: URL to test proxy connectivity
        """
        self.service_account_path = service_account_path
        self.proxy_servers = proxy_servers or []
        self.test_url = test_url
        self.db = None
        self.initialize()
    
    def test_connection(self, proxy=None):
        """Test if a connection can be established with or without proxy."""
        try:
            session = requests.Session()
            if proxy:
                session.proxies = {'http': proxy, 'https': proxy}
            response = session.get(self.test_url, timeout=5)
            return response.status_code == 200
        except:
            return False
    
    def detect_working_proxy(self):
        """Find a working proxy from the list or return None if direct connection works."""
        # First check if direct connection works
        if self.test_connection():
            print("Direct connection works, no proxy needed")
            return None
        
        # Try each proxy
        for proxy in self.proxy_servers:
            print(f"Testing proxy: {proxy}")
            if self.test_connection(proxy):
                print(f"Found working proxy: {proxy}")
                return proxy
        
        print("No working connection found")
        return None
    
    def initialize(self):
        """Initialize the Firestore client with appropriate proxy settings."""
        working_proxy = self.detect_working_proxy()
        
        # Initialize Firebase Admin SDK
        if not firebase_admin._apps:
            cred = credentials.Certificate(self.service_account_path)
            firebase_admin.initialize_app(cred)
        
        # Set up environment variables if proxy is needed
        if working_proxy:
            os.environ['HTTP_PROXY'] = working_proxy
            os.environ['HTTPS_PROXY'] = working_proxy
        else:
            # Clear proxy environment variables if they exist
            if 'HTTP_PROXY' in os.environ:
                del os.environ['HTTP_PROXY']
            if 'HTTPS_PROXY' in os.environ:
                del os.environ['HTTPS_PROXY']
        
        # Create a Firestore client
        self.db = firestore.client()
        
        return self.db
    
    def get_db(self):
        """Get the Firestore database client."""
        if not self.db:
            self.initialize()
        return self.db

# Example usage in your Django views or models
def get_firestore_client():
    """Helper function to get a properly configured Firestore client."""
    proxy_servers = [
        'http://172.31.2.3:8080',
        'http://172.31.2.4:8080',
    ]
    
    client = ProxyAwareFirestoreClient(
        service_account_path='firebase_config.json',
        proxy_servers=proxy_servers
    )
    
    return client.get_db()
