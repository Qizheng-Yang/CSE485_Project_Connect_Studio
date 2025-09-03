import React from 'react';

function InputField({ label, placeholder, value, onChange }) {
  return (
    <div className="input-field">
      <label>{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default InputField;
