<div align="center">
  
# 🚀 EduAssist

**AI-Powered Learning Platform**

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

[Live Demo](https://eduassist.rakim0.me/)

<p align="center">
  <img src="https://storage.googleapis.com/eduassist-legal-docs/eduassistss.png" alt="EduAssist Preview1" width="33%" />
  <img src="https://storage.googleapis.com/eduassist-legal-docs/ss1.png" alt="EduAssist Preview2" width="33%" />
  <img src="https://storage.googleapis.com/eduassist-legal-docs/ss2.png" alt="EduAssist Preview3" width="33%" />
</p>

</div>

## 📚 Overview

EduAssist is a comprehensive, AI-powered learning platform that transforms how students engage with educational content. By harnessing the capabilities of Gemini 2.0, we provide personalized quizzes, smart notes, and a gamified learning experience that keeps students motivated and engaged.

### Why EduAssist?

- 🤖 **AI-Powered**: Generate custom quizzes and study notes using Gemini 2.0
- 🎮 **Gamified Learning**: Stay motivated with streaks, badges, and global leaderboards
- 📊 **Progress Tracking**: Monitor your improvement with detailed performance analytics
- 📱 **Responsive Design**: Seamless experience across all devices
- 🔄 **Cross-Platform**: Access your learning materials anywhere, anytime

---

## ✨ Features

### 🔐 Authentication
- **Firebase Integration**: Secure, reliable user authentication
- **Guest Mode**: Try before you sign up
- **Profile Dashboard**: Track progress, history, and achievements

### 🧠 AI Quiz Generator
- **Gemini 2.0 Powered**: Generate intelligent MCQs on any topic
- **Content Safety**: Built-in guardrails prevent inappropriate content
- **Performance Analytics**: Track accuracy, time spent, and improvement

### 📝 AI Notes Generator
- **Smart Summarization**: Turn any topic into concise, structured notes
- **Cloud Storage**: Access your notes from any device
- **Revision Support**: Perfect for quick review sessions

### 🎯 Practice Mode
- **Risk-Free Learning**: Practice without affecting your stats
- **Quick Generation**: Instant quizzes via Gemini 2.0 Flash
- **Focused Study**: Target specific areas for improvement

### 🔖 Smart Bookmarking
- **Save Challenging Questions**: Build your personal question bank
- **Custom Collections**: Organize bookmarks by subject or difficulty
- **One-Click Review**: Jump back to difficult concepts instantly

### 🔥 Daily Streaks & Gamification
- **Consistency Tracking**: Visual feedback on learning habits
- **Streak Rewards**: Unlock achievements for consistent study
- **Motivation System**: Gentle reminders to maintain momentum

### 🏆 Global Leaderboard
- **Competitive Learning**: Compare progress with peers worldwide
- **Multiple Categories**: Rankings by score, streaks, or quizzes completed
- **Weekly & All-Time Boards**: Fresh competition every week

### 📺 YouTube Integration
- **Related Content**: Auto-suggested educational videos for each topic
- **Seamless Learning**: Study deeper with visual content
- **Note Integration**: Add video insights to your notes

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16.x or higher
- Python 3.8 or higher
- Docker (optional)

### Backend Setup

#### Using Docker
```bash
# Build the Docker image
docker build -t eduassist_api:latest .

# Run the container
docker run -p 8000:8080 eduassist_api
```

#### Manual Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Run development server
python manage.py runserver
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the application running locally.

---

## 🧩 Project Structure

### Frontend (Next.js)
```
frontend/
├── app/                  # Next.js 13+ App Router
│   ├── bookmarks/        # Saved questions view
│   ├── dashboard/        # User dashboard
│   ├── leaderboard/      # Global rankings
│   ├── notes/            # AI notes generator
│   ├── practice/         # Practice mode
│   ├── quiz/             # Quiz generator
│   └── layout.js         # Root layout
├── components/           # Reusable React components
├── lib/                  # Utility functions
├── public/               # Static assets
└── styles/               # Global CSS styles
```

### Backend (Django)
```
backend/
├── backend/            # Django project settings (settings.py, urls.py, wsgi.py)
├── practice/           # App for practice mode quiz logic
├── quiz/               # App for regular quiz generation
├── tutorials/          # App for Gemini-powered note generation
├── userAuth/           # Firebase Auth integration & user management
├── __init__.py         # Marks this as a Python package
├── .env                # Environment variables (do NOT commit this!)
└── .gitignore          # Git ignore file
```

---

## 🔐 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measure_id
PRODUCTION_BACKEND_URL=https://your-backend-url.com
```

### Backend (.env or via cloud configuration)
```env
GOOGLE_TYPE=service_account
GOOGLE_PROJECT_ID=eduassist-42fc
GOOGLE_PRIVATE_KEY_ID=your_private_key_id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=your_client_email
GOOGLE_CLIENT_ID=your_id
GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
GOOGLE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
GOOGLE_AUTH_PROVIDER_X509_CERT_URL=your_auth_provider_x509_cert_url
GOOGLE_CLIENT_X509_CERT_URL=your_client_x509_cert_url
GOOGLE_UNIVERSE_DOMAIN=googleapis.com
GEMINI_API_KEY=your_gemini_api_key
YOUTUBE_API_KEY=your_youtube_api_key
FIREBASE_WEB_API_KEY=your_firebase_web_api_key
```

---

## 🚀 Deployment

### Google Cloud VM Deployment

Both the frontend and backend are deployed on Google Cloud Virtual Machine:

1. **VM Setup**:
   ```bash
   # Update the VM
   sudo apt-get update
   sudo apt-get upgrade -y
   
   # Install dependencies
   sudo apt-get install -y git nginx python3-pip nodejs npm
   ```

2. **Backend Deployment**:
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/eduassist.git
   cd eduassist/backend
   
   # Setup virtual environment
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   
   # Configure Gunicorn service
   sudo nano /etc/systemd/system/eduassist.service
   # Add appropriate configuration
   
   # Start the service
   sudo systemctl enable eduassist
   sudo systemctl start eduassist
   ```

3. **Frontend Deployment**:
   ```bash
   cd ../frontend
   npm install
   npm run build
   
   # Configure Nginx to serve frontend and proxy API requests
   sudo nano /etc/nginx/sites-available/eduassist
   # Add appropriate configuration
   
   # Enable site and restart Nginx
   sudo ln -s /etc/nginx/sites-available/eduassist /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **SSL Configuration**:
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx
   
   # Obtain SSL certificate
   sudo certbot --nginx -d yourdomain.com
   ```

---

## 🧑‍💻 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to your branch: `git push origin feature/amazing-feature`
5. Submit a **Pull Request**

### Contribution Guidelines
- Follow our code style and formatting
- Write tests for new features
- Keep pull requests focused on single issues
- Document your code and changes

---

## 🧰 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | Next.js, Tailwind CSS, React |
| **Backend** | Django, Django REST Framework |
| **Database** | Firestore (Firebase) |
| **AI/ML** | Gemini 2.0, Gemini Flash |
| **Authentication** | Firebase Authentication |
| **External APIs** | YouTube Data API |
| **Hosting** | Google Cloud VM |

---

## 📊 Roadmap

- [ ] **Mobile App** - Native iOS and Android applications
- [ ] **Offline Mode** - Study without internet connection
- [ ] **Study Groups** - Collaborative learning features
- [ ] **AI Tutor** - Personalized tutoring assistance
- [ ] **Content Marketplace** - Share and discover study materials
- [ ] **Advanced Analytics** - Deeper insights into learning patterns

---

## 🌟 Acknowledgements

- [Gemini AI](https://deepmind.google/technologies/gemini/) - For powering our AI features
- [Next.js](https://nextjs.org/) - The React framework for production
- [Django](https://www.djangoproject.com/) - The backend framework
- [Firebase](https://firebase.google.com/) - For authentication and database
- [Tailwind CSS](https://tailwindcss.com/) - For styling and UI components
- [Google Cloud](https://cloud.google.com/) - For hosting our application

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  
### 🌱 Made with ❤️ by the EduAssist Team

EduAssist was built to make personalized learning accessible, smart, and fun.

[GitHub](https://github.com/yourusername) • [Twitter](https://twitter.com/yourusername) • [Website](https://yourusername.com)

</div>
