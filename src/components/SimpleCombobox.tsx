import { ChevronsUpDownIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ComboboxOption {
  id: string;
  label: string;
}

interface SimpleComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange: (id: string) => void;
  placeholder?: string;
}

export function SimpleCombobox({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
}: SimpleComboboxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  const selected = options.find((opt) => opt.id === value);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setClosing(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup after animation ends
  const handleTransitionEnd = () => {
    if (closing) {
      setOpen(false);
      setClosing(false);
    }
  };

  const handleSelect = (id: string) => {
    const selectedOption = options.find((opt) => opt.id === id);
    onChange(id);
    setQuery(selectedOption?.label || "");
    setClosing(true);
  };

  return (
    <div className="relative " ref={containerRef}>
      <input
        type="text"
        value={query || selected?.label || ""}
        placeholder={placeholder}
        onFocus={() => {
          setQuery(selected?.label || "");
          setOpen(true);
          setClosing(false);
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setClosing(false);
        }}
        className="h-11 w-full rounded-lg border appearance-none px-4 py-2 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-1 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
      />

      <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
        <ChevronsUpDownIcon />
      </span>
      {open && (
        <ul
          onTransitionEnd={handleTransitionEnd}
          className={`absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto transform transition-all duration-200 ease-out
            ${closing ? "opacity-0 scale-95" : "opacity-100 scale-100"}
            custom-scroll-dropdown
          `}
        >
          {filtered.length ? (
            filtered.map((opt) => (
              <li
                key={opt.id}
                onMouseDown={() => handleSelect(opt.id)}
                className="cursor-pointer px-3 py-2 hover:bg-gray-100"
              >
                {opt.label}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-500">No options</li>
          )}
        </ul>
      )}
    </div>
  );
}
