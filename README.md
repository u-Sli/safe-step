SafeStep – A Women’s Safety Mobile App
Problem Statement
In South Africa and many other parts of the world, women face daily safety risks while commuting, walking alone, or navigating unfamiliar areas. There is a lack of real-time safety guidance, community-driven awareness, and quick-response systems made specifically for women. Most safety apps are generic, do not validate users, and lack smart prevention tools. This creates an urgent need for a women-only, verified, smart safety platforms.
Solution: SafeStep
SafeStep is a mobile safety app designed exclusively for women that uses real-time data, community reports, and smart safety tools to help users navigate safer routes, send rapid SOS alerts, and connect with trusted contacts. The app also includes a South African ID-based gender verification system to maintain a secure, women-only space.
Core Features
Women-Only Registration via SA ID Validation
•	Requires users to enter their South African ID number during sign-up.
•	Extracts digits 7–10 to determine gender:
•	- If 0000–4999 → Female (Access Granted)
•	- If 5000–9999 → Male (Access Denied)
•	Ensures platform is exclusive to verified women, improving trust and safety.
Smart Safe Route Finder
•	Interactive map with color-coded route safety levels (Green = safer, Red = risk zones).
•	Integrates live data from community reports and crime patterns.
•	Offers “Safest Route” option alongside shortest/fastest.
SOS Emergency Button
•	Sends live GPS location to emergency contacts and nearest police station.
•	Triggers optional silent audio/video recording during emergencies.
Guardian Mode
•	Let’s users share their live location with trusted contacts while traveling.
•	Option for “I’ve arrived safely” notifications.
•	Timer-based check-ins prompt users if they haven’t confirmed their safety.
Community Safety Feed
•	Users can report incidents like harassment, poor lighting, suspicious activity.
•	Map pins show recent reports (auto-expire after 48 hours).
•	Like/upvote system to validate report credibility.
Bonus & Unique Features
Fake Call Function
Simulates a realistic phone call from a friend or relative to escape awkward or dangerous encounters.
Panic Phrase Activation
A secret keyword or phrase (e.g., “I forgot my charger”) activates the SOS function silently.
Safety Education Hub
Tips, video clips, and guides on self-defense, safety rights, and situational awareness. Along with community chatrooms.


Offline Safety Mode
•	Download safe maps that include safe zones such as police stations, clinics for navigation without internet access. 
•	Emergency SOS that uses a SMS-based messaging to send the user’s last known location to the added emergency contacts and authorities.
•	Offline journal whereby the user can log any encounters and when back online, these entries can be reported
Battery Saving Mode
Lightweight version disables visuals but keeps tracking and SOS active.
Technology that can be utilized
Feature	Technology/Tool
Mobile Framework	React Native
Maps & Navigation	Google Maps API / react-native-maps
Real-Time Database	Firebase Realtime DB
Authentication	Firebase Auth / Custom SA ID logic
Push Notifications	Firebase Cloud Messaging
Location Services	react-native-geolocation-service
Audio/Video Recording (SOS)	react-native-camera, AudioRecord
Storage & Offline Sync	AsyncStorage / SQLite
Future Ideas & Scalability
•	Expand to other countries with local ID-based verification
•	Partner with local law enforcement for verified report input
•	Add AI-based threat zone prediction based on past data
Impact
SafeStep aims to:
- Create a community of empowered women who support each other.
- Reduce the risk of harm through prevention, awareness, and fast intervention.
- Offer a practical, data-driven tool to navigate daily life more confidently.
