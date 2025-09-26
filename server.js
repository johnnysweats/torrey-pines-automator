const express = require('express');
const { chromium } = require('playwright');
const cors = require('cors');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Store for scheduled bookings
let scheduledBookings = [];
let isAutomationRunning = false; // Flag to prevent multiple instances

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to submit waitlist request
app.post('/api/submit-waitlist', async (req, res) => {
    try {
        if (isAutomationRunning) {
            return res.json({ success: false, message: 'Automation is already running. Please wait...' });
        }

        const { firstName, lastName, email, phone, course, players, scheduleDate, scheduleTime } = req.body;
        
        console.log('Submitting waitlist request:', { firstName, lastName, email, course, players });
        
        const result = await submitToWaitWhile({
            firstName,
            lastName,
            email,
            phone,
            course,
            players,
            scheduleDate,
            scheduleTime
        });
        
        res.json({ success: true, message: 'Successfully submitted to Torrey Pines waitlist!', result });
    } catch (error) {
        console.error('Error submitting to waitlist:', error);
        res.json({ success: false, message: 'Failed to submit to waitlist: ' + error.message });
    }
});

// API endpoint to schedule a booking
app.post('/api/schedule-booking', (req, res) => {
    try {
        const { bookingData, scheduleTime } = req.body;
        
        const scheduledBooking = {
            id: Date.now().toString(),
            ...bookingData,
            scheduleTime: new Date(scheduleTime),
            status: 'scheduled'
        };
        
        scheduledBookings.push(scheduledBooking);
        
        console.log('Scheduled booking:', scheduledBooking);
        res.json({ success: true, message: 'Booking scheduled successfully!', bookingId: scheduledBooking.id });
    } catch (error) {
        console.error('Error scheduling booking:', error);
        res.json({ success: false, message: 'Failed to schedule booking: ' + error.message });
    }
});

// Main automation function - using Playwright for better Vercel compatibility
async function submitToWaitWhile(data) {
    let browser;
    
    try {
        // Set the flag to prevent multiple instances
        isAutomationRunning = true;
        console.log('🚀 Starting automation - preventing multiple instances');
        
        console.log('Launching browser...');
        browser = await chromium.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--disable-extensions',
                '--disable-plugins',
                '--disable-images',
                '--disable-javascript',
                '--disable-default-apps',
                '--disable-sync',
                '--disable-translate',
                '--hide-scrollbars',
                '--mute-audio',
                '--no-default-browser-check',
                '--no-pings',
                '--password-store=basic',
                '--use-mock-keychain'
            ]
        });
        
        const page = await browser.newPage();
        
        // Set viewport
        await page.setViewportSize({ width: 1280, height: 720 });
        
        // Set geolocation to Torrey Pines coordinates
        console.log('Setting geolocation to Torrey Pines...');
        await page.context().grantPermissions(['geolocation'], { origin: 'https://waitwhile.com' });
        await page.evaluateOnNewDocument(() => {
            navigator.geolocation.getCurrentPosition = (success) => {
                success({
                    coords: {
                        latitude: 32.904498,
                        longitude: -117.245091,
                        accuracy: 20
                    }
                });
            };
        });
        
        console.log('Navigating to WaitWhile...');
        await page.goto('https://waitwhile.com/locations/torreypinesgolf/welcome', {
            waitUntil: 'domcontentloaded',
            timeout: 15000
        });
        
        // Wait for page to load and geolocation to be processed
        await page.waitForTimeout(2000);
        
        // Get all buttons and links on the page
        const allButtons = await page.$$eval('button, a, [role="button"]', elements => 
            elements.map(el => ({
                tagName: el.tagName,
                text: el.textContent.trim(),
                className: el.className,
                id: el.id,
                href: el.href || null
            }))
        );
        
        console.log('Found buttons/links:', allButtons);
        
        // Look for the "Join Waitlist" button
        let joinButton = null;
        const joinTexts = ['join waitlist', 'join', 'sign up', 'get started', 'book now', 'waitlist'];
        
        for (const button of allButtons) {
            const text = button.text.toLowerCase();
            if (joinTexts.some(joinText => text.includes(joinText))) {
                console.log(`Found potential join button: ${button.text}`);
                joinButton = button;
                break;
            }
        }
        
        if (joinButton) {
            console.log('Clicking join button...');
            // Try different ways to click the button
            try {
                await page.click(`button:has-text("${joinButton.text}")`);
            } catch (e) {
                try {
                    await page.click(`a:has-text("${joinButton.text}")`);
                } catch (e2) {
                    // Try clicking by text content
                    await page.evaluate((text) => {
                        const elements = Array.from(document.querySelectorAll('button, a, [role="button"]'));
                        const element = elements.find(el => el.textContent.trim().toLowerCase().includes(text.toLowerCase()));
                        if (element) element.click();
                    }, joinButton.text);
                }
            }
            await page.waitForTimeout(1000);
        } else {
            console.log('No join button found, trying to find any clickable element...');
            // Try clicking the first button or link
            const firstButton = await page.$('button, a[href]');
            if (firstButton) {
                console.log('Clicking first available button/link...');
                await firstButton.click();
                await page.waitForTimeout(1000);
            }
        }
        
        // Now try to fill form fields
        console.log('Looking for form fields...');
        
        // Get all input fields
        const allInputs = await page.$$eval('input, select, textarea', elements => 
            elements.map(el => ({
                tagName: el.tagName,
                type: el.type || 'text',
                name: el.name || '',
                id: el.id || '',
                placeholder: el.placeholder || '',
                className: el.className || ''
            }))
        );
        
        console.log('Found input fields:', allInputs);
        
        // Try to fill the form
        const formData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone
        };
        
        let fieldsFilled = 0;
        
        // Try different strategies to fill fields
        for (const [fieldName, value] of Object.entries(formData)) {
            if (!value) continue;
            
            // Strategy 1: Try by name attribute
            try {
                const nameSelectors = [
                    `input[name*="${fieldName}"]`,
                    `input[name*="${fieldName.toLowerCase()}"]`,
                    `input[name*="${fieldName.charAt(0).toLowerCase() + fieldName.slice(1)}"]`
                ];
                
                for (const selector of nameSelectors) {
                    const element = await page.$(selector);
                    if (element) {
                        await element.fill(value);
                        console.log(`Filled ${fieldName} using name selector: ${selector}`);
                        fieldsFilled++;
                        break;
                    }
                }
            } catch (e) {
                // Try next strategy
            }
            
            // Strategy 2: Try by placeholder
            if (fieldsFilled === 0) {
                try {
                    const placeholderSelectors = [
                        `input[placeholder*="${fieldName}"]`,
                        `input[placeholder*="${fieldName.toLowerCase()}"]`
                    ];
                    
                    for (const selector of placeholderSelectors) {
                        const element = await page.$(selector);
                        if (element) {
                            await element.fill(value);
                            console.log(`Filled ${fieldName} using placeholder selector: ${selector}`);
                            fieldsFilled++;
                            break;
                        }
                    }
                } catch (e) {
                    // Try next strategy
                }
            }
            
            // Strategy 3: Try by ID
            if (fieldsFilled === 0) {
                try {
                    const idSelectors = [
                        `#${fieldName}`,
                        `#${fieldName.toLowerCase()}`,
                        `#${fieldName.charAt(0).toLowerCase() + fieldName.slice(1)}`
                    ];
                    
                    for (const selector of idSelectors) {
                        const element = await page.$(selector);
                        if (element) {
                            await element.fill(value);
                            console.log(`Filled ${fieldName} using ID selector: ${selector}`);
                            fieldsFilled++;
                            break;
                        }
                    }
                } catch (e) {
                    // Try next strategy
                }
            }
        }
        
        console.log(`Successfully filled ${fieldsFilled} fields`);
        
        // Look for submit button
        console.log('Looking for submit button...');
        const submitButtons = await page.$$eval('button, input[type="submit"]', elements => 
            elements.map(el => ({
                tagName: el.tagName,
                type: el.type || 'button',
                text: el.textContent.trim(),
                className: el.className,
                id: el.id
            }))
        );
        
        console.log('Found submit buttons:', submitButtons);
        
        // Try to find and click submit button
        const submitTexts = ['submit', 'send', 'join', 'sign up', 'book', 'continue', 'join the line'];
        let submitButton = null;
        
        for (const button of submitButtons) {
            const text = button.text.toLowerCase();
            if (submitTexts.some(submitText => text.includes(submitText))) {
                console.log(`Found potential submit button: ${button.text}`);
                submitButton = button;
                break;
            }
        }
        
        if (submitButton) {
            console.log('Clicking submit button...');
            try {
                // Try clicking by text content first
                await page.evaluate((text) => {
                    const elements = Array.from(document.querySelectorAll('button, input[type="submit"]'));
                    const element = elements.find(el => el.textContent.trim().toLowerCase().includes(text.toLowerCase()));
                    if (element) element.click();
                }, submitButton.text);
            } catch (e) {
                // Fallback to selector
                try {
                    await page.click(`button:has-text("${submitButton.text}")`);
                } catch (e2) {
                    await page.click(`input[type="submit"]`);
                }
            }
            await page.waitForTimeout(1000);
            
            console.log('Form submitted successfully!');
            return { success: true, fieldsFilled, message: 'Successfully submitted to waitlist!' };
        } else {
            console.log('No submit button found');
            return { success: false, fieldsFilled, message: 'Submit button not found' };
        }
        
    } catch (error) {
        console.error('Error in automation:', error);
        throw error;
    } finally {
        // Always reset the flag and close browser
        isAutomationRunning = false;
        console.log('✅ Automation completed - flag reset');
        
        if (browser) {
            await browser.close();
        }
    }
}

// Cron job to check scheduled bookings every 10 seconds for precise timing
cron.schedule('*/10 * * * * *', async () => {
    // Don't run if automation is already running
    if (isAutomationRunning) {
        console.log('⏸️ Skipping scheduled check - automation already running');
        return;
    }

    const now = new Date();
    const dueBookings = scheduledBookings.filter(booking => 
        booking.status === 'scheduled' && new Date(booking.scheduleTime) <= now
    );
    
    for (const booking of dueBookings) {
        console.log(`Executing scheduled booking: ${booking.id} at ${now.toISOString()}`);
        try {
            await submitToWaitWhile(booking);
            booking.status = 'executed';
            console.log(`✅ Scheduled booking ${booking.id} executed successfully`);
        } catch (error) {
            console.error(`❌ Error executing scheduled booking ${booking.id}:`, error);
            booking.status = 'failed';
        }
    }
});

// API endpoint to get scheduled bookings status
app.get('/api/scheduled-bookings', (req, res) => {
    res.json({ 
        scheduledBookings: scheduledBookings.map(booking => ({
            id: booking.id,
            firstName: booking.firstName,
            lastName: booking.lastName,
            course: booking.course,
            scheduleTime: booking.scheduleTime,
            status: booking.status
        })),
        isAutomationRunning: isAutomationRunning
    });
});

app.listen(PORT, () => {
    console.log(`Torrey Pines Automator running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to use the app`);
});
