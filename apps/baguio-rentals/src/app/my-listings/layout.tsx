export default function MyListingsLayout({
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
