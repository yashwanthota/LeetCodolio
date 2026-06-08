# LeetCodolio

LeetCodolio is a full-stack web application designed to fetch, display, and compare LeetCode profiles side-by-side. It allows users to gain insights into competitive programming progress by comparing two users' total solved questions, active days, global rankings, badges, skill proficiencies, and recently solved problems.

The project is structured as a monorepo containing a Node.js/Express backend and a React frontend.

## Project Structure

- `backend/`: A Node.js and Express server that uses Puppeteer and the Kernel SDK to scrape data directly from LeetCode public profiles.
- `frontend/`: A React web application that consumes the backend API to visualize the data using Chart.js.

---

## Detailed Code Explanation

### Backend

The backend is built with Express.js and serves as a scraping API. LeetCode does not provide an official public API for fetching comprehensive user statistics, so this backend programmatically navigates to a user's LeetCode profile page to extract the necessary data.

**Key Technologies:**
- `express`: Handles the HTTP routing.
- `puppeteer-core` & `@onkernel/sdk`: Used for headless browser automation. The Kernel SDK is utilized to spin up remote browser instances to bypass rate limiting or CAPTCHAs that might block standard Puppeteer scripts.
- `cors`: Enables Cross-Origin Resource Sharing so the React frontend can fetch data without security blocks.

**Core Logic (`backend/index.js`):**
1. **Express Server Setup**: Initializes an Express app listening on port 5000 and configures CORS and JSON parsing.
2. **WebScrape Function**: This is the core data extraction function. 
   - It connects to a remote browser provided by the Kernel SDK using the API key.
   - It navigates to `https://leetcode.com/{username}` and waits for specific DOM elements to load.
   - Using `page.evaluate()`, it parses the DOM to extract data such as Total Attempted Questions, Section Attempted (Easy/Medium/Hard breakdown), Profile Rank, Active Days, Badges, Skills, and Recently Solved Questions.
   - If the scrape fails (due to invalid username or network issues), the code catches the error and provides a fallback to a local `dummy.json` file to ensure the application doesn't crash during demonstrations.
3. **API Endpoints**:
   - `GET /scrape/:username`: Calls the `WebScrape` function and returns the structured JSON data to the client.
   - `GET /dummy/:user`: An alternative endpoint to force-fetch local dummy data for testing purposes.

### Frontend

The frontend is a single-page application built with React that focuses on rendering the scraped data into a visually appealing comparison dashboard.

**Key Technologies:**
- `react`: Core UI framework.
- `axios`: Used for making HTTP requests to the backend API.
- `chart.js` & `react-chartjs-2`: Used to render Doughnut charts for question difficulty breakdown and Bar charts for skills proficiency.
- `react-toastify`: Provides sleek popup notifications for success or error states.

**Core Logic (`frontend/src/Scrape.jsx`):**
1. **State Management**: Uses React `useState` to manage inputs for two usernames, store fetched profile data, handle loading states (spinner), and toggle between the empty state and comparison mode.
2. **Data Fetching**: The `FetchData` function uses `axios.all` to fetch both usernames concurrently from the backend. It includes error handling that defaults to local demo data if the backend server is unresponsive.
3. **Comparison Logic**: The component calculates differences between the two profiles to highlight the "winner" in various metrics (Total Questions, Active Days, Rank). It renders winner badges based on these calculations.
4. **Data Visualization**: 
   - **Doughnut Chart**: Maps the `SectionAttempted` array to display the distribution of Easy, Medium, and Hard questions solved.
   - **Bar Chart**: Maps the `Skills` and `elements` arrays to show a proficiency bar chart for tags like "Array", "String", "Dynamic Programming", etc.
5. **Conditional Rendering**: Depending on the state of the application, it renders either an empty state with instructions, a loading spinner, or the full comparison dashboard featuring a summary grid and detailed individual profile cards.

---

## Installation and Setup Guide

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn
- A Kernel API Key for remote browser scraping (get one from OnKernel)

### 1. Clone the Repository

```bash
git clone https://github.com/KompallyAkhil/LeetCodolio.git
cd LeetCodolio
```

### 2. Backend Setup

Open a terminal window and navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add your Kernel API key:
```env
KERNEL_API_KEY=your_kernel_api_key_here
```

Start the backend server:
```bash
# For development with nodemon
npm run dev

# Or for standard startup
npm start
```
The backend server will run on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal window and navigate to the frontend directory from the project root:

```bash
cd frontend
npm install
```

Start the React application:
```bash
npm start
```
The frontend application will open in your default browser at `http://localhost:3000`.

---

## Usage

1. Open the frontend application in your browser.
2. Enter a valid LeetCode username in the "First Username" field.
3. Enter another valid LeetCode username in the "Second Username" field.
4. Click "Compare Profiles" (or press Enter).
5. The application will fetch the live data from LeetCode and display a comprehensive side-by-side comparison of the two users' coding statistics and skills.
6. If the backend is not running, you can click "Try Demo Data" to test the UI using local mock data.
