# PetPal 🐾

**An AI-powered pet care assistant with a stunning, Behance-inspired UI.**

[![Built with Bolt.new](https://img.shields.io/badge/Built%20with-Bolt.new-4A90E2?style=for-the-badge&logo=lightning&logoColor=white)](https://bolt.new)
[![World's Largest Hackathon](https://img.shields.io/badge/World's%20Largest-Hackathon-F28C38?style=for-the-badge&logo=trophy&logoColor=white)](#WorldsLargestHackathon)

## 🌟 Overview

PetPal is a mobile-first web application designed to revolutionize pet care through AI-powered assistance and beautiful user experience. Built for pet owners who want to provide the best care for their furry friends, PetPal combines intelligent recommendations with an intuitive, visually stunning interface.

Inspired by the [Behance Pet Care Website Design](https://www.behance.net/gallery/222988175/Pet-Care-Website-Design-E-commerce), PetPal features a sophisticated UI that balances professionalism with pet-friendly warmth, creating an engaging experience that makes pet care both enjoyable and effective.

**🚀 Live Demo:** [https://resilient-haupia-78fece.netlify.app](https://resilient-haupia-78fece.netlify.app)

## ✨ Features

### 🐾 **Pet Profiles**
Create detailed profiles for your pets including breed, age, and health conditions for personalized care recommendations.

### 💡 **AI Care Tips**
Get intelligent, breed-specific care advice powered by AI algorithms. Tips cover diet, exercise, grooming, and general health maintenance.

### 📊 **Health Tracking**
Log symptoms, weight changes, and health observations with AI-powered suggestions for when to contact your veterinarian.

### 🏥 **Vet Finder**
Discover nearby veterinary clinics with ratings, specialties, emergency services, and contact information (mock data for demo).

### 🔔 **Reminders & Paw Points**
Set care task reminders and earn Paw Points for consistent pet care habits. Gamification meets responsibility!

### 🎨 **Beautiful UI**
- **Landing Page**: Behance-inspired design with hero sections and feature showcases
- **Glassmorphic Elements**: Modern, translucent design components
- **Smooth Animations**: Confetti celebrations, wagging tails, and hover effects
- **Responsive Design**: Mobile-first approach with desktop optimization

## 🎨 UI Design

PetPal features a carefully crafted design system:

- **Color Palette**: Rich orange (#F28C38), soft blue (#4A90E2), soft green (#A8D5BA), beige (#F5E8C7), clean white (#FFFFFF)
- **Typography**: Poppins font family for modern, readable text
- **Components**: Rounded cards (12px border-radius) with soft shadows
- **Animations**: Subtle zoom effects, confetti celebrations, and pet-themed micro-interactions
- **Accessibility**: High contrast ratios (WCAG 2.1 compliant) and keyboard navigation

## 🛠️ Technologies

- **Platform**: [Bolt.new](https://bolt.new) - AI-powered development environment
- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React
- **Storage**: localStorage for user data persistence
- **Deployment**: Netlify
- **Design Inspiration**: [Behance Pet Care Website Design](https://www.behance.net/gallery/222988175/Pet-Care-Website-Design-E-commerce)

## 🚀 Setup & Run Instructions

### View Live Demo
Simply visit: [https://resilient-haupia-78fece.netlify.app](https://resilient-haupia-78fece.netlify.app)

### Run Locally
1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd petpal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

**Note**: PetPal uses localStorage for data persistence, so no backend setup is required. All user data (profiles, health logs, reminders, points) is stored locally in your browser.

## 🎯 Challenges & Solutions

### **Challenge 1: Database Integration**
Initially planned to use Supabase for data persistence, but pivoted to localStorage due to integration complexity within the hackathon timeframe.

**Solution**: Implemented a robust localStorage system with user-specific data keys, maintaining full functionality while ensuring data persistence across sessions.

### **Challenge 2: UI Balance**
Balancing sophisticated design with pet-friendly appeal required careful consideration of colors, animations, and user experience.

**Solution**: Adopted a Behance-inspired design system with professional aesthetics enhanced by playful pet-themed animations and warm color accents.

### **Challenge 3: Mobile-First Responsive Design**
Ensuring optimal experience across all device sizes while maintaining design integrity.

**Solution**: Implemented mobile-first approach with Tailwind CSS, using responsive breakpoints and flexible layouts.

## 🔮 Future Plans

- **🗄️ Database Integration**: Migrate from localStorage to Supabase for cloud data persistence
- **🔐 Authentication**: Implement Google OAuth for seamless user login
- **📍 Real Vet Directory**: Integrate with Google Places API for actual veterinary clinic data
- **📱 Mobile Apps**: Develop native iOS and Android applications
- **💰 Monetization**: Premium features, vet partnerships, and pet product recommendations
- **🤖 Enhanced AI**: More sophisticated AI models for health predictions and care recommendations

## 🏆 Hackathon Context

PetPal was built for the **World's Largest Hackathon**, targeting the **Most Beautiful UI** prize category. The application showcases:

- Modern, Behance-inspired design principles
- Sophisticated color theory and typography
- Smooth animations and micro-interactions
- Mobile-first responsive design
- Accessibility compliance

**📝 Devpost Submission**: [Devpost Link] *(placeholder)*

## 📸 Screenshots

### Landing Page
*Behance-inspired hero section with AI-powered pet care introduction*
![Landing Page Screenshot](screenshots/landing-page.png)

### Home Dashboard
*Clean, card-based interface with pet profile and action buttons*
![Home Screen Screenshot](screenshots/home-screen.png)

### AI Care Tips
*Intelligent recommendations with voice playback functionality*
![Care Tips Screenshot](screenshots/care-tips.png)

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues, feature requests, or pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 Acknowledgments

- **Design Inspiration**: [Behance Pet Care Website Design](https://www.behance.net/gallery/222988175/Pet-Care-Website-Design-E-commerce)
- **Development Platform**: [Bolt.new](https://bolt.new) for AI-powered development
- **Icons**: [Lucide React](https://lucide.dev) for beautiful, consistent icons
- **Deployment**: [Netlify](https://netlify.com) for seamless hosting

---

**Built with ❤️ for pets**

Share your feedback on X: [#WorldsLargestHackathon](https://twitter.com/intent/tweet?text=Check%20out%20PetPal%20-%20an%20AI-powered%20pet%20care%20assistant!%20%23WorldsLargestHackathon&url=https://resilient-haupia-78fece.netlify.app)