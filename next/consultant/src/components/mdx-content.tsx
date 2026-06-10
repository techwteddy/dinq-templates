import * as runtime from "react/jsx-runtime";
import ZoomableImage from "./ZoomableImage";
import WatercolorImage from "./WatercolorImage";
import YouTube from "./YouTube";
import { Callout } from "./Callout";

const sharedComponents = {
  Image: ZoomableImage,
  img: ZoomableImage,
  WatercolorImage,
  YouTube,
  Callout,
};

const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

interface MDXProps {
  code: string;
  // This is optional (?), so existing pages passing only 'code' won't break
  components?: Record<string, React.ComponentType<Record<string, unknown>>>;
}

export function MDXContent({ code, components }: MDXProps) {
  const Component = useMDXComponent(code);
  // We inject the shared components so your MDX files can access them automatically
  return <Component components={{ ...sharedComponents, ...components }} />;
}