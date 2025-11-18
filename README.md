# EduTrack AI 🎓

A comprehensive student registration and attendance management system powered by **Google Gemini AI** for intelligent insights and reporting.

## 🚀 Technology Stack

### Core Framework
- **React 18**: Frontend library for building the user interface.
- **TypeScript**: For type-safe code and better developer experience.
- **Vite**: Fast build tool and development server (implied environment).

### Styling & Design
- **Tailwind CSS**: Utility-first CSS framework.
- **Glassmorphism**: Custom CSS implementation for translucent cards, mesh gradients, and blur effects.
- **Lucide React**: Modern, consistent icon set.
- **Font**: Plus Jakarta Sans via Google Fonts.

### AI & Data
- **Google GenAI SDK (`@google/genai`)**: Direct integration with Google's Gemini 2.5 Flash model.
- **Recharts**: Composable charting library for React.
- **React Context API**: Built-in global state management for Student and Attendance data.

---

## 🛠 How It Works

### 1. Intelligent Dashboard (AI-Powered)
The heart of the application is the Dashboard, which aggregates real-time data.
- **Gemini Integration**:
  - When clicking "Generate Insights", the app sends anonymized attendance statistics to the **Gemini 2.5 Flash** model.
  - **Narrative Analysis**: The model generates a 3-paragraph executive summary of attendance trends.
  - **Risk Identification**: The app requests a structured JSON response from Gemini to identify students with >20% absenteeism, flagging them as "At Risk" with a generated reason.
- **Visualization**: Uses Recharts to render interactive Pie and Bar charts based on live context data.

### 2. Glassmorphic Design System
The UI features a modern "Glass" aesthetic:
- **Mesh Gradients**: Dynamic, multi-colored background gradients that shift based on position.
- **Frosted Glass**: UI cards use `backdrop-filter: blur()` and semi-transparent white backgrounds to create depth.
- **Interactivity**: Hover effects, smooth transitions, and custom loader animations enhance the user experience.

### 3. Student Registration
- A dedicated form for onboarding new students.
- Validates input and updates the global `AppContext`.
- Automatically assigns a unique ID and registration timestamp.

### 4. Attendance Management
- **Daily View**: Filter students by grade to mark attendance efficiently.
- **Status Types**: Supports Present, Absent, Late, and Excused statuses.
- **Visual Feedback**: Color-coded buttons and status pills provide immediate visual confirmation.
- **Data Persistence**: Records are saved to the in-memory application state (mock database).

## 📦 Project Structure

```
/
├── components/       # Reusable UI components (Navbar, etc.)
├── context/          # Global state management (AppContext)
├── pages/            # Main application views (Dashboard, Students, etc.)
├── services/         # External service integrations (Gemini AI)
├── types.ts          # TypeScript interfaces and definitions
├── index.html        # Entry HTML with global CSS & Tailwind config
└── App.tsx           # Root component and Routing logic
```

## 🔑 Setup

To enable AI features, ensuring a valid API key is present in the environment variables (`process.env.API_KEY`) is required. The application handles the `GoogleGenAI` client initialization safely within `services/geminiService.ts`.
