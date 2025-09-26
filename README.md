# Torrey Pines Golf Waitlist Automator

A web-based application that automatically joins the Torrey Pines golf waitlist using server-side automation with Puppeteer.

## Features

- **Full Automation**: Automatically clicks "Join Waitlist" button and fills all form fields
- **Server-Side Processing**: Uses Puppeteer to handle the automation on the server
- **Mobile Friendly**: Responsive design that works on phones and tablets
- **Scheduled Submissions**: Set specific times to automatically submit to waitlist
- **Real-Time Status**: Live feedback on submission status
- **Cloud Deployable**: Ready for Railway, Heroku, or other cloud platforms

## How It Works

1. **User fills out the form** with their golf reservation details
2. **Server uses Puppeteer** to open the WaitWhile page
3. **Automatically clicks "Join Waitlist"** button
4. **Fills all form fields** with the provided information
5. **Submits the form** automatically
6. **Returns success/failure status** to the user

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Visit the app:**
   Open http://localhost:3000 in your browser

## Deployment to Railway

1. **Create a new Railway project**
2. **Connect your GitHub repository** (or upload the code)
3. **Railway will automatically detect** the Node.js app
4. **Deploy!** The app will be available at your Railway URL

## API Endpoints

- `POST /api/submit-waitlist` - Submit to waitlist immediately
- `POST /api/schedule-booking` - Schedule a submission for later

## Technical Details

- **Backend**: Node.js with Express
- **Automation**: Puppeteer for browser automation
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Scheduling**: Node-cron for scheduled tasks
- **Deployment**: Railway-ready with Procfile

## Environment Variables

- `PORT` - Server port (default: 3000)

## Files Structure

```
torrey-pines-webapp/
├── server.js          # Main server file
├── package.json       # Dependencies
├── Procfile          # Railway deployment config
├── public/
│   └── index.html    # Frontend interface
└── README.md         # This file
```

## Troubleshooting

- **Puppeteer issues**: Make sure you're using a compatible Node.js version
- **Form not filling**: WaitWhile may have changed their form structure
- **Submit not working**: Check the submit button selectors in server.js

## Legal Notice

This application is for personal use only. Please ensure you comply with WaitWhile's terms of service when using automated tools.
