// ═══════════════════════════════════════════════════════════
// FORM VALIDATORS
// ═══════════════════════════════════════════════════════════

/**
 * Form Validation Utilities
 */
const formValidator = {
  /**
   * Validate entire form
   */
  validateForm(formElement) {
    const fields = formElement.querySelectorAll('[data-validate]');
    const errors = {};
    let isValid = true;

    fields.forEach(field => {
      const rules = field.getAttribute('data-validate').split('|');
      const fieldErrors = [];

      rules.forEach(rule => {
        const error = this.validateField(field, rule);
        if (error) {
          fieldErrors.push(error);
          isValid = false;
        }
      });

      if (fieldErrors.length > 0) {
        errors[field.name] = fieldErrors;
        this.showFieldError(field, fieldErrors[0]);
      } else {
        this.clearFieldError(field);
      }
    });

    return { isValid, errors };
  },

  /**
   * Validate single field
   */
  validateField(field, rule) {
    const value = field.value.trim();
    const [ruleName, ...params] = rule.split(':');

    switch (ruleName) {
      case 'required':
        if (!value) return 'Field ini wajib diisi';
        break;

      case 'email':
        if (value && !validator.email(value)) {
          return 'Format email tidak valid';
        }
        break;

      case 'password':
        if (value) {
          const result = validator.password(value);
          if (!result.valid) return result.errors[0];
        }
        break;

      case 'min':
        const minLength = parseInt(params[0]);
        if (value.length < minLength) {
          return `Minimal ${minLength} karakter`;
        }
        break;

      case 'max':
        const maxLength = parseInt(params[0]);
        if (value.length > maxLength) {
          return `Maksimal ${maxLength} karakter`;
        }
        break;

      case 'match':
        const matchField = document.querySelector(`[name="${params[0]}"]`);
        if (matchField && value !== matchField.value) {
          return 'Field tidak cocok';
        }
        break;

      case 'numeric':
        if (value && !/^\d+$/.test(value)) {
          return 'Hanya boleh angka';
        }
        break;

      case 'alpha':
        if (value && !/^[a-zA-Z\s]+$/.test(value)) {
          return 'Hanya boleh huruf';
        }
        break;

      case 'alphanumeric':
        if (value && !/^[a-zA-Z0-9\s]+$/.test(value)) {
          return 'Hanya boleh huruf dan angka';
        }
        break;

      case 'url':
        try {
          if (value) new URL(value);
        } catch {
          return 'Format URL tidak valid';
        }
        break;

      default:
        console.warn(`Unknown validation rule: ${ruleName}`);
    }

    return null;
  },

  /**
   * Show field error
   */
  showFieldError(field, message) {
    // Remove existing error
    this.clearFieldError(field);

    // Add error class
    field.classList.add('error');

    // Create error message
    const errorEl = document.createElement('div');
    errorEl.className = 'field-error';
    errorEl.textContent = message;
    errorEl.style.cssText = `
      color: #ef4444;
      font-size: 12px;
      margin-top: 4px;
      font-weight: 500;
    `;

    // Insert after field
    field.parentNode.insertBefore(errorEl, field.nextSibling);
  },

  /**
   * Clear field error
   */
  clearFieldError(field) {
    field.classList.remove('error');
    const errorEl = field.parentNode.querySelector('.field-error');
    if (errorEl) errorEl.remove();
  },

  /**
   * Clear all form errors
   */
  clearFormErrors(formElement) {
    const fields = formElement.querySelectorAll('[data-validate]');
    fields.forEach(field => this.clearFieldError(field));
  }
};

/**
 * Real-time validation
 */
function enableLiveValidation(formElement) {
  const fields = formElement.querySelectorAll('[data-validate]');
  
  fields.forEach(field => {
    field.addEventListener('blur', () => {
      const rules = field.getAttribute('data-validate').split('|');
      let hasError = false;

      for (const rule of rules) {
        const error = formValidator.validateField(field, rule);
        if (error) {
          formValidator.showFieldError(field, error);
          hasError = true;
          break;
        }
      }

      if (!hasError) {
        formValidator.clearFieldError(field);
      }
    });

    field.addEventListener('input', () => {
      if (field.classList.contains('error')) {
        formValidator.clearFieldError(field);
      }
    });
  });
}

/**
 * Password strength checker
 */
function checkPasswordStrength(password) {
  let strength = 0;
  const feedback = [];

  // Length
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  
  // Character variety
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*]/.test(password)) strength++;

  // Feedback
  if (password.length < 8) feedback.push('Minimal 8 karakter');
  if (!/[a-z]/.test(password)) feedback.push('Tambah huruf kecil');
  if (!/[A-Z]/.test(password)) feedback.push('Tambah huruf besar');
  if (!/\d/.test(password)) feedback.push('Tambah angka');
  if (!/[!@#$%^&*]/.test(password)) feedback.push('Tambah karakter spesial');

  // Strength level
  let level = 'weak';
  if (strength >= 5) level = 'strong';
  else if (strength >= 3) level = 'medium';

  return { strength, level, feedback };
}

/**
 * Display password strength
 */
function displayPasswordStrength(inputElement, containerElement) {
  inputElement.addEventListener('input', (e) => {
    const password = e.target.value;
    const result = checkPasswordStrength(password);

    const colors = {
      weak: '#ef4444',
      medium: '#f59e0b',
      strong: '#10b981'
    };

    const labels = {
      weak: 'Lemah',
      medium: 'Sedang',
      strong: 'Kuat'
    };

    containerElement.innerHTML = `
      <div class="password-strength">
        <div class="strength-bar">
          <div class="strength-fill" style="
            width: ${(result.strength / 6) * 100}%;
            background: ${colors[result.level]};
            height: 4px;
            border-radius: 2px;
            transition: all 0.3s;
          "></div>
        </div>
        <div class="strength-label" style="
          font-size: 12px;
          color: ${colors[result.level]};
          font-weight: 600;
          margin-top: 4px;
        ">
          ${password ? labels[result.level] : ''}
        </div>
        ${result.feedback.length > 0 ? `
          <ul class="strength-feedback" style="
            font-size: 11px;
            color: #6b7280;
            margin-top: 4px;
            padding-left: 20px;
          ">
            ${result.feedback.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `;
  });
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formValidator,
    enableLiveValidation,
    checkPasswordStrength,
    displayPasswordStrength
  };
}
