import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-8">
      <div className="text-center max-w-md">
        {icon && (
          <div className="mb-4 text-5xl opacity-50">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">
          {title}
        </h3>
        <p className="text-sm text-zinc-600 mb-6">
          {description}
        </p>
        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center rounded-full bg-[#2FB190] px-6 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#27a07d]"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}







