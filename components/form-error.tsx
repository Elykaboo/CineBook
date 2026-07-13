export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-sm text-red-600" role="alert">
      {message}
    </p>
  );
}

export function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-sm text-red-600">{messages[0]}</p>;
}
