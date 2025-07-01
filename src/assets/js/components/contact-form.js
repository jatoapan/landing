import { FirebaseService } from '../services/firebase-service.js';

export class ContactForm {
  constructor() {
    console.log('🔧 Inicializando ContactForm...');
    this.form = document.getElementById('contact-form');
    this.init();
  }

  init() {
    if (this.form) {
      console.log('✅ Formulario encontrado, agregando listener...');
      this.form.addEventListener('submit', this.handleSubmit.bind(this));
      this.addRealTimeValidation();
    } else {
      console.error('❌ No se encontró el formulario con ID: contact-form');
    }
  }

  addRealTimeValidation() {
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateInput(input));
      input.addEventListener('input', () => this.clearError(input));
    });
  }

  validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (input.name) {
      case 'name':
        if (!value || value.length < 2) {
          isValid = false;
          errorMessage = 'Nombre: mínimo 2 caracteres';
        }
        break;
      case 'email':
        if (!value || !this.isValidEmail(value)) {
          isValid = false;
          errorMessage = 'Email: formato inválido';
        }
        break;
      case 'phone':
        if (!value || value.length < 8) {
          isValid = false;
          errorMessage = 'Teléfono: mínimo 8 dígitos';
        }
        break;
      case 'address':
        if (!value || value.length < 3) {
          isValid = false;
          errorMessage = 'Dirección: mínimo 3 caracteres';
        }
        break;
      case 'topic':
        if (!value || value.length < 3) {
          isValid = false;
          errorMessage = 'Tema: mínimo 3 caracteres';
        }
        break;
      case 'message':
        if (!value || value.length < 10) {
          isValid = false;
          errorMessage = `Mensaje: ${value.length}/10 caracteres mínimo`;
        }
        break;
    }

    if (!isValid) {
      this.showError(input, errorMessage);
    } else {
      this.clearError(input);
    }

    return isValid;
  }

  showError(input, message) {
    this.clearError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = 'red';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    
    input.parentNode.appendChild(errorDiv);
  }

  clearError(input) {
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    console.log('📝 Formulario enviado...');
    
    const formData = this.getFormData();
    console.log('📋 Datos del formulario:', formData);
    
    // Validación completa
    const errors = this.validateForm(formData);
    
    if (errors.length > 0) {
      alert('Errores encontrados:\n\n' + errors.join('\n'));
      this.highlightErrors(formData);
      return;
    }

    const submitButton = this.form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    try {
      const result = await FirebaseService.saveContactMessage(formData);
      if (result.success) {
        alert('✅ ¡Mensaje enviado correctamente!');
        this.form.reset();
        this.clearAllErrors();
      }
    } catch (error) {
      console.error('Error al enviar:', error);
      alert('❌ Error al enviar. Inténtalo de nuevo.');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }

  validateForm(formData) {
    const errors = [];

    if (!formData.name || formData.name.length < 2) {
      errors.push('• Nombre obligatorio (mín. 2 caracteres)');
    }

    if (!formData.email || !this.isValidEmail(formData.email)) {
      errors.push('• Email obligatorio y válido');
    }

    if (!formData.phone || formData.phone.length < 8) {
      errors.push('• Teléfono obligatorio (mín. 8 dígitos)');
    }

    if (!formData.address || formData.address.length < 3) {
      errors.push('• Dirección obligatoria (mín. 3 caracteres)');
    }

    if (!formData.topic || formData.topic.length < 3) {
      errors.push('• Tema obligatorio (mín. 3 caracteres)');
    }

    if (!formData.message || formData.message.length < 10) {
      errors.push('• Mensaje obligatorio (mín. 10 caracteres)');
    }

    return errors;
  }

  highlightErrors(formData) {
    this.clearAllErrors();

    const nameInput = this.form.querySelector('input[name="name"]');
    const emailInput = this.form.querySelector('input[name="email"]');
    const phoneInput = this.form.querySelector('input[name="phone"]');
    const addressInput = this.form.querySelector('input[name="address"]');
    const topicInput = this.form.querySelector('input[name="topic"]');
    const messageInput = this.form.querySelector('textarea[name="message"]');

    if (!formData.name || formData.name.length < 2) {
      this.showError(nameInput, 'Nombre obligatorio');
    }

    if (!formData.email || !this.isValidEmail(formData.email)) {
      this.showError(emailInput, 'Email inválido');
    }

    if (!formData.phone || formData.phone.length < 8) {
      this.showError(phoneInput, 'Teléfono obligatorio');
    }

    if (!formData.address || formData.address.length < 3) {
      this.showError(addressInput, 'Dirección obligatoria');
    }

    if (!formData.topic || formData.topic.length < 3) {
      this.showError(topicInput, 'Tema obligatorio');
    }

    if (!formData.message || formData.message.length < 10) {
      this.showError(messageInput, 'Mensaje muy corto');
    }
  }

  clearAllErrors() {
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => this.clearError(input));
  }

  getFormData() {
    const formData = new FormData(this.form);
    return {
      name: formData.get('name')?.trim() || '',
      email: formData.get('email')?.trim() || '',
      phone: formData.get('phone')?.trim() || '',
      address: formData.get('address')?.trim() || '',
      topic: formData.get('topic')?.trim() || '',
      message: formData.get('message')?.trim() || ''
    };
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}