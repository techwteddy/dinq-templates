import Image from "next/image";

const Logo = ({ className = "", ...props }) => (
  <Image
    src="/logo_with_rf_bgr.jpg"
    alt="hero image"
    width={300}
    height={300}
    className={className}
    {...props}
  />
);

export default Logo;
