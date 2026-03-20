# NewsTally React Project 🚀

Aapki HTML website ko React mein convert kiya gaya hai!

## 📁 Project Structure

```
newstally-react/
├── src/
│   ├── pages/
│   │   ├── Socialgati.jsx    ← index.html (main community feed)
│   │   ├── NewsTally.jsx     ← newstally.html (news page)
│   │   ├── NewsOpen.jsx      ← newstallyopen.html (article detail)
│   │   ├── About.jsx         ← about.html
│   │   ├── Contact.jsx       ← contact.html
│   │   ├── Help.jsx          ← help.html
│   │   ├── Links.jsx         ← links.html
│   │   ├── Privacy.jsx       ← privacy.html
│   │   ├── Terms.jsx         ← terms.html
│   │   └── Sarju.jsx         ← sarju.html (AI assistant)
│   ├── components/
│   │   ├── Header.jsx        ← Top navigation bar
│   │   ├── BottomNav.jsx     ← Mobile bottom navigation
│   │   ├── Footer.jsx        ← Site footer
│   │   ├── AuthModal.jsx     ← Sign in / Sign up modal
│   │   ├── TextPostModal.jsx ← Create post modal
│   │   └── Toast.jsx         ← Notification toast
│   ├── hooks/
│   │   ├── useAuth.js        ← Authentication logic
│   │   ├── useNews.js        ← News fetching with cache
│   │   └── useCommunity.js   ← Socialgati feed logic
│   ├── utils/helpers.js      ← Utility functions
│   ├── firebase.js           ← Firebase config
│   ├── App.jsx               ← Main app with routing
│   ├── main.jsx              ← Entry point
│   └── styles/global.css     ← All CSS styles
├── index.html
├── package.json
└── vite.config.js
```

## 🛠️ Setup Instructions

### 1. Node.js install karein
Download: https://nodejs.org (v18 ya usse baad)

### 2. Project folder mein jaayein
```bash
cd newstally-react
```

### 3. Dependencies install karein
```bash
npm install
```

### 4. Development server start karein
```bash
npm run dev
```

Browser mein khulega: http://localhost:5173

### 5. Production build (deploy ke liye)
```bash
npm run build
```
`dist/` folder mein aapka complete website hoga.

## 🌐 Deploy Options

### Vercel (Recommended - Free)
1. https://vercel.com par account banayein
2. GitHub par project push karein
3. Vercel mein import karein - automatic deploy!

### Netlify (Free)
1. https://netlify.com par jaayein
2. `dist` folder drag-and-drop karein

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## ✅ Features Converted

- ✅ Socialgati Community Feed (real-time Firebase)
- ✅ NewsTally News (Google Sheets + Firebase)
- ✅ News search with suggestions
- ✅ Category filter
- ✅ Image carousel
- ✅ Article detail page
- ✅ Share: WhatsApp, Twitter, Telegram, Copy Link
- ✅ Sign in/up (Google + Email)
- ✅ Post creation
- ✅ Like/Gati system
- ✅ Bookmark posts and articles
- ✅ Dark mode toggle
- ✅ Sarju AI chatbot
- ✅ About, Contact, Help, Links, Privacy, Terms pages
- ✅ Mobile-responsive design
- ✅ Bottom navigation
- ✅ Toast notifications
- ✅ News caching (5 min localStorage)
- ✅ React Router (SPA navigation)

## 🔥 Same Firebase Config
Aapka wahi Firebase project use ho raha hai:
- Project ID: newstally-df03c
- Google Sheets: Same API keys

## 📱 Routes (Old vs New)

| HTML File | React Route |
|-----------|-------------|
| index.html | / |
| newstally.html | /newstally |
| newstallyopen.html | /newstallyopen |
| about.html | /about |
| contact.html | /contact |
| help.html | /help |
| links.html | /links |
| privacy.html | /privacy |
| terms.html | /terms |
| sarju.html | /sarju |
