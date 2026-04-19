interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      className="flex items-center gap-2 rounded-md border border-[#F38181] bg-[#F38181]/10 px-4 py-3 text-[#F38181]"
      style={{ borderColor: '#F38181', backgroundColor: 'rgba(243, 129, 129, 0.1)', color: '#F38181' }}
    >
      <span className="text-xl">⚠️</span>
      <span className="text-sm">{message}</span>
    </div>
  );
}
