# 🎯 FocusFlow AI v2

**An intelligent daily planner with AI-powered scheduling**

Modern web application built with Next.js 14, TypeScript, and Tailwind CSS. Features Notion+Apple design aesthetics with smart AI planning capabilities.

![Version](https://img.shields.io/badge/version-2.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Features

- 🧠 **AI-Powered Planning** - Intelligent schedule generation based on energy levels, deadlines, and preferences
- ⚡ **Energy-Based Optimization** - Tasks scheduled according to your natural energy curve
- 🔄 **Smart Transitions** - Automatic breaks, meals, and buffer time between activities
- 📊 **Workload Balancing** - Prevents overload with intelligent task distribution
- 🎨 **Beautiful UI** - Notion + Apple minimalist design with smooth animations
- 📱 **Fully Responsive** - Perfect experience on desktop, tablet, and mobile

## 🚀 Quick Start

### Installation

```bash
cd d:/projet1/focusflow-ai-v2

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access the App

```
http://localhost:3000
```

**Demo Credentials:**
```
Email: asmae@focusflow.ai
Password: demo123
```

## 📁 Project Structure

```
focusflow-ai-v2/
├── src/
│   ├── app/
│   │   ├── login/           # Authentication
│   │   ├── dashboard/       # Main dashboard
│   │   │   ├── generate/    # AI generation page
│   │   │   ├── tasks/       # Task management
│   │   │   └── settings/    # User preferences
│   │   └── api/
│   │       └── ai/          # AI endpoints
│   ├── components/
│   │   ├── layout/          # Sidebar, Header
│   │   ├── tasks/           # TaskCard
│   │   └── ui/              # Reusable components
│   ├── lib/
│   │   ├── mcp/             # AI planning engine
│   │   └── types.ts         # TypeScript interfaces
│   └── data/
│       └── demo-data.ts     # Sample data
├── public/
└── docs/
```

## 🎨 Design System

### Colors

```css
Primary:    #3B82F6 (Blue)
Secondary:  #1E293B (Slate)
Accent:     #10B981 (Emerald)
Background: #F8FAFC (Light Gray)
```

### Typography

- **Sans**: Inter
- **Display**: SF Pro Display

## 🤖 AI Planning Engine

### Features

1. **Task Analysis**
   - Priority-based sorting
   - Deadline awareness
   - Complexity estimation

2. **Time Allocation**
   - Smart block scheduling
   - Buffer management
   - Conflict resolution

3. **Transition Management**
   - 15-min breaks after deep work
   - Automatic lunch scheduling (12:00-13:00)
   - 5-min buffers between meetings/calls

4. **Energy Optimization**
   - Morning boost (9-11 AM)
   - Post-lunch dip compensation
   - Afternoon recovery
   - Late day adjustment

### API Endpoints

```
POST /api/ai/generate      # Generate planning
POST /api/ai/regenerate    # Regenerate with variations
```

## 📄 Pages

### 1. Login (`/login`)
- Clean authentication UI
- Login/Register tabs
- Demo credentials display

### 2. Dashboard (`/dashboard`)
- Personalized greeting
- Stats cards (Tasks, Hours, Completed)
- Quick actions
- Schedule preview

### 3. AI Generate (`/dashboard/generate`)
- Time range configuration
- Energy level slider (0-100%)
- Focus capacity selector
- Preferences (breaks, meals, deep work)
- Constraints input

### 4. Tasks & Goals (`/dashboard/tasks`)
- Task management (CRUD)
- Priority, energy, focus level
- Deadline tracking
- Modal form for add/edit

### 5. Settings (`/dashboard/settings`)
- Light/Dark theme toggle
- Morning/Evening person preference
- Peak productivity hours
- Default durations

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **Storage** | localStorage |
| **AI Logic** | Custom planning engine |

## 💾 Data Storage

### localStorage Keys

```
focusflow_user                    # Current user
focusflow_tasks_{userId}          # User tasks
focusflow_schedule_{userId}_{date} # Daily schedule
```

### Data Models

```typescript
interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  energyRequired: 'high' | 'medium' | 'low';
  focusLevel: 'deep' | 'medium' | 'light';
  deadline?: string;
  notes?: string;
}

interface TimeBlock {
  start: string;  // "09:00"
  end: string;    // "10:30"
  type: 'task' | 'break' | 'meal' | 'deep-work';
  title: string;
  energy: 'high' | 'medium' | 'low';
}
```

## 🎯 User Workflow

1. **Login** → Sign in with demo credentials
2. **Dashboard** → View stats and quick actions
3. **Add Tasks** → Create tasks with details
4. **Configure** → Set energy level, preferences
5. **Generate** → AI creates optimized schedule
6. **Review** → View timeline with transitions
7. **Regenerate** → Create alternative schedules

## 🔧 Development

### Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

### Environment

No environment variables needed - works out of the box with localStorage.

## 📈 Future Enhancements

- [ ] Real LLM integration (OpenAI/Claude)
- [ ] PostgreSQL/MongoDB database
- [ ] Google Calendar sync
- [ ] Team collaboration
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] Template library
- [ ] Export to PDF/iCal

## 📝 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

**ASMAE**

Built with ❤️ using modern web technologies.

---

**Ready to boost your productivity? Start planning smarter with FocusFlow AI! 🚀**
