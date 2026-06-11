"use client";

import { useEffect } from "react";

export default function OmniDimWidget() {
	useEffect(() => {
		const existingScript = document.getElementById("omnidimension-web-widget");
		if (!existingScript) {
			const script = document.createElement("script");
			script.id = "omnidimension-web-widget";
			script.src = `https://backend.omnidim.io/web_widget.js?secret_key=${process.env.NEXT_PUBLIC_OMNIDIM_SECRET_KEY}`;
			script.async = true;
			document.body.appendChild(script);
		}
	}, []);

	return null;
}
