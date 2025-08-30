import React, { useState, useEffect } from 'react';

const OrganizationForm = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState("");

  // Questions with metadata about expected input type
  const questionCategories = [
    {
      title: "Business & Market Questions",
      icon: "📊",
      questions: [
        {
          text: "What is the current and projected demand for green hydrogen in our target region/industry?",
          type: "scale",
          options: ["Very Low", "Low", "Moderate", "High", "Very High"]
        },
        {
          text: "Which industries are most likely to be early buyers?",
          type: "checkbox",
          options: ["Refineries", "Fertilizers", "Steel", "Transport", "Power Generation"]
        },
        {
          text: "Who are the potential competitors already operating or planning plants nearby?",
          type: "text"
        },
        {
          text: "What business model should we adopt?",
          type: "radio",
          options: ["B2B Contracts", "Partnerships", "Government Auctions", "Hybrid Approach"]
        },
        {
          text: "Are there any government subsidies, incentives, or carbon credits available for green hydrogen?",
          type: "radio",
          options: ["Yes", "No", "Under Development", "Not Sure"]
        }
      ]
    },
    {
      title: "Technology & Efficiency Questions",
      icon: "🔧",
      questions: [
        {
          text: "Which electrolyzer technology gives the best efficiency vs. cost trade-off?",
          type: "radio",
          options: ["PEM", "Alkaline", "Solid Oxide", "Other"]
        },
        {
          text: "Can we scale production modularly (start small, expand later) to reduce initial risk?",
          type: "radio",
          options: ["Yes", "No", "With Limitations"]
        },
        {
          text: "How can we minimize the Levelized Cost of Hydrogen (LCOH)?",
          type: "checkbox",
          options: ["Better Efficiency", "Cheaper Energy", "Government Subsidies", "Economies of Scale", "Technology Innovation"]
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
      title: "Energy & Infrastructure Questions",
      icon: "⚡",
      questions: [
        {
          text: "What is the best site location considering electricity availability, water supply, and transport?",
          type: "text"
        },
        {
          text: "Can we use wastewater / seawater with desalination instead of fresh water?",
          type: "radio",
          options: ["Yes", "No", "With Additional Treatment"]
        },
        {
          text: "How will we store and transport hydrogen?",
          type: "checkbox",
          options: ["Compressed", "Liquefied", "Ammonia Carriers", "Methanol Carriers", "Other"]
        },
        {
          text: "Is there existing pipeline / distribution infrastructure we can leverage?",
          type: "radio",
          options: ["Yes", "No", "Partial Infrastructure"]
        },
        {
          text: "What is the expected plant capacity to break even fastest?",
          type: "number",
          min: 100,
          max: 10000,
          step: 100,
          unit: "kg/day"
        }
      ]
    },
    {
      title: "Financial & ROI Questions",
      icon: "💰",
      questions: [
        {
          text: "What is the CapEx for different plant sizes?",
          type: "range",
          min: 500000,
          max: 5000000,
          step: 100000,
          unit: "USD"
        },
        {
          text: "How long is the payback period under current hydrogen prices?",
          type: "range",
          min: 1,
          max: 10,
          step: 0.5,
          unit: "years"
        },
        {
          text: "What is the breakeven selling price of hydrogen?",
          type: "number",
          min: 2,
          max: 10,
          step: 0.1,
          unit: "USD/kg"
        },
        {
          text: "Can we co-produce oxygen and sell it for extra revenue?",
          type: "radio",
          options: ["Yes", "No", "Potentially"]
        },
        {
          text: "What financing models are possible?",
          type: "checkbox",
          options: ["PPP", "Loans", "Investors", "Grants", "Self-funding"]
        }
      ]
    },
    {
      title: "Risk & Policy Questions",
      icon: "🛡️",
      questions: [
        {
          text: "What are the main risks?",
          type: "checkbox",
          options: ["Technology Maturity", "Regulation", "Raw Material Supply", "Market Demand", "Competition"]
        },
        {
          text: "Are there upcoming carbon tax laws or mandates that will increase hydrogen demand?",
          type: "radio",
          options: ["Yes", "No", "Under Discussion"]
        },
        {
          text: "How strict are the safety regulations for hydrogen production, storage, and handling?",
          type: "scale",
          options: ["Very Lenient", "Lenient", "Moderate", "Strict", "Very Strict"]
        },
        {
          text: "What is the water footprint per kg H₂ and how to avoid environmental backlash?",
          type: "text"
        },
        {
          text: "How resilient is the plan if renewable energy prices rise or subsidies fall?",
          type: "scale",
          options: ["Not Resilient", "Slightly Resilient", "Moderately Resilient", "Highly Resilient", "Very Highly Resilient"]
        }
      ]
    }
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
  }, [currentQuestionIndex]);

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

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log("Final answers:", answers);
    alert("Thank you for completing the questionnaire! Your data has been saved.");
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

  if (showSummary) {
    return (
      <div className="form-container">
        <style>{`
          :root {
            --primary-dark: #081C15;
            --secondary-dark: #1B4332;
            --accent-teal: #2D9CDB;
            --accent-green: #27AE60;
            --accent-mint: #90EE90;
            --accent-aqua: #20B2AA;
            --text-light: #F8F9FA;
            --text-muted: #ADB5BD;
            --gradient-primary: linear-gradient(135deg, var(--accent-green) 0%, var(--accent-teal) 100%);
            --gradient-secondary: linear-gradient(135deg, var(--accent-mint) 0%, var(--accent-aqua) 100%);
            --glow-primary: 0 0 20px rgba(39, 174, 96, 0.4);
            --glow-secondary: 0 0 15px rgba(45, 156, 219, 0.3);
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            background: var(--primary-dark);
            color: var(--text-light);
            font-family: 'Poppins', sans-serif;
            line-height: 1.6;
          }

          .form-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            background: radial-gradient(circle at top right, var(--secondary-dark) 0%, var(--primary-dark) 100%);
          }

          .summary-card {
            background: rgba(27, 67, 50, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(39, 174, 96, 0.3);
            border-radius: 20px;
            padding: 2.5rem;
            width: 100%;
            max-width: 800px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25), var(--glow-primary);
            animation: slideUp 0.8s ease-out;
          }

          .summary-header {
            text-align: center;
            margin-bottom: 2rem;
          }

          .summary-title {
            font-size: 2.5rem;
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1rem;
          }

          .summary-subtitle {
            color: var(--text-muted);
            font-size: 1.2rem;
          }

          .answers-list {
            margin: 2rem 0;
            max-height: 400px;
            overflow-y: auto;
          }

          .answer-item {
            background: rgba(8, 28, 21, 0.7);
            border-radius: 10px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            border-left: 4px solid var(--accent-green);
          }

          .answer-question {
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--accent-mint);
          }

          .answer-value {
            color: var(--text-light);
          }

          .answer-value-array {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .answer-tag {
            background: rgba(39, 174, 96, 0.2);
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.9rem;
          }

          .summary-actions {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 2rem;
          }

          .summary-btn {
            padding: 1rem 2rem;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .btn-primary {
            background: var(--gradient-primary);
            color: white;
          }

          .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(39, 174, 96, 0.3);
          }

          .btn-secondary {
            background: transparent;
            border: 2px solid var(--accent-teal);
            color: var(--accent-teal);
          }

          .btn-secondary:hover {
            background: rgba(45, 156, 219, 0.1);
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(40px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>
        
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
      <style>{`
        :root {
          --primary-dark: #081C15;
          --secondary-dark: #1B4332;
          --accent-teal: #2D9CDB;
          --accent-green: #27AE60;
          --accent-mint: #90EE90;
          --accent-aqua: #20B2AA;
          --text-light: #F8F9FA;
          --text-muted: #ADB5BD;
          --gradient-primary: linear-gradient(135deg, var(--accent-green) 0%, var(--accent-teal) 100%);
          --gradient-secondary: linear-gradient(135deg, var(--accent-mint) 0%, var(--accent-aqua) 100%);
          --glow-primary: 0 0 20px rgba(39, 174, 96, 0.4);
          --glow-secondary: 0 0 15px rgba(45, 156, 219, 0.3);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: var(--primary-dark);
          color: var(--text-light);
          font-family: 'Poppins', sans-serif;
          line-height: 1.6;
        }

        .form-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: radial-gradient(circle at top right, var(--secondary-dark) 0%, var(--primary-dark) 100%);
        }

        .question-card {
          background: rgba(27, 67, 50, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(39, 174, 96, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
          width: 100%;
          max-width: 700px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25), var(--glow-primary);
          position: relative;
          overflow: hidden;
        }

        .question-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: var(--gradient-primary);
        }

        .progress-container {
          margin-bottom: 2rem;
        }

        .progress-text {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .progress-bar {
          height: 8px;
          background: rgba(8, 28, 21, 0.7);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--gradient-primary);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .question-content {
          margin-bottom: 2rem;
          min-height: 300px;
        }

        .question-category {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          color: var(--accent-teal);
          font-size: 1.1rem;
          font-weight: 600;
        }

        .category-icon {
          margin-right: 0.5rem;
          font-size: 1.5rem;
        }

        .question-text {
          font-size: 1.4rem;
          line-height: 1.4;
          margin-bottom: 1.5rem;
          color: var(--text-light);
        }

        .assistant-message {
          background: rgba(45, 156, 219, 0.1);
          border-left: 4px solid var(--accent-teal);
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-style: italic;
          color: var(--accent-mint);
        }

        .answer-options {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          margin-bottom: 2rem;
        }

        .option-row {
          display: flex;
          align-items: center;
          padding: 1rem;
          background: rgba(8, 28, 21, 0.7);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }

        .option-row:hover {
          background: rgba(39, 174, 96, 0.1);
          border-color: rgba(39, 174, 96, 0.3);
          transform: translateX(5px);
        }

        .option-row.selected {
          background: rgba(39, 174, 96, 0.2);
          border-color: var(--accent-green);
        }

        .option-input {
          margin-right: 1rem;
          accent-color: var(--accent-green);
          cursor: pointer;
        }

        .option-label {
          flex: 1;
          cursor: pointer;
        }

        .text-input {
          width: 100%;
          padding: 1rem;
          background: rgba(8, 28, 21, 0.7);
          border: 1px solid rgba(39, 174, 96, 0.2);
          border-radius: 10px;
          color: var(--text-light);
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.3s ease;
          resize: vertical;
        }

        .text-input:focus {
          outline: none;
          border-color: var(--accent-green);
          box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.2);
        }

        .number-input-container {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .number-input {
          padding: 1rem;
          background: rgba(8, 28, 21, 0.7);
          border: 1px solid rgba(39, 174, 96, 0.2);
          border-radius: 10px;
          color: var(--text-light);
          font-size: 1rem;
          width: 200px;
        }

        .input-unit {
          color: var(--accent-teal);
          font-weight: 600;
        }

        .range-container {
          margin: 1.5rem 0;
        }

        .range-input {
          width: 100%;
          height: 10px;
          -webkit-appearance: none;
          background: rgba(8, 28, 21, 0.7);
          border-radius: 5px;
          outline: none;
          accent-color: var(--accent-green);
        }

        .range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--accent-green);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(39, 174, 96, 0.5);
        }

        .range-values {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .range-current-value {
          color: var(--accent-green);
          font-weight: 600;
        }

        .scale-container {
          margin: 1.5rem 0;
        }

        .scale-options {
          display: flex;
          justify-content: space-between;
        }

        .scale-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0.5rem;
          border-radius: 8px;
        }

        .scale-option:hover {
          background: rgba(39, 174, 96, 0.1);
        }

        .scale-option.selected .scale-point {
          background: var(--accent-green);
          transform: scale(1.3);
          box-shadow: 0 0 15px rgba(39, 174, 96, 0.5);
        }

        .scale-option.selected .scale-label {
          color: var(--accent-green);
          font-weight: 600;
        }

        .scale-point {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent-teal);
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
        }

        .scale-label {
          font-size: 0.8rem;
          text-align: center;
          color: var(--text-muted);
          transition: all 0.3s ease;
        }

        .action-buttons {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-button {
          padding: 0.8rem 1.5rem;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }

        .nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .nav-button:not(:disabled):hover {
          transform: translateY(-2px);
        }

        .btn-prev {
          background: transparent;
          border: 2px solid var(--accent-teal);
          color: var(--accent-teal);
        }

        .btn-prev:hover:not(:disabled) {
          background: rgba(45, 156, 219, 0.1);
        }

        .btn-next {
          background: var(--gradient-primary);
          color: white;
        }

        .btn-next:hover:not(:disabled) {
          box-shadow: 0 5px 15px rgba(39, 174, 96, 0.3);
        }

        .btn-skip {
          background: transparent;
          color: var(--text-muted);
          border: none;
        }

        .btn-skip:hover {
          color: var(--accent-teal);
        }

        .assistant-avatar {
          position: absolute;
          bottom: -30px;
          right: -30px;
          width: 150px;
          height: 150px;
          opacity: 0.1;
          pointer-events: none;
        }

        .question-transition-enter {
          opacity: 0;
          transform: translateY(20px);
        }

        .question-transition-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .question-transition-exit {
          opacity: 1;
          transform: translateY(0);
        }

        .question-transition-exit-active {
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .pulse {
          animation: pulse 2s infinite;
        }

        @media (max-width: 768px) {
          .form-container {
            padding: 1rem;
          }
          
          .question-card {
            padding: 1.5rem;
          }
          
          .question-text {
            font-size: 1.2rem;
          }
          
          .scale-options {
            flex-direction: column;
            gap: 1rem;
          }
          
          .scale-option {
            flex-direction: row;
            gap: 0.5rem;
          }
          
          .action-buttons {
            flex-direction: column;
            gap: 1rem;
          }
          
          .nav-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

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