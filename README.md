# Finora Full-Stack (matched to your uploaded SQL schema)

This project has two applications and your MySQL schema:
- `frontend/` — React + Vite UI
- `backend/` — Node.js + Express API
- `mysql/finance_tracker_schema.sql` — schema matching the SQL execution log you uploaded

## Important: existing database
You already executed the schema in MySQL Workbench. Do **not** run the SQL file again against a database containing your existing tables unless you have backed it up. The file uses `CREATE TABLE IF NOT EXISTS`, but it is supplied for reference/new setup.

## 1. Backend setup
Open a VS Code terminal in `backend`:
```powershell
npm install
Copy-Item .env.example .env
```
Edit `.env` with your MySQL settings. Based on your earlier note, this example uses MySQL port 3006 and database `finance_tracker`:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=3006
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=finance_tracker
JWT_SECRET=REPLACE_WITH_A_LONG_RANDOM_SECRET
JWT_EXPIRES_IN=7d
```
Do not share `.env` or commit it to Git.

Start:
```powershell
npm run dev
```
Check `http://localhost:5000/api/health`; it should report database connected.

## 2. Frontend setup
Open a second terminal in `frontend`:
```powershell
npm install
Copy-Item .env.example .env
npm run dev
```
Open `http://localhost:5173`.

## 3. First use
Register a new account. Registration creates the user and inserts that user's default income/expense categories into `categories`. Then add income/expense transactions, budgets and savings goals. The app fetches those records from MySQL through the Express API.

## API endpoints
- POST `/api/auth/register`
- POST `/api/auth/login`
- PUT `/api/users/profile` (name and currency)
- GET/POST `/api/transactions`
- DELETE `/api/transactions/:id`
- GET/POST `/api/budgets` (current month)
- GET/POST `/api/goals`
- POST `/api/goals/:id/contributions`
- GET `/api/analytics/monthly`

## Schema mapping
- UI transaction type `income` writes to SQL table `income`.
- UI transaction type `expense` writes to SQL table `expenses`.
- UI category names are resolved to `categories.id`.
- UI budgets map to `budgets.category_id`, `amount`, `month`, and `year`.
- UI savings goals map to `target_amount`, `current_amount`, `target_date`, and `status`.
- Contributions are stored in `savings_contributions` and update `savings_goals.current_amount`.

## Notes
- Dashboard and analytics monthly charts now use monthly values fetched from the API instead of demo chart history.
- The schema you uploaded does not contain occupation, monthly_income, or monthly_budget columns. The settings UI keeps those fields disabled; profile updates persist only name and currency.
- The UI's current total-balance card is the net of recorded income minus expenses; it does not assume an opening bank balance.
- This is a local development starter, not a production-hardened financial service.
