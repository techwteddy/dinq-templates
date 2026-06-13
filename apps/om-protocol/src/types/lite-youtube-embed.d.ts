declare module "lite-youtube-embed" {
  // Side-effect import — registers the <lite-youtube> custom element
}

declare module "lite-youtube-embed/src/lite-yt-embed.css" {
  // CSS import
}

declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      "lite-youtube": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          videoid: string;
          playlabel?: string;
          params?: string;
        },
        HTMLElement
      >;
    }
  }
}
