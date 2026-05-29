# She Can Foundation

A full-stack web application for the She Can Foundation, an NGO focused on empowering women and girls through education, health, and community programs.

**Live site:** https://shecanfoundation-lipsa.netlify.app

---

## Pages

**Main site** — `frontend/index.html`
Home, About, and a Volunteer application form.

**Admin panel** — `frontend/admin.html`
Accessible via the Admin link in the site footer. Requires login.
Default credentials: `admin` / `shecan2025`

---

## Project Structure

```
shecan-foundation/
├── frontend/
│   ├── index.html
│   ├── admin.html
│   ├── css/style.css
│   └── images/
└── backend/
    ├── server.js
    ├── db.js
    └── package.json
```

---

## Deployment

- Frontend hosted on Netlify
- Backend hosted on Render at `https://shecan-backend-jt82.onrender.com`

To run locally:

```bash
cd backend
npm install
node server.js
```

Then open `frontend/index.html` in your browser and update the API URL in `index.html` and `admin.html` back to `http://localhost:3000`.

---

## Tech Stack

- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js, Express
- Database: SQLite