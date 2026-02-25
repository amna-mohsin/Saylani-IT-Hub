# 🏢 Saylani IT Hub

<div align="center">

**A Centralized Campus Management & Community Resource Platform**

*Streamlining campus life through lost & found tracking, volunteer management, and digital notes.*

[Features](#-features) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Database](#-database-schema) • [License](#-license)

</div>

---

## 📖 About

**Saylani IT Hub** is a comprehensive community portal designed to bridge the gap between students and campus administration. Built with a modern tech stack, it provides a one-stop solution for managing daily campus activities, from reporting lost items to logging volunteer hours and filing formal complaints.

### Why Saylani IT Hub?

- 🔐 **Secure Access**: Integrated with Supabase for robust authentication.
- 📦 **Resource Tracking**: Dedicated modules for Lost & Found items.
- 📝 **Productivity**: Built-in notes system to keep track of academic and personal tasks.
- 🤝 **Community Focused**: Direct portal for volunteer registration and activity logging.
- 🌙 **Modern UI**: Full dark mode support with fluid animations.

---

## ✨ Features

### 🔐 Authentication (Supabase)
- **Secure Sign-up & Login**: Managed entirely through Supabase Auth.
- **User Profiles**: Automatic profile creation in the `profiles` table upon registration.
- **Session Management**: Persistent login states for a seamless user experience.

### 📦 Lost & Found Management
- **Report & Track**: Post details about lost or found items.
- **Status Updates**: Track items through "Pending," "Matched," and "Resolved" states.
- **Item Matching**: Easily view found items that match your lost reports.

### 📝 Smart Notes System
- **Categorization**: Organize notes by Academic, Work, Personal, or Volunteer categories.
- **Rich Interface**: Search and filter through your notes instantly.
- **Persistence**: All notes are saved to your account for access anywhere.

### ⚠️ Complaint Portal
- **Formal Reporting**: File complaints regarding campus facilities or services.
- **Status Tracking**: Monitor the progress of your complaints from "Active" to "Resolved."

### 👥 Volunteer Hub
- **Hour Tracking**: Log your service hours and track your community impact.
- **Recognition**: View upcoming opportunities and track your participation history.

---

## 🚀 Tech Stack

| Component | Technology | Role |
|-----------|-----------|------|
| **Frontend** | React 18 | UI Library |
| **Styling** | Tailwind CSS | Utility-first Styling |
| **Backend** | Supabase | Auth & Database |
| **Animations**| Framer Motion | Fluid Transitions |
| **Icons** | Lucide React | Consistent Iconography |
| **Build Tool**| Vite | Fast Development & Bundling |

---

## 🏗️ Project Structure


```

saylani-it-hub/
├── src/
│   ├── components/    # Reusable UI elements (Layout, Navbar, etc.)
│   ├── contexts/      # AuthContext.jsx for Supabase state
│   ├── lib/           # supabase.js configuration
│   ├── pages/         # Dashboard, Complaints, LostFound, Notes
│   └── App.jsx        # Main routing logic
├── public/            # Static assets and icons
├── https://www.google.com/search?q=LICENSE            # Custom MIT License
└── tailwind.config.js # Custom theme and color configurations

```

---

## 🚀 Installation

### Prerequisites
- **Node.js**: v16.0 or higher
- **NPM/Yarn**
- **Supabase Account**: To handle Auth and Database

### Step 1: Clone the Repository
```bash
git clone [https://github.com/amna-mohsin/Saylani-IT-Hub.git](https://github.com/amna-mohsin/Saylani-IT-Hub.git)
cd Saylani-IT-Hub

```

### Step 2: Install Dependencies

```bash
npm install

```

### Step 3: Environment Configuration

Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

```

### Step 4: Run Development Server

```bash
npm run dev

```

---

## 📊 Database Schema

The application uses **Supabase (PostgreSQL)**. Currently, the authentication logic is linked to a centralized profile system:

* **`profiles` Table**: Stores user-specific data linked via `user_id` to Supabase Auth.
* **Other Tables**: `lost_items`, `complaints`, `notes`, and `volunteers` handle the core application logic.

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn and create.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under a **Custom MIT License with Attribution**.

**Copyright (c) 2024 Amna Mohsin**

> **Note:** Any use or distribution of this software must include clear attribution to the original author, **Amna Mohsin**, in the source code, UI "About" sections, and documentation. See the [LICENSE](https://www.google.com/search?q=LICENSE) file for the full text.

---

## 👥 Author

* **Amna Mohsin** - *Lead Developer* - [GitHub Profile](https://github.com/amna-mohsin)
* For inquiries or collaboration: [LinkedIn](https://www.linkedin.com/in/amna-m98/)

<div align="center">

**Made with ❤️ for the Saylani IT Community**

</div>

