 import React from 'react';

function Button({ text, onClick, disabled }) {
    return (
        <button
            className={`button ${disabled ? 'disabled' : ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
}

export default Button;
