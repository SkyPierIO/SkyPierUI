import clsx from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export const Button = ({ children, onClick, className, disabled }: ButtonProps) => {
  const outerClasses = clsx(disabled ? "" : "border-primary");
  const innerClasses = clsx(disabled ? "" : "border-primary");
  return (
    <div className={clsx("flex rounded-full border p-1 flex-shrink-0", outerClasses)}>
      <div className={clsx("flex rounded-full border-2 p-1", innerClasses)}>
        <button
          className={clsx(
            "btn btn-primary rounded-full capitalize font-normal font-white flex items-center gap-1 hover:gap-2 transition-all tracking-widest",
            className,
          )}
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </button>
      </div>
    </div>
  );
};
