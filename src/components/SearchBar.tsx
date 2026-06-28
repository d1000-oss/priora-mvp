import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  showShortcut?: boolean;
}

export function SearchBar({ placeholder = 'Buscar...', value, onChange, showShortcut }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full pl-11 pr-16 py-3 bg-white border border-gray-200 rounded-xl text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-priora-100 focus:border-priora-400 transition-all"
      />
      {showShortcut && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-text-tertiary">
          <kbd className="px-1.5 py-0.5 text-[11px] font-medium bg-gray-100 rounded border border-gray-200">&#8984;</kbd>
          <kbd className="px-1.5 py-0.5 text-[11px] font-medium bg-gray-100 rounded border border-gray-200">K</kbd>
        </div>
      )}
    </div>
  );
}
