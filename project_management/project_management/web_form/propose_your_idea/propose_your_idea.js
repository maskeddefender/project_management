frappe.ready(function() {
    // Add stylesheet to the head
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        body {
            background-color: #f9f3e6; /* Creamy background color */
            color: #333;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .form-group {
		margin-bottom: 1.5rem;
		transition: all 0.3s ease;
		}
		
		.form-control {
		border-radius: 6px;
		border: 1px solid #d1d5db;
		padding: 0.75rem;
		transition: all 0.2s ease;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
		}
		
		.form-control:focus {
		border-color: #4f46e5;
		box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
		outline: none;
		}
		
		.control-label {
		font-weight: 600;
		color: #374151;
		margin-bottom: 0.5rem;
		display: block;
		}
		
		.form-section {
		border-bottom: 1px solid #e5e7eb;
		padding-bottom: 1.5rem;
		margin-bottom: 2rem;
		}
		
		.form-section-heading {
		color: #1f2937;
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
		}
		
		.btn-primary {
		background-color: #4f46e5;
		border-color: #4f46e5;
		padding: 0.625rem 1.25rem;
		font-weight: 500;
		border-radius: 6px;
		transition: all 0.2s ease;
		}
		
		.btn-primary:hover {
		background-color: #4338ca;
		border-color: #4338ca;
		transform: translateY(-1px);
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
		}
		
		.description-counter {
		font-size: 0.875rem;
		margin-top: 0.375rem;
		text-align: right;
		transition: color 0.2s ease;
		}
		
		.counter-normal {
		color: #6b7280;
		}
		
		.counter-warning {
		color: #d97706;
		}
		
		.counter-danger {
		color: #dc2626;
		}
		
		/* Animations for newly populated fields */
		.field-populated {
		animation: highlight 1s ease;
		}
		
		@keyframes highlight {
		0% { background-color: rgba(79, 70, 229, 0.1); }
		100% { background-color: transparent; }
		}
    `;
    document.head.appendChild(styleSheet);
    
    // Call functions with a slight delay to ensure the DOM is ready
    setTimeout(populateUserDetails, 1000);
    setTimeout(addDescriptionCounter, 1000);
    setTimeout(enhanceFormAppearance, 1000);
	setTimeout(validateDates, 1000);
});

const populateUserDetails = () => {
    if (frappe.session && frappe.session.user && frappe.session.user !== 'Guest') {
        // Auto-fill email
        if (frappe.web_form.has_field('client_email')) {
            frappe.web_form.set_value('client_email', frappe.session.user);           
        }
        
        // Fetch user's full name
        frappe.call({
            method: "frappe.client.get",
            args: {
                doctype: "User",
                name: frappe.session.user
            },
            callback: function(response) {
                if (response.message && response.message.full_name) {
                    // Set client name if the field exists
                    if (frappe.web_form.has_field('client_name')) {
                        frappe.web_form.set_value('client_name', response.message.full_name);                            
                    }
                }
            }
        });
    }
};

const addDescriptionCounter = () => {
    const descriptionField = document.querySelector('[data-fieldname="description"]');
    if (descriptionField) {
        const textarea = descriptionField.querySelector('textarea');
        const counterDiv = document.createElement('div');
        counterDiv.className = 'text-sm text-gray-500 mt-1 text-right';
        counterDiv.id = 'description-counter';
        
        // Initial count
        const charCount = textarea.value.length;
        const wordCount = textarea.value.trim() === '' ? 0 : textarea.value.trim().split(/\s+/).length;
        counterDiv.textContent = `${charCount} characters / ${wordCount} words`;
        
        descriptionField.appendChild(counterDiv);
        
        textarea.addEventListener('input', function() {
            const counter = document.getElementById('description-counter');
            const currentCharCount = this.value.length;
            const currentWordCount = this.value.trim() === '' ? 0 : this.value.trim().split(/\s+/).length;
            
            counter.textContent = `${currentCharCount} characters / ${currentWordCount} words`;
            
            // Visual feedback as gets closer to limit
            if (this.maxLength) {
                if (currentCharCount > this.maxLength * 0.9) {
                    counter.className = 'text-sm text-red-600 mt-1 text-right';
                } else if (currentCharCount > this.maxLength * 0.7) {
                    counter.className = 'text-sm text-yellow-600 mt-1 text-right';
                } else {
                    counter.className = 'text-sm text-gray-500 mt-1 text-right';
                }
            }
        });
    }
};

// New function to enhance form appearance
const enhanceFormAppearance = () => {
    // Add form container if not already present
    const formElement = document.querySelector('.web-form');
    if (formElement && !formElement.parentElement.classList.contains('web-form-container')) {
        const container = document.createElement('div');
        container.className = 'web-form-container';
        formElement.parentNode.insertBefore(container, formElement);
        container.appendChild(formElement);
    }
    
    // Add subtle animations to form fields
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.addEventListener('focus', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.transform = 'translateY(-2px)';
        });
        
        control.addEventListener('blur', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Improve required field indicators
    const requiredLabels = document.querySelectorAll('.control-label.reqd');
    requiredLabels.forEach(label => {
        const reqSpan = label.querySelector('.text-danger');
        if (reqSpan) {
            reqSpan.style.color = '#c27c36';
            reqSpan.style.fontWeight = 'bold';
        }
    });
    
    // Add subtle hover effect to form rows
    const formRows = document.querySelectorAll('.form-group');
    formRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transition = 'background-color 0.3s ease';
            this.style.backgroundColor = 'rgba(249, 243, 230, 0.5)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
        });
    });
};

const validateDates = () => {
    const startDateField = document.querySelector('[data-fieldname="planed_start_date"] input');
    const endDateField = document.querySelector('[data-fieldname="planed_end_date"] input');
    
    if (startDateField && endDateField) {
        // Function to validate dates
        const validateDateRange = () => {
            const startDate = new Date(startDateField.value);
            const endDate = new Date(endDateField.value);
            
            if (startDate && endDate && endDate < startDate) {
                frappe.msgprint({
                    title: __('Invalid Date Range'),
                    indicator: 'red',
                    message: __('End date cannot be before start date')
                });
                endDateField.value = '';
                
                // Add error styling
                endDateField.classList.add('error-border');
                setTimeout(() => {
                    endDateField.classList.remove('error-border');
                }, 2000);
            }
        };
        
        // Add event listeners for both fields
        startDateField.addEventListener('change', validateDateRange);
        endDateField.addEventListener('change', validateDateRange);
        startDateField.addEventListener('blur', validateDateRange);
        endDateField.addEventListener('blur', validateDateRange);
        
        // Add error border style to the head
        const errorStyle = document.createElement('style');
        errorStyle.textContent = `
            .error-border {
                border: 2px solid #dc2626 !important;
                animation: shake 0.5s ease-in-out;
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(errorStyle);
    }
};