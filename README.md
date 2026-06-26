# Event Map

Fullstack application for discovering and joining events in Berlin.


## Preview

### Start Page

![Start Page](./screenshots/start_Page.png)

### Start Page (black mode)

![Start Page (black mode)](./screenshots/start_Page_black_Thema.png)

### Login

![Login](./screenshots/login.png)

### Login (black mode)

![Login (black mode)](./screenshots/login_dark.png)

### Register

![Register](./screenshots/register.png)

### Register (black mode)

![Register (black mode)](./screenshots/register_dark.png)

### My Profile

![My Profile](./screenshots/my_Profile.png)

### Browse Event 

![Browse Event](./screenshots/browse_events.png)

### Create Event

![Create Event](./screenshots/create_event.png)

### View Map
![View Map](./screenshots/view_Map.png)

### Responsive Event

![Responsive Event](./screenshots/responsiv_events.png)

### Responsive Profile

![Responsive Profile](./screenshots/responsiv_profile.png)

### Responsive Profile2

![Responsive Profile2](./screenshots/responsiv_profile2.png)

### Responsive Start Page

![Responsive Start Page](./screenshots/responsiv_startPage.png)

## Tech Stack
- Frontend: React, TypeScript, Vite, TailwindCSS
- Backend: Node.js, Express
- State management: Redux Toolkit, RTK Query
- Database: MongoDB
- Monorepo structure

## Project Structure

```text
EVENT-MAP/
├─ frontend/        # React application
├─ backend/         # API server
├─ packages/
│  └─ shared/       # Shared TypeScript types
```

## Features

- Authentication

- Browse events

- Join / cancel participation

- Create and manage events

- Interactive map

- Dark / light theme

- Responsive UI

### Getting Started
```
npm install
npm run dev
```
### in event-map\backend\src\services\mail-service.ts  
######  ```to:process.env.EMAIL_USER replace with to```
```
 to:to 
```