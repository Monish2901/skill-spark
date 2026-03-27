# SkillSpark: Student Career & Assessment Platform

SkillSpark is a comprehensive, student-centric platform designed to bridge the gap between academic learning and industry readiness. It provides a centralized hub for technical skill assessments, discovered technical events, and a career opportunity board with an integrated application tracking system.

---

## 🏗️ Project Architecture

The project has been reorganized into a clean, 3-tier architecture to separate concerns and ensure professional standards:

*   **📁 `frontend/`**: The core User Interface.
    *   Built with **React.js (Vite)** and **TypeScript**.
    *   Styled using **Tailwind CSS** and **shadcn/ui** components.
    *   Contains more than 20 specific skill assessments, including Technical, Software, Hardware, and Communication modules.
*   **📁 `backend/`**: Serverless Logic & API Bridge.
    *   Managed through **Supabase Backend-as-a-Service (BaaS)**.
    *   Includes authentication handlers, real-time database connections, and Admin authorization logic.
*   **📁 `database/`**: Data Models & Configuration.
    *   Powered by a cloud-hosted **PostgreSQL** database.
    *   Includes SQL migration files, Supabase configuration (`config.toml`), and local seed scripts for the question banks.

---

## 🌟 Key Features

### 1. Skill Assessment Engine
*   **3-Level Progressive Evaluation**: Students must pass through Aptitude (Level 1), Theory (Level 2), and Practical (Level 3) assessments.
*   **Diverse Domains**: Supports Software (Java, Python, C++, Node.js), Hardware (Robotics, VLSI, PCB Design), and Common Skills (General Knowledge, Aptitude, Communication).
*   **Real-time Scoring**: Instant feedback upon completion of assessments.

### 2. Tech Events Hub
*   A curated portal for students to find national-level hackathons, coding contests, and robotics competitions.
*   Includes direct registration links and event details (mode, location, prizes).

### 3. Internship & Opportunity Board
*   Skill-based filtering for internships and career opportunities from top companies like Google, Microsoft, and ISRO.
*   **Application Tracking**: Students can track their application state (Saved, Applied, Interviewing, Offered) locally.

### 4. Admin Dashboard
*   **User Management**: Full visibility into registered users, their assessment progress, and performance metrics.
*   **Content Management**: Tools to add, edit, or delete questions and synchronize the local question bank with the live database.

---

## 🛠️ Technology Stack

*   **Framework**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Database**: [PostgreSQL (Supabase)](https://supabase.com/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **UI Components**: [shadcn/ui](https://ui.shadcn.com/)

---

## 🚀 Getting Started

To run the project locally, follow these steps:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Monish2901/skill-spark.git
    cd skill-spark
    ```

2.  **Install Dependencies**:
    ```bash
    cd frontend
    npm install
    ```

3.  **Setup Environment Variables**:
    Create a `.env` file inside the `frontend/` directory with your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Development Server**:
    From the root directory:
    ```bash
    npm run dev
    ```

---

## 📁 Project Structure

```text
skill-spark/
├── frontend/               # React frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   │   ├── assessment/ # MCQ, Theory, and Practical evaluation units
│   │   │   ├── ui/         # Modern shadcn/ui base components
│   │   │   └── ...         # DashboardHeader, SkillCard, and Nav elements
│   │   ├── hooks/          # Custom hooks (Auth state & Toast notifications)
│   │   ├── pages/          # Full application pages (Dashboard, Admin, Assessment)
│   │   ├── lib/            # Supabase instance & utility helper functions
│   │   ├── App.tsx         # Root routes and providers configuration
│   │   └── main.tsx        # Application entry point
│   ├── public/             # Static assets and media files
│   ├── vite.config.ts      # Vite configuration for React & TypeScript
│   └── package.json        # Frontend project dependencies
├── backend/                # Serverless architecture & API Bridge
│   └── README.md           # Documentation for project backend (Supabase)
├── database/               # Data Layer & Management
│   ├── scripts/            # Automated seeding and synchronization tools
│   ├── supabase/           # SQL Migrations and Supabase TOML configs
│   ├── check-db.js         # Connection health and schema validation
│   └── sync-real-db.js     # Data migration from local to live Supabase
├── package.json            # Root configuration for development scripts
└── README.md               # Main project documentation
```

---

## 👨‍💻 Developed By
**Monish2901** - [GitHub Profile](https://github.com/Monish2901)
