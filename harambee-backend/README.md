# Mchanga Backend — Flask + PostgreSQL

REST API for the Mchanga crowdfunding platform.

## Project Structure

```
mchanga-backend/
├── app.py              # App factory & entry point
├── config.py           # Config classes (dev/prod)
├── extensions.py       # SQLAlchemy, Migrate, Marshmallow instances
├── schemas.py          # Marshmallow serialization schemas
├── seed.py             # Seed DB with initial campaign data
├── requirements.txt
├── .env.example
├── models/
│   ├── __init__.py
│   └── campaign.py     # Category, Campaign, CampaignUpdate, Donation
└── routes/
    ├── __init__.py
    ├── campaigns.py    # CRUD + updates
    ├── donations.py    # Donate + M-PESA callback
    └── categories.py   # List categories
```

---

## Setup

### 1. Create and activate a virtual environment

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Create the PostgreSQL database

```sql
-- In psql:
CREATE DATABASE mchanga_db;
```

### 4. Configure environment variables

```bash
cp .env.example .env
# Edit .env and set your DATABASE_URL, SECRET_KEY, etc.
```

### 5. Run database migrations

```bash
flask db init       # only the very first time
flask db migrate -m "initial schema"
flask db upgrade
```

### 6. Seed the database

```bash
python seed.py
```

### 7. Run the development server

```bash
flask run
# or
python app.py
```

Server starts at **http://localhost:5000**

---

## API Reference

### Health
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/health` | Health check |

### Categories
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/categories/` | List all categories |

### Campaigns
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/campaigns/` | List campaigns (paginated) |
| GET | `/api/campaigns/<slug>` | Get single campaign |
| POST | `/api/campaigns/` | Create campaign |
| PUT/PATCH | `/api/campaigns/<slug>` | Update campaign |
| DELETE | `/api/campaigns/<slug>` | Delete campaign |
| POST | `/api/campaigns/<slug>/updates` | Add a campaign update |

#### Campaign list query params
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category id (e.g. `medical`) |
| `featured` | `true` | Return only featured campaigns |
| `search` | string | Search title, organizer, location |
| `page` | int | Page number (default `1`) |
| `per_page` | int | Items per page (default `12`, max `50`) |

#### Create campaign body
```json
{
  "title": "Help John Doe",
  "slug": "help-john-doe",
  "category_id": "medical",
  "organizer": "Jane Doe",
  "location": "Nairobi, Kenya",
  "target": 200000,
  "days_left": 30,
  "image": "https://...",
  "description": "Short description",
  "story": "Long story..."
}
```

### Donations
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/donations/` | Create a donation |
| POST | `/api/donations/mpesa-callback` | Safaricom Daraja callback |
| GET | `/api/donations/campaign/<id>` | List donations for a campaign |

#### Create donation body
```json
{
  "campaign_id": 1,
  "amount": 1000,
  "phone": "0712345678",
  "donor_name": "Mary Wanjiru",
  "message": "Stay strong!",
  "anonymous": false
}
```

---

## Connecting the React Frontend

Update your frontend to call the API instead of using the static `campaigns.js` data.

Example with `fetch`:

```js
// src/api/index.js
const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export async function getCampaigns(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/api/campaigns/?${qs}`);
  return res.json();
}

export async function getCampaign(slug) {
  const res = await fetch(`${BASE}/api/campaigns/${slug}`);
  return res.json();
}

export async function donate(payload) {
  const res = await fetch(`${BASE}/api/donations/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
```

Add `VITE_API_URL=http://localhost:5000` to your frontend `.env`.

---

## M-PESA Daraja Integration (Production)

To enable real M-PESA payments, replace the simulated logic in
`routes/donations.py` `create_donation()` with:

1. Get OAuth token from `https://sandbox.safaricom.co.ke/oauth/v1/generate`
2. Trigger STK Push to `https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest`
3. Save donation with `status="pending"` and `mpesa_ref=CheckoutRequestID`
4. Daraja calls your `/api/donations/mpesa-callback` endpoint async
5. The callback handler marks the donation `completed` and updates campaign totals

Safaricom docs: https://developer.safaricom.co.ke/APIs/MpesaExpressSimulate
