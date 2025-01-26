function ErrorView({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-red-500">{message}</p>
    </div>
  );
}
