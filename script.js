const ficCoursesList = [
  "Administração", "Agrimensura", "Agropecuária", "Automação Industrial", 
  "Biotecnologia", "Edificações", "Eletroeletrônica", "Eletromecânica", 
  "Eletrônica", "Eletrotécnica", "Informática", "Mecânica", "Mecatrônica", 
  "Meio Ambiente", "Metalurgia", "Mineração", "Nutrição e Dietética", 
  "Paisagismo", "Química", "Segurança no Trabalho", "Sistema de Energia Renovável"
];

document.addEventListener("DOMContentLoaded", () => {
  // Populate FIC Courses dynamically to keep HTML clean
  const ficGrid = document.getElementById('fic-courses');
  ficCoursesList.forEach(course => {
    const label = document.createElement('label');
    label.className = 'checkbox-card';
    label.innerHTML = `<input type="checkbox" name="ficCursos" value="${course}"><span>${course}</span>`;
    ficGrid.appendChild(label);
  });

  const steps = document.querySelectorAll('.form-step');
  const progressSteps = document.querySelectorAll('.step');
  const progressLines = document.querySelectorAll('.step-line');
  const stepLabel = document.querySelector('.step-label');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnSubmit = document.getElementById('btnSubmit');
  
  let currentStep = 0;
  const labels = [
    "Etapa 1: Identificação",
    "Etapa 2: Ambiente de Inovação",
    "Etapa 3: Empresarial e Centros de Excelência",
    "Etapa 4: Desenvolvimento Organizacional",
    "Etapa 5: Inteligência de Governo (SERPRO)"
  ];

  function validateStep(stepIndex) {
    const step = steps[stepIndex];
    // We only require simple text/tel inputs marked as required
    const requiredInputs = step.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    requiredInputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = '#ff4a4a';
      } else {
        input.style.borderColor = '';
      }
    });
    return isValid;
  }

  function updateForm() {
    // Show/Hide steps
    steps.forEach((step, index) => {
      step.classList.toggle('active', index === currentStep);
    });

    // Update Progress Bar
    progressSteps.forEach((step, index) => {
      if (index < currentStep) {
        step.classList.add('completed');
        step.classList.remove('active');
      } else if (index === currentStep) {
        step.classList.add('active');
        step.classList.remove('completed');
      } else {
        step.classList.remove('active', 'completed');
      }
    });

    // Update Progress Lines
    progressLines.forEach((line, index) => {
      line.classList.toggle('active', index < currentStep);
    });

    // Update Text Label
    stepLabel.textContent = labels[currentStep];

    // Navigation Buttons Logic
    btnPrev.disabled = currentStep === 0;
    
    if (currentStep === steps.length - 1) {
      btnNext.style.display = 'none';
      btnSubmit.style.display = 'flex';
    } else {
      btnNext.style.display = 'flex';
      btnSubmit.style.display = 'none';
    }
  }

  btnNext.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      currentStep++;
      updateForm();
    } else {
      // Small shake animation if invalid
      steps[currentStep].style.transform = 'translateX(-8px)';
      setTimeout(() => { steps[currentStep].style.transform = 'translateX(8px)'; }, 100);
      setTimeout(() => { steps[currentStep].style.transform = 'translateX(0)'; }, 200);
    }
  });

  btnPrev.addEventListener('click', () => {
    currentStep--;
    updateForm();
  });

  btnSubmit.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      // Gather Form Data
      const formData = new FormData(document.getElementById('prospectForm'));
      const data = Object.fromEntries(formData.entries());
      
      // Specifically handle multi-select checkboxes
      data.ficCursos = formData.getAll('ficCursos').join('; ');
      data.ficMod = formData.getAll('ficMod').join('; ');
      data.posGrad = formData.getAll('posGrad').join('; ');

      console.log('Formulário Submetido:', data);

      // Gerar e baixar a planilha (CSV)
      const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
        + Object.keys(data).join(";") + "\n"
        + Object.values(data).map(v => {
            if (typeof v === 'string') {
               return '"' + v.replace(/"/g, '""').replace(/\n/g, ' ') + '"';
            }
            return '""';
        }).join(";");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "prospeccao_dados.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success screen
      document.querySelector('.form-card').innerHTML = `
        <div style="text-align: center; padding: 60px 20px; animation: fadeInStep 0.6s ease;">
          <i class="ph ph-check-circle" style="font-size: 6rem; color: var(--green-primary); margin-bottom: 25px; display: inline-block;"></i>
          <h2 style="font-family: var(--font-heading); font-size: 2.5rem; color: #fff; margin-bottom: 15px;">Agradecemos sua submissão!</h2>
          <p style="color: var(--text-muted); font-size: 1.1rem; max-width: 500px; margin: 0 auto; line-height: 1.6;">
            Seus dados foram registrados com sucesso. A Unidade Tecnológica entrará em contato em breve para discutir as oportunidades de parceria.
          </p>
        </div>
      `;
    }
  });

  // Clear validation red border on typing
  document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
      if(input.style.borderColor === 'rgb(255, 74, 74)' || input.style.borderColor === '#ff4a4a') {
        input.style.borderColor = '';
      }
    });
  });
});
