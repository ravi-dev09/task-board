# TaskBoard

A simple full-stack task manager.

- **Frontend:** HTML, CSS, vanilla JavaScript
- **Backend:** Node.js + Express (REST API)
- **Storage:** JSON file (`data/tasks.json`), no database setup needed

## Features
- Add tasks with a priority (low / medium / high)
- Mark tasks as done, or delete them
- Filter by All / To do / Done
- Data is saved on the server and survives refreshes and restarts

## Run locally
```bash
npm install
npm start
```
Open http://localhost:3000

## API
| Method | Endpoint         | Description        |
|--------|------------------|--------------------|
| GET    | /api/tasks       | List all tasks     |
| POST   | /api/tasks       | Create a task      |
| PATCH  | /api/tasks/:id   | Update a task      |
| DELETE | /api/tasks/:id   | Delete a task      |

## Ideas to extend
- Swap the JSON file for SQLite or MongoDB
- Add user login
- Add due dates
