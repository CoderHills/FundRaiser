Harambee - funding Platform

A full-stack crowdfunding platform for fundraising campaigns in Kenya.

Tech Stack

- **Backend**: Flask (Python) + PostgreSQL
- **Frontend**: React + Vite
- **Payments**: M-Pesa Daraja API (sandbox mode)

Features

- User authentication (register/login)
- Create and manage fundraising campaigns
- Search and filter campaigns by category
- Make donations via M-Pesa
- User profile and settings


### Backend

```bash
cd harambee-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python app.py
```

Server runs at http://localhost:5000

### Frontend

```bash
cd harambee-frontend
npm install
npm run dev
```

App runs at http://localhost:3000

## Project Structure

```
harambee-backend/  
harambee-frontend/  
```
