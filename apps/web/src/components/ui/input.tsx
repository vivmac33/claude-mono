import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════
// INPUT VARIANTS
// ═══════════════════════════════════════════════════════════════════════════

const inputVariants = cva(
  // Base styles
  [
    "flex w-full rounded-lg",
    "bg-slate-800 border border-slate-700",
    "text-slate-100 placeholder:text-slate-500",
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-0",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-800/50",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-100",
  ],
  {
    variants: {
      variant: {
        default: [
          "focus:border-indigo-500 focus:ring-indigo-500/20",
        ],
        teal: [
          "focus:border-teal-500 focus:ring-teal-500/20",
          "text-teal-400 font-mono font-semibold",
        ],
        error: [
          "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
        ],
        success: [
          "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/20",
        ],
      },
      inputSize: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-3 text-sm",
        lg: "h-10 px-4 text-sm",
        xl: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  }
);

// ═══════════════════════════════════════════════════════════════════════════
// INPUT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  /** Icon or element to show on the left */
  leftElement?: React.ReactNode;
  /** Icon or element to show on the right */
  rightElement?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, type, leftElement, rightElement, ...props }, ref) => {
    // If there are side elements, wrap in a container
    if (leftElement || rightElement) {
      return (
        <div className="relative flex items-center">
          {leftElement && (
            <div className="absolute left-3 flex items-center pointer-events-none text-slate-500">
              {leftElement}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant, inputSize }),
              leftElement && "pl-10",
              rightElement && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center text-slate-500">
              {rightElement}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, inputSize, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// ═══════════════════════════════════════════════════════════════════════════
// TEXTAREA COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof inputVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg",
          "bg-slate-800 border border-slate-700",
          "text-slate-100 placeholder:text-slate-500",
          "px-3 py-2 text-sm",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          "focus:border-indigo-500 focus:ring-indigo-500/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "resize-none",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

// ═══════════════════════════════════════════════════════════════════════════
// SELECT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, inputSize, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          inputVariants({ variant, inputSize }),
          "cursor-pointer appearance-none",
          "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]",
          "bg-[length:1.5rem_1.5rem] bg-[right_0.5rem_center] bg-no-repeat",
          "pr-10",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

// ═══════════════════════════════════════════════════════════════════════════
// CHECKBOX COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const checkboxId = id || React.useId();
    
    return (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={checkboxId}
          className={cn(
            "h-4 w-4 rounded",
            "border border-slate-600 bg-slate-800",
            "text-indigo-600",
            "focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-0",
            "transition-colors duration-200",
            "cursor-pointer",
            className
          )}
          ref={ref}
          {...props}
        />
        {label && (
          <label
            htmlFor={checkboxId}
            className="text-sm text-slate-300 cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

// ═══════════════════════════════════════════════════════════════════════════
// RADIO COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface RadioProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    const radioId = id || React.useId();
    
    return (
      <div className="flex items-center gap-2">
        <input
          type="radio"
          id={radioId}
          className={cn(
            "h-4 w-4",
            "border border-slate-600 bg-slate-800",
            "text-indigo-600",
            "focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-0",
            "transition-colors duration-200",
            "cursor-pointer",
            className
          )}
          ref={ref}
          {...props}
        />
        {label && (
          <label
            htmlFor={radioId}
            className="text-sm text-slate-300 cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Radio.displayName = "Radio";

// ═══════════════════════════════════════════════════════════════════════════
// FORM FIELD (Label + Input + Helper text)
// ═══════════════════════════════════════════════════════════════════════════

interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-slate-300"
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SEARCH INPUT (Convenience wrapper)
// ═══════════════════════════════════════════════════════════════════════════

interface SearchInputProps extends Omit<InputProps, "leftElement" | "type"> {
  onClear?: () => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onClear, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        value={value}
        leftElement={
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
        rightElement={
          value && onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="hover:text-slate-300 transition-colors pointer-events-auto"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          ) : undefined
        }
        className={cn(
          "[&::-webkit-search-cancel-button]:hidden",
          className
        )}
        {...props}
      />
    );
  }
);
SearchInput.displayName = "SearchInput";

export {
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  FormField,
  SearchInput,
  inputVariants,
};
