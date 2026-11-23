export function Coins({ className }: { className?: string }) {
  return (
    <video
      src="/coins.mp4"
      autoPlay
      muted
      loop
      playsInline
      aria-label="Claude, ChatGPT and Kimi coins"
      className={className}
    />
  );
}
