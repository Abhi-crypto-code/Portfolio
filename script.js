// Gemini AI Chatbot Integration for Portfolio Website

// Configuration and API setup
const GEMINI_API_KEY = 'AIzaSyD_JDHE4YNQeFeZj95L5QVI7dVCttGBez8'; // Your actual API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'; // Updated model endpoint

// Resume data in structured format for context
const resumeData = {
  basics: {
    name: "Abhishek Gonnade",
    education: "B.Tech Chemical Engineering with Minor in Computer Science at IIT Ropar",
    cgpa: "8.1 (Till Fifth Semester)",
    duration: "2022-2026",
    email: "2022chb1037@iitrpr.ac.in",
    profiles: {
      linkedin: "https://linkedin.com/in/abhishek-gonnade-846948255",
      github: "https://github.com/Abhi-crypto-code"
    }
  },
  skills: {
    programming: ["C/C++", "Python", "JavaScript"],
    machineLearning: ["TensorFlow", "Keras", "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
    webDevelopment: ["HTML", "CSS", "JavaScript"],
    tools: ["Git", "GitHub", "VS Code", "MATLAB", "Adobe Photoshop", "Adobe Illustrator"]
  },
  projects: [
    {
      title: "Soft-Sensor Design for Sulphur Recovery Unit",
      duration: "Apr 2024 - Dec 2024",
      description: "Developed soft sensors to estimate H2S and SO2 levels in the tail stream of a Sicilian Refinery's Sulphur Recovery Unit (SRU).",
      technologies: ["Python", "TensorFlow", "Keras", "Data Processing", "Machine Learning"],
      achievements: ["Achieved the best performance with LSTM (R²: 0.79) and Bi-LSTM (R²: 0.74)"]
    },
    {
      title: "Binary Image Classification",
      duration: "Sept 2024 - Oct 2024",
      description: "Designed and implemented a CNN for binary classification of dog and cat images.",
      technologies: ["CNN", "TensorFlow", "Deep Learning", "Image Classification"],
      achievements: ["Achieved over 90% accuracy on single predictions"]
    },
    {
      title: "Weather Application",
      duration: "Dec 2024 - Jan 2025",
      description: "Developed a responsive weather application using HTML, CSS, JavaScript, and the OpenWeatherMap API.",
      technologies: ["HTML", "CSS", "JavaScript", "API Integration", "Responsive Design"]
    },
    {
      title: "Simon Says Game",
      duration: "Jan 2025 - Feb 2025",
      description: "Built a 'Simon Says' memory game using HTML, CSS, and JavaScript.",
      technologies: ["HTML", "CSS", "JavaScript", "DOM Manipulation", "Game Development"]
    }
  ],
  responsibilities: [
    {
      title: "Coordinator",
      organization: "Monochrome Club, IIT Ropar",
      duration: "Aug 2023 - Apr 2024"
    },
    {
      title: "Co-Head",
      organization: "ADVITIYA 2023, IIT Ropar",
      duration: "Oct 2023 - Nov 2023"
    },
    {
      title: "Organizing Team Member",
      organization: "ADVITIYA 2024, IIT Ropar",
      duration: "Dec 2023 - Feb 2024"
    },
    {
      title: "Design and Creativity Team Member",
      organization: "ADVITIYA 2024, IIT Ropar",
      duration: "Dec 2023 - Feb 2024"
    },
    {
      title: "Member Graphic Design Team",
      organization: "Zeitgeist 2023, IIT Ropar",
      duration: "Feb 2023 - Mar 2023"
    },
    {
      title: "Member Graphic Design Team",
      organization: "ADVITIYA 2023, IIT Ropar",
      duration: "Feb 2023 - Mar 2023"
    }
  ]
};

// Toggle chatbot visibility
document.getElementById('chatbotToggle').addEventListener('click', function() {
  const chatbot = document.querySelector('.chatbot-container');
  chatbot.classList.toggle('active');
  
  const toggleIcon = document.querySelector('.toggle-icon');
  if (chatbot.classList.contains('active')) {
      toggleIcon.textContent = '▼';
  } else {
      toggleIcon.textContent = '▲';
  }
});

// Setup chatbot event listeners
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('sendMessage').addEventListener('click', sendMessage);
  document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Add a welcome message
  addMessage("Hello! I'm Abhishek's AI assistant. Ask me about his skills, experience, projects, or anything else!", 'bot-message');
});

// Function to send user message and get response
async function sendMessage() {
  const userInput = document.getElementById('userInput');
  const message = userInput.value.trim();
  
  if (message === '') return;
  
  // Display user message
  addMessage(message, 'user-message');
  
  // Show typing indicator
  showTypingIndicator();
  
  // Clear input field
  userInput.value = '';
  
  try {
    // First try to answer from structured resume data
    const localAnswer = getAnswerFromResumeData(message);
    
    if (localAnswer) {
      // Remove typing indicator and display local answer
      removeTypingIndicator();
      addMessage(localAnswer, 'bot-message');
    } else {
      // If no local answer, use Gemini API
      const geminiResponse = await queryGeminiAPI(message);
      
      // Remove typing indicator and display Gemini response
      removeTypingIndicator();
      addMessage(geminiResponse, 'bot-message');
    }
  } catch (error) {
    // Handle errors
    console.error('Error getting response:', error);
    removeTypingIndicator();
    addMessage("Sorry, I couldn't process your request at the moment. Please try again later.", 'bot-message');
  }
}

// Function to get answers from structured resume data
function getAnswerFromResumeData(message) {
  const query = message.toLowerCase();
  
  // Check for basic information
  if (query.includes('name') || query.includes('who are you')) {
    return `Abhishek Gonnade is a Chemical Engineering undergraduate with a minor in Computer Science at IIT Ropar.`;
  }
  
  // Check for education related queries
  if (query.includes('education') || query.includes('study') || query.includes('degree') || query.includes('cgpa') || query.includes('gpa')) {
    return `Abhishek is pursuing a B.Tech in Chemical Engineering with a Minor in Computer Science from IIT Ropar (2022-2026) with a CGPA of 8.1 till the fifth semester.`;
  }
  
  // Check for skills related queries
  if (query.includes('skill') || query.includes('know') || query.includes('capable')) {
    if (query.includes('programming') || query.includes('coding') || query.includes('code')) {
      return `Abhishek's programming skills include ${resumeData.skills.programming.join(', ')}.`;
    }
    
    if (query.includes('machine learning') || query.includes('ml') || query.includes('ai') || query.includes('data')) {
      return `For machine learning and data science, Abhishek is proficient in ${resumeData.skills.machineLearning.join(', ')}.`;
    }
    
    if (query.includes('web') || query.includes('frontend') || query.includes('html') || query.includes('css')) {
      return `Abhishek's web development skills include ${resumeData.skills.webDevelopment.join(', ')}.`;
    }
    
    // General skills query
    return `Abhishek's key skills include programming languages (${resumeData.skills.programming.join(', ')}), 
            machine learning & data science tools (${resumeData.skills.machineLearning.slice(0, 4).join(', ')} and more), 
            and web development (${resumeData.skills.webDevelopment.join(', ')}).`;
  }
  
  // Check for project related queries
  if (query.includes('project') || query.includes('work') || query.includes('portfolio')) {
    if (query.includes('machine learning') || query.includes('ml') || query.includes('ai')) {
      const mlProjects = resumeData.projects.filter(p => 
        p.technologies.some(tech => 
          ['machine learning', 'tensorflow', 'keras', 'cnn', 'deep learning'].includes(tech.toLowerCase())
        )
      );
      
      return `Abhishek has worked on machine learning projects including: ${mlProjects.map(p => p.title).join(', ')}.`;
    }
    
    if (query.includes('web') || query.includes('frontend') || query.includes('html') || query.includes('css')) {
      const webProjects = resumeData.projects.filter(p => 
        p.technologies.some(tech => 
          ['html', 'css', 'javascript', 'responsive design'].includes(tech.toLowerCase())
        )
      );
      
      return `Abhishek has developed web applications including: ${webProjects.map(p => p.title).join(', ')}.`;
    }
    
    // Return info about all projects
    return `Abhishek has worked on several projects including: ${resumeData.projects.map(p => p.title).join(', ')}.`;
  }
  
  // Check for contact or profile related queries
  if (query.includes('contact') || query.includes('email') || query.includes('reach') || query.includes('linkedin') || query.includes('github')) {
    let response = `You can contact Abhishek via email at ${resumeData.basics.email}`;
    
    if (query.includes('linkedin')) {
      response += ` or connect on LinkedIn at ${resumeData.basics.profiles.linkedin}`;
    } else if (query.includes('github')) {
      response += ` or check out his GitHub at ${resumeData.basics.profiles.github}`;
    } else {
      response += `. His LinkedIn profile is ${resumeData.basics.profiles.linkedin} and GitHub is ${resumeData.basics.profiles.github}`;
    }
    
    return response;
  }
  
  // Check for responsibility related queries
  if (query.includes('responsibility') || query.includes('position') || query.includes('role') || query.includes('leadership')) {
    return `Abhishek has held several positions including ${resumeData.responsibilities.map(r => r.title + ' at ' + r.organization).join(', ')}.`;
  }
  
  // If no match found, return null so we can use the Gemini API
  return null;
}

// Function to query Gemini API with improved error handling
async function queryGeminiAPI(message) {
  try {
    // Create context for Gemini API
    const context = `
      You are an AI assistant for Abhishek Gonnade, answering questions about his resume and professional background.
      
      Here's information about Abhishek:
      - Education: B.Tech Chemical Engineering with Minor in Computer Science at IIT Ropar (2022-2026), CGPA: 8.1
      - Skills: Programming (C/C++, Python, JavaScript), Machine Learning (TensorFlow, Keras, etc.), Web Development (HTML, CSS, JS)
      - Projects: Soft-Sensor Design for SRU, Binary Image Classification, Weather Application, Simon Says Game
      - Contact: Email: 2022chb1037@iitrpr.ac.in, LinkedIn: abhishek-gonnade-846948255, GitHub: Abhi-crypto-code
      
      Answer the following question as if you were Abhishek's personal AI assistant. Keep responses brief and friendly.
      Make sure to provide accurate information based on his resume, but you can be conversational.
      
      User question: ${message}
    `;
    
    // Log API request (for debugging)
    console.log('Calling Gemini API...');
    
    // Prepare API request matching the curl format exactly
    const requestBody = {
      contents: [{
        parts: [{
          text: context
        }]
      }]
    };
    
    // Call the API with proper handling
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    // Log response status for debugging
    console.log('API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error details:', errorText);
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API response structure:', JSON.stringify(data).substring(0, 150) + '...');
    
    // Extract text from response following the expected structure
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error('Unexpected API response structure:', data);
      return "I'm having trouble processing that information. Let me try a different approach.";
    }
    
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Try alternate API endpoint as fallback
    try {
      return await queryAlternateGeminiAPI(message);
    } catch (fallbackError) {
      console.error('Fallback API also failed:', fallbackError);
      
      // Use local fallback logic
      const fallbackAnswer = getBasicFallbackAnswer(message);
      if (fallbackAnswer) {
        return fallbackAnswer;
      }
      
      return "I'm currently experiencing connection issues. I can still answer basic questions about Abhishek's background without needing to connect to external services.";
    }
  }
}

// Alternate API endpoint as fallback
async function queryAlternateGeminiAPI(message) {
  // Try another model version as fallback
  const alternateApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  
  const context = `You are an AI assistant for Abhishek Gonnade. Answer this question about him: ${message}`;
  
  const response = await fetch(`${alternateApiUrl}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: context
        }]
      }]
    })
  });
  
  if (!response.ok) {
    throw new Error(`Alternate API request failed with status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.candidates && data.candidates[0] && data.candidates[0].content) {
    return data.candidates[0].content.parts[0].text;
  }
  
  throw new Error('Could not extract text from alternate API response');
}

// Fallback function for basic answers when API fails
function getBasicFallbackAnswer(message) {
  const query = message.toLowerCase();
  
  // Greetings
  if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
    return "Hello! I'm Abhishek's AI assistant. How can I help you today?";
  }
  
  // Thank you responses
  if (query.includes('thank') || query.includes('thanks')) {
    return "You're welcome! Let me know if you have any other questions about Abhishek.";
  }
  
  // Basic questions about the chatbot
  if (query.includes('who are you') || query.includes('what are you')) {
    return "I'm an AI assistant created to help answer questions about Abhishek Gonnade's education, skills, projects, and experience.";
  }
  
  // General fallback response
  return "I can tell you about Abhishek's education, skills, projects, and experience. What would you like to know?";
}

// Function to add message to chat
function addMessage(message, className) {
  const chatMessages = document.getElementById('chatMessages');
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message', className);
  messageElement.textContent = message;
  chatMessages.appendChild(messageElement);
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to show typing indicator
function showTypingIndicator() {
  const chatMessages = document.getElementById('chatMessages');
  const typingIndicator = document.createElement('div');
  typingIndicator.classList.add('chat-message', 'bot-message', 'typing-indicator');
  typingIndicator.innerHTML = '<span>.</span><span>.</span><span>.</span>';
  typingIndicator.id = 'typingIndicator';
  chatMessages.appendChild(typingIndicator);
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to remove typing indicator
function removeTypingIndicator() {
  const typingIndicator = document.getElementById('typingIndicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}