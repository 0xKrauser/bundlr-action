export default function Input({
  className = "",
  containerClassName = "",
  value,
  placeholder,
  onChange,
}: {
  className?: string | undefined;
  containerClassName?: string | undefined;
  value: string;
  placeholder: string;
  onChange: (input: string) => void;
}) {
  return (
    <div className={containerClassName}>
      <input
        className={className}
        value={value}
        type="text"
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
