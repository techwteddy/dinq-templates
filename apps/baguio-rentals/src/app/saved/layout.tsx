export default function SavedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`@media (max-width: 767px) { #site-footer { display: none; } }`}</style>
      {children}
    </>
  );
}
