import Image from "next/image";

const Logo = ({ className = "", ...props }) => (
  <Image
    src="/six_logo.png"
    width={25}
    height={25}
    alt="Blockstarter Logo"
    className={className}
    {...props}
  />
);

export default Logo;
