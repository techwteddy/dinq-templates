"use client";

import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

export default function YouTube({ id }: { id: string }) {
    return (
        <div className="my-8 w-full overflow-hidden rounded-xl border-2 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(0,128,128,0.2)] [&_.yt-lite]:w-full">
            <LiteYouTubeEmbed
                id={id}
                title="YouTube video player"
                params="rel=0&modestbranding=1"
            />
        </div>
    );
}