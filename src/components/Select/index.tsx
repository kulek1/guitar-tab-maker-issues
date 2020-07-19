import React from 'react';

type Props = {
  label: string;
  options: { text: string; value: string }[];
  id: string;
  defaultValue: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const Select: React.FC<Props> = ({ options, label, id, onChange, defaultValue }) => {
  return (
    <div>
      <div>
        <label htmlFor={id}>{label}</label>
      </div>
      <select id={id} onChange={onChange} defaultValue={defaultValue}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
