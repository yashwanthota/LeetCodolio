# LeetCode Profile Tracker - Frontend

A React-based web application for comparing LeetCode user profiles with beautiful visualizations and comprehensive analytics.

## 🚀 Features

- **Dual User Comparison**: Compare two LeetCode profiles side by side
- **Rich Visualizations**: Interactive charts including Doughnut and Bar charts
- **Performance Metrics**: Total questions, active days, profile rank comparison
- **Skills Analysis**: Detailed skills proficiency comparison
- **Recent Activity**: Recently solved questions display
- **Winner Highlights**: Visual indicators for winning metrics
- **Responsive Design**: Mobile-friendly interface
- **Demo Mode**: Automatic sample data for showcasing

## 🎭 Demo Mode

The app includes a demo button that automatically loads sample data from the backend when the scraping fails. This allows users to see the full functionality without needing real LeetCode usernames.

### Demo Data Features:
- **DemoUser1**: 847 total questions, 156 active days, rank #1250
- **DemoUser2**: 623 total questions, 98 active days, rank #2150
- Sample skills data, difficulty breakdowns, and recently solved questions
- Realistic badge images and profile information

### How Demo Mode Works:
1. **Click "🎭 Try Demo Data"** button
2. **Backend automatically provides** sample data when scraping fails
3. **Full app functionality** is demonstrated with realistic data
4. **No external dependencies** required for demo functionality

### Backend Dummy Data:
- Dummy data is stored in `backend/dummy.json`
- Automatically served when scraping fails
- Can be accessed directly via `/dummy/user1` and `/dummy/user2` endpoints
- Test with `node test-dummy.js` in backend directory

## 🛠️ Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
cd frontend
npm install
```

### Running Locally
```bash
npm start
```
The app will run on `http://localhost:3000`

### Building for Production
```bash
npm run build
```

## 🌐 Deployment

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy!

### Vercel
1. Import your GitHub repository
2. Framework preset: Create React App
3. Deploy!

### GitHub Pages
1. Add to package.json:
```json
"homepage": "https://yourusername.github.io/your-repo-name",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Deploy: `npm run deploy`

## 📱 Responsive Design

The app is fully responsive with breakpoints at:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 480px - 767px
- **Small Mobile**: < 480px

## 🎨 Customization

### Colors
The app uses a consistent color palette defined in `Scrape.jsx`:
- **Easy Problems**: Green (#10B981)
- **Medium Problems**: Orange (#F59E0B)
- **Hard Problems**: Red (#EF4444)
- **Skills**: Blue, Purple, Pink, Orange, Cyan, Green

### Styling
All styles are in `Scrape.css` with:
- Modern dark theme
- Smooth animations and transitions
- Glassmorphism effects
- Hover states and interactions

## 🔧 Configuration

### Environment Variables
- `NODE_ENV`: Set to 'production' for demo mode
- `REACT_APP_API_URL`: Backend API URL (optional for demo)

### Demo Mode Detection
The app automatically detects production deployment and loads demo data when:
- `NODE_ENV === 'production'` OR
- Hostname is not 'localhost'

## 📊 Data Structure

The demo data follows the same structure as the real LeetCode API:
```json
{
  "TotalAttempted": 847,
  "ActiveDays": 156,
  "ProfileRank": 1250,
  "NumberOfBadges": 12,
  "Badges": ["url1", "url2"],
  "SectionAttempted": [342, 0, 398, 0, 107],
  "Skills": ["Array", "String"],
  "elements": [156, 134],
  "RecentlySolveds": ["Two Sum", "Valid Parentheses"]
}
```

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Start development**: `npm start`
4. **Build for production**: `npm run build`
5. **Deploy to your preferred platform**

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
