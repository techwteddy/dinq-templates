export default function BackgroundImage() {
  return (
    <div className="fixed inset-0 -z-10" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-peach/30 via-lavender/20 to-sage/20" />
      <div className="absolute inset-0 bg-background/85" />
    </div>
  );
}
