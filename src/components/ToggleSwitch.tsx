// src/components/ToggleSwitch.tsx

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch = ({ checked, onChange }: ToggleSwitchProps) => {
  return (
    <label className="toggle-switch"> 
      <input
        type="checkbox"
        className="toggle-switch-checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle-slider"></span>
    </label>
  );
};

export default ToggleSwitch;
