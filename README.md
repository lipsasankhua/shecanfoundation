# She Can Foundation

A mini full-stack web application for the She Can Foundation, an NGO focused on empowering women and girls through education, health, and community programs.

---

## Pages

**Main site** — `frontend/index.html`
Home, About, and a Volunteer application form.

**Admin panel** — `frontend/admin.html`
Accessible via the Admin link in the site footer. Requires login.

Default admin credentials: `admin` / `shecan2025`

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

## Running Locally

```bash
cd backend
npm install
node server.js
```

Then open `frontend/index.html` in your browser.
The backend runs at `http://localhost:3000`.

---

## Tech Stack

- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js, Express
- Database: SQLite

---

## Notes

- Add your photos to `frontend/images/` named `logo.png`, `hero-photo.jpg`, and `volunteer-photo.jpg`
- Change the admin password in `backend/db.js` before deploying
- Update the API URL in `index.html` from `localhost:3000` to your live backend URL when deploying