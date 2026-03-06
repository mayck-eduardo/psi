import './style.css';
import gsap from 'gsap';
import { testQuestions, calculateResult } from './test-data.js';

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const questionsList = document.getElementById('questions-list');
  const submitBtn = document.getElementById('submit-btn');
  const errorMsg = document.getElementById('error-msg');
  const resultSection = document.getElementById('result-section');
  
  const resultArchetype = document.getElementById('result-archetype');
  const resultDescription = document.getElementById('result-description');
  const restartBtn = document.getElementById('restart-btn');
  const scheduleBtn = document.getElementById('schedule-btn');

  const answers = {}; // Store answers { questionIndex: 'A' }

  // 1. Render all questions
  testQuestions.forEach((q, index) => {
    const block = document.createElement('div');
    block.className = 'question-block';
    
    // Title
    const title = document.createElement('h2');
    title.className = 'question-title';
    title.textContent = `${index + 1}. ${q.question}`;
    block.appendChild(title);

    // Options Grid
    const optionsGrid = document.createElement('div');
    optionsGrid.className = 'options-grid';

    q.options.forEach((opt, optIndex) => {
      const label = document.createElement('label');
      label.className = 'option-label';
      
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `question-${index}`;
      input.value = opt.value;
      
      // Update selected class & save answer
      input.addEventListener('change', () => {
        // Remove selected class from sibling labels
        const siblings = optionsGrid.querySelectorAll('.option-label');
        siblings.forEach(sib => sib.classList.remove('selected'));
        // Add to this
        label.classList.add('selected');
        
        answers[index] = opt.value;
        errorMsg.style.display = 'none'; // Hide error if user is fixing
      });

      label.appendChild(input);
      label.appendChild(document.createTextNode(` ${opt.text}`));
      optionsGrid.appendChild(label);
    });

    block.appendChild(optionsGrid);
    questionsList.appendChild(block);
  });

  // Entrance Animation
  gsap.from('.question-block', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out'
  });

  // 2. Submit Logic
  submitBtn.addEventListener('click', () => {
    // Check if all answered
    if (Object.keys(answers).length < testQuestions.length) {
      errorMsg.style.display = 'block';
      
      // Jiggle the error message
      gsap.fromTo(errorMsg, 
        { x: -10 }, 
        { x: 10, duration: 0.1, yoyo: true, repeat: 3, onComplete: () => gsap.set(errorMsg, {x:0}) }
      );
      return;
    }

    // Calculate Result
    const answersArray = Object.values(answers);
    const result = calculateResult(answersArray);

    resultArchetype.textContent = result.title;
    resultDescription.textContent = result.description;

    // Show Result
    resultSection.classList.remove('hidden');
    
    // Scroll smoothly to result
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Animate in
    gsap.fromTo(resultSection, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );
  });

  // 3. Restart Link
  restartBtn.addEventListener('click', () => {
    // Reset selections
    const inputs = document.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => input.checked = false);
    
    const labels = document.querySelectorAll('.option-label');
    labels.forEach(l => l.classList.remove('selected'));

    for(let key in answers) delete answers[key];
    
    resultSection.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 4. Schedule click
  scheduleBtn.addEventListener('click', () => {
     window.location.href = "https://wa.me/"; // Update to real WhatsApp later
  });

});
