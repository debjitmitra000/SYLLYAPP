
# <div align="center">📚 SyllyApp 📚</div>
### <div align="center">*AI-Powered Syllabus Learning Assistant*</div>

[SYLLYAPP_.webm](https://github.com/user-attachments/assets/59ff76c6-2854-4e0b-89e2-309425ae110e)

## 💡 About The Project

**SyllyApp** is an AI-powered platform that simplifies studying by analyzing syllabus content and automatically gathering topic-wise resources. It fetches videos, articles, and generates notes using Gemini AI, YouTube API, and Google Search API. All content is compiled into a downloadable PDF for offline access. The system removes manual searching, saves time, and delivers structured, relevant learning materials. With a personalized approach, Syllyapp enhances study efficiency and brings a smart solution to modern learning challenges.

> "Transforming syllabus into comprehensive learning resources - all in one place."

## ✨ Key Features

<table>
  <tr>
    <td>
      <h3>🧠 Smart Syllabus Analysis</h3>
      <ul>
        <li>🔍 Gemini AI-powered topic breakdown</li>
        <li>📊 Intelligent content categorization</li>
        <li>📝 Auto-generated concise notes</li>
      </ul>
    </td>
    <td>
      <h3>🎮 Resource Aggregation</h3>
      <ul>
        <li>🎥 Topic-specific YouTube videos</li>
        <li>🌐 Relevant websites and articles</li>
        <li>📄 Downloadable PDF compilation</li>
        <li>💻 Offline access to all materials</li>
      </ul>
    </td>
  </tr>
</table>

## 🛠️ Technologies Used

<div align="center">
  
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />

  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini_AI-8E44AD?style=for-the-badge&logo=google&logoColor=white" />

  <img src="https://img.shields.io/badge/YouTube_Data_Api_V3-FF0000?style=for-the-badge&logo=youtube&logoColor=white" />
  <img src="https://img.shields.io/badge/Google_Coustom_Search_API-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/jsPDF-FA7343?style=for-the-badge&logo=javascript&logoColor=white" />

</div>

## 🚀 Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/debjitmitra000/SYLLYAPP.git
# 2. Navigate to the project directory
cd SYLLYAPP
# 3. Install backend dependencies
cd Backend
npm install
# 4. Create backend .env file with the following:
PORT=5000
GEMINI_API_KEY="your_gemini_api_key"
YT_API_KEY="your_youtube_api_key"
GOOGLE_API_KEY="your_google_api_key"
GOOGLE_CX="your_google_custom_search_engine_id"
CLIENT_SERVER=http://localhost:5173
# 5. Start the backend server
npm start
# 6. In a new terminal, navigate to the frontend directory
cd ../Frontend
# 7. Install frontend dependencies
npm install
# 8. Create frontend .env file with the following:
VITE_SERVER=http://localhost:5000
# 9. Start the frontend development server
npm run dev
# 10. Build for production
npm run build
```

## 🔍 How It Works


1. **Enter Your Syllabus**: Simple copy & paste your syllabus and subject
2. **AI Analysis**: Gemini AI processes the syllabus to identify key topics and concepts
3. **Multi-Source Resource Gathering**: 
   - YouTube Data API v3 finds educational videos with high ratings
   - Google Custom Search API locates authoritative articles and websites
   - Gemini AI generates comprehensive yet concise study notes
4. **Smart Organization**: All content is intelligently categorized by topic
5. **One-Click PDF Export**: Generate a structured, professional PDF containing all resources
6. **Learn Anywhere**: Use your personalized study guide online or offline

##
<div align="center">
  <img src="https://github.com/user-attachments/assets/b73f442a-2062-4bfd-a82e-e1a2fb777575" alt="workflow"/>
</div>


## 🌟 Benefits

- **Time-Saving**: Eliminates hours of manual searching for study materials
- **Personalized Learning**: Content perfectly aligned with your specific syllabus
- **Comprehensive Resources**: Videos, articles, and notes in one place
- **Offline Access**: Download all materials for studying without internet
- **Enhanced Understanding**: Multiple content formats for better comprehension
- **Quick Revision**: AI-generated notes for efficient exam preparation

---

<div align="center">
  <br>
  <p>From syllabus to structured learning resources in minutes</p>
  <a href="https://github.com/debjitmitra000/SYLLYAPP/stargazers">
    <img src="https://img.shields.io/badge/⭐_Star_This_Repo-171515?style=for-the-badge&logo=github&logoColor=white" alt="Star on GitHub"/>
  </a>
  <br><br>
  <sub>Built with ❤️ by Debjit Mitra</sub>
</div>

