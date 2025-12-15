import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordValidatorProps {
  password: string;
}

const PasswordValidator: React.FC<PasswordValidatorProps> = ({ password }) => {
  const validations = [
    {
      text: "At least 8 characters",
      valid: password.length >= 8
    },
    {
      text: "At least one uppercase letter",
      valid: /[A-Z]/.test(password)
    },
    {
      text: "At least one number",
      valid: /\d/.test(password)
    },
    {
      text: "At least one symbol",
      valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    }
  ];

  return (
    <div className="mt-2 space-y-1">
      {validations.map((validation, index) => (
        <div
          key={index}
          className={`flex items-center text-xs ${
            validation.valid ? 'text-green-600' : 'text-muted-foreground'
          }`}
        >
          {validation.valid ? (
            <Check className="w-3 h-3 mr-1" />
          ) : (
            <X className="w-3 h-3 mr-1" />
          )}
          {validation.text}
        </div>
      ))}
    </div>
  );
};

export default PasswordValidator;