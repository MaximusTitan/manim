"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [manimCode, setManimCode] = useState("");
  const [videoKey, setVideoKey] = useState<number>(0);

  const generateAnimation = async () => {
    try {
      const response = await fetch("/api/py/generate-animation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: manimCode }),
      });
      if (!response.ok) throw new Error("Animation generation failed");

      const data = await response.json();
      const timestamp = new Date().getTime();
      setVideoUrl(`/videos/1080p60/${data.filename}?t=${timestamp}`);
      setVideoKey(videoKey + 1);
    } catch (error) {
      console.error("Error generating animation:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (videoUrl && videoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Add animation section */}
      <div className="flex flex-col items-center gap-4">
        <textarea
          className="border p-2 w-full text-black"
          rows={6}
          value={manimCode}
          onChange={(e) => setManimCode(e.target.value)}
          placeholder="Enter your Manim class definition here"
        />
        <button
          onClick={generateAnimation}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Generate Manim Animation
        </button>

        {videoUrl && (
          <video key={videoKey} controls className="max-w-lg mt-4">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </main>
  );
}
