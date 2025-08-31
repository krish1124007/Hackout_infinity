import React, { useState, useEffect } from 'react';
import './OrganizationForm.css';
import { useNavigate } from 'react-router';

const OrganizationForm = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState("");
  const [message, setMessage] = useState(''); // State for the custom message box
  const [isError, setIsError] = useState(false); // State to indicate if the message is an error
  const navigate = useNavigate();

  // Filtered questions - only keeping the important ones
  const questionCategories = [
    {
      title: "Business & Market",
      icon: "📊",
      questions: [
        {
          text: "Which industries are most likely to be early buyers?",
          type: "checkbox",
          options: ["Refineries", "Fertilizers", "Steel", "Transport", "Power Generation"]
        },
        {
          text: "What business model should we adopt?",
          type: "radio",
          options: ["B2B Contracts", "Partnerships", "Government Auctions", "Hybrid Approach"]
        },
        {
          text: "What renewable method of Energy should we adopt?",
          type: "radio",
          options: ['Solar Panel', 'Wind Power']
        },
      ]
    },
    {
      title: "Technology & Efficiency",
      icon: "🔧",
      questions: [
        {
          text: "Which electrolyzer technology gives the best efficiency vs. cost trade-off?",
          type: "radio",
          options: ["PEM", "Alkaline", "Solid Oxide", "Other"]
        },
        {
          text: "Can we integrate with renewable energy sources at low-cost locations?",
          type: "radio",
          options: ["Yes", "No", "Partially"]
        },
        {
          text: "What is the energy efficiency ratio (kWh/kg of H₂) of the chosen system?",
          type: "number",
          min: 40,
          max: 70,
          step: 0.1,
          unit: "kWh/kg"
        }
      ]
    },
    {
      title: "Energy & Infrastructure",
      icon: "⚡",
      questions: [
        {
          text: "How will we store and transport hydrogen?",
          type: "checkbox",
          options: ["Compressed", "Liquefied", "Ammonia Carriers", "Methanol Carriers", "Other"]
        },
        {
          text: "Is there existing pipeline / distribution infrastructure we can leverage?",
          type: "radio",
          options: ["Yes", "No", "Partial Infrastructure"]
        }
      ]
    },
    {
      title: "Financial & ROI",
      icon: "💰",
      questions: [
        {
          text: "What is the CapEx for different plant sizes?",
          type: "range",
          min: 500000,
          max: 5000000,
          step: 100000,
          unit: "INR"
        },
        {
          text: "Can we co-produce oxygen and sell it for extra revenue?",
          type: "radio",
          options: ["Yes", "No", "Potentially"]
        },
      ]
    },
  ];

  // Flatten all questions into a single array with category info
  const allQuestions = questionCategories.flatMap(category =>
    category.questions.map(question => ({
      ...question,
      category: category.title,
      icon: category.icon
    }))
  );

  const currentQuestion = allQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;

  // Assistant messages based on question type
  useEffect(() => {
    const messages = {
      radio: "Please select one option that best fits your situation.",
      checkbox: "Select all options that apply to your business.",
      text: "Please provide a detailed response based on your research.",
      number: "Enter a numerical value based on your calculations.",
      range: "Adjust the slider to indicate your estimate.",
      scale: "Rate this aspect of your business on the provided scale."
    };

    setAssistantMessage(messages[currentQuestion.type] || "Please provide your response.");
  }, [currentQuestionIndex, currentQuestion.type]);

  const handleAnswer = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleSubmit = async () => {
    // 1. Format the answers into a more readable JSON object
    const payload = Object.keys(answers).reduce((acc, index) => {
      const question = allQuestions[index].text;
      const answer = answers[index];
      acc[question] = answer;
      return acc;
    }, {});

    console.log("Final answers payload:", payload);
    const data = payload

    // 2. Make the POST request to the API
    try {
      const response = await fetch('https://hackout2025-backend-infinity.onrender.com/api/v1/user/findland', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),  // ✅ must be stringified
      });
      

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);

      // 3. Store the response in localStorage
      localStorage.setItem('apiResponseData', JSON.stringify(responseData));

      // 4. Show success message
      navigate('/dashboard');
      setIsError(false);

    } catch (error) {
      console.error("Failed to submit questionnaire:", error);
      setMessage("An error occurred. Please try again later.");
      setIsError(true);
    }
  };

  // Render appropriate input based on question type
  const renderInput = () => {
    const currentAnswer = answers[currentQuestionIndex];

    switch(currentQuestion.type) {
      case "radio":
        return (
          <div className="answer-options">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`option-row ${currentAnswer === option ? 'selected' : ''}`}
                onClick={() => handleAnswer(option)}
              >
                <input
                  type="radio"
                  className="option-input"
                  name="answer"
                  checked={currentAnswer === option}
                  onChange={() => {}}
                />
                <label className="option-label">{option}</label>
              </div>
            ))}
          </div>
        );

      case "checkbox":
        const selectedOptions = currentAnswer || [];
        return (
          <div className="answer-options">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`option-row ${selectedOptions.includes(option) ? 'selected' : ''}`}
                onClick={() => {
                  const newSelection = selectedOptions.includes(option)
                    ? selectedOptions.filter(item => item !== option)
                    : [...selectedOptions, option];
                  handleAnswer(newSelection);
                }}
              >
                <input
                  type="checkbox"
                  className="option-input"
                  checked={selectedOptions.includes(option)}
                  onChange={() => {}}
                />
                <label className="option-label">{option}</label>
              </div>
            ))}
          </div>
        );

      case "text":
        return (
          <textarea
            className="text-input"
            placeholder="Type your answer here..."
            rows="4"
            value={currentAnswer || ''}
            onChange={(e) => handleAnswer(e.target.value)}
          ></textarea>
        );

      case "number":
        return (
          <div className="number-input-container">
            <input
              type="number"
              className="number-input"
              min={currentQuestion.min}
              max={currentQuestion.max}
              step={currentQuestion.step}
              value={currentAnswer || ''}
              onChange={(e) => handleAnswer(e.target.value)}
            />
            {currentQuestion.unit && <span className="input-unit">{currentQuestion.unit}</span>}
          </div>
        );

      case "range":
        return (
          <div className="range-container">
            <input
              type="range"
              className="range-input"
              min={currentQuestion.min}
              max={currentQuestion.max}
              step={currentQuestion.step}
              value={currentAnswer || currentQuestion.min}
              onChange={(e) => handleAnswer(e.target.value)}
            />
            <div className="range-values">
              <span>{currentQuestion.min}{currentQuestion.unit}</span>
              <span className="range-current-value">{currentAnswer || currentQuestion.min}{currentQuestion.unit}</span>
              <span>{currentQuestion.max}{currentQuestion.unit}</span>
            </div>
          </div>
        );

      case "scale":
        return (
          <div className="scale-container">
            <div className="scale-options">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`scale-option ${currentAnswer === option ? 'selected' : ''}`}
                  onClick={() => handleAnswer(option)}
                >
                  <div className="scale-point"></div>
                  <span className="scale-label">{option}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <textarea
            className="text-input"
            placeholder="Type your answer here..."
            rows="4"
            value={currentAnswer || ''}
            onChange={(e) => handleAnswer(e.target.value)}
          ></textarea>
        );
    }
  };

  const MessageModal = ({ message, isError, onClose }) => {
    if (!message) return null;
    return (
      <div className={`message-modal ${isError ? 'error' : 'success'}`}>
        <div className="message-content">
          <p>{message}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

  if (showSummary) {
    return (
      <div className="form-container">
        <MessageModal message={message} isError={isError} onClose={() => setMessage('')} />
        <div className="summary-card">
          <div className="summary-header">
            <h1 className="summary-title">Questionnaire Complete!</h1>
            <p className="summary-subtitle">Review your answers below</p>
          </div>

          <div className="answers-list">
            {allQuestions.map((question, index) => (
              answers[index] && (
                <div key={index} className="answer-item">
                  <div className="answer-question">{question.text}</div>
                  <div className="answer-value">
                    {Array.isArray(answers[index]) ? (
                      <div className="answer-value-array">
                        {answers[index].map((item, i) => (
                          <span key={i} className="answer-tag">{item}</span>
                        ))}
                      </div>
                    ) : (
                      answers[index]
                    )}
                  </div>
                </div>
              )
            ))}
          </div>

          <div className="summary-actions">
            <button className="summary-btn btn-secondary" onClick={() => setShowSummary(false)}>
              Edit Answers
            </button>
            <button className="summary-btn btn-primary" onClick={handleSubmit}>
              Submit Questionnaire
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <MessageModal message={message} isError={isError} onClose={() => setMessage('')} />
      <div className="question-card">
        <div className="progress-container">
          <div className="progress-text">
            <span>Question {currentQuestionIndex + 1} of {allQuestions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className={`question-content ${isTransitioning ? 'question-transition-exit-active' : 'question-transition-enter-active'}`}>
          <div className="question-category">
            <span className="category-icon">{currentQuestion.icon}</span>
            <span>{currentQuestion.category}</span>
          </div>

          <h2 className="question-text">{currentQuestion.text}</h2>

          <div className="assistant-message">
            <i className="fas fa-robot" style={{marginRight: '0.5rem'}}></i>
            {assistantMessage}
          </div>

          {renderInput()}
        </div>

        <div className="action-buttons">
          <button
            className="nav-button btn-prev"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <i className="fas fa-arrow-left" style={{marginRight: '0.5rem'}}></i>
            Previous
          </button>

          <button
            className="btn-skip"
            onClick={handleSkip}
          >
            Skip Question
          </button>

          <button
            className="nav-button btn-next"
            onClick={handleNext}
            disabled={!answers[currentQuestionIndex]}
          >
            {currentQuestionIndex === allQuestions.length - 1 ? 'Finish' : 'Next'}
            <i className="fas fa-arrow-right" style={{marginLeft: '0.5rem'}}></i>
          </button>
        </div>

        <div className="assistant-avatar">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="90" fill="#2D9CDB" opacity="0.3" />
            <circle cx="100" cy="80" r="40" fill="#27AE60" opacity="0.5" />
            <path d="M70 130 Q100 180 130 130" stroke="#90EE90" strokeWidth="10" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default OrganizationForm;
