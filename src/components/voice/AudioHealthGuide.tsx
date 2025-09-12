import React, { useRef, useState } from "react";
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import { storage } from "../../lib/firebase";

const AUDIO_PATH: Record<string, string> = {
  en: "audios/audio_en.mp3",
  hi: "audios/audio_hi.mp3",
  bn: "audios/audio_bn.mp3",
};

export default function AudioHealthGuide() {
  const audioEl = useRef<HTMLAudioElement | null>(null);
  const [playingLang, setPlayingLang] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function playAudio(lang: string) {
    setLoading(true);
    try {
      const ref = storageRef(storage, AUDIO_PATH[lang]);
      const url = await getDownloadURL(ref);
      if (audioEl.current) {
        audioEl.current.src = url;
        await audioEl.current.play();
        setPlayingLang(lang);
      }
    } catch (err) {
      console.error("Error loading audio:", err);
      alert("Audio not available for " + lang);
    } finally {
      setLoading(false);
    }
  }

  function pauseAudio() {
    if (audioEl.current) {
      audioEl.current.pause();
      setPlayingLang(null);
    }
  }

  return (
    <div className="p-6 bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-2 text-white">Audio Health Guide</h2>
      <p className="text-sm mb-4 text-gray-300">
        Listen to essential health guidelines in your preferred language.
      </p>

      <div className="flex gap-3 items-center mb-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            playingLang === "en" ? "bg-indigo-500 text-white" : "bg-gray-700 text-white"
          }`}
          onClick={() => playAudio("en")}
        >
          English
        </button>

        <button
          className={`px-4 py-2 rounded-lg ${
            playingLang === "hi" ? "bg-indigo-500 text-white" : "bg-gray-700 text-white"
          }`}
          onClick={() => playAudio("hi")}
        >
          हिन्दी
        </button>

        <button
          className={`px-4 py-2 rounded-lg ${
            playingLang === "bn" ? "bg-indigo-500 text-white" : "bg-gray-700 text-white"
          }`}
          onClick={() => playAudio("bn")}
        >
          বাংলা
        </button>

        <button
          className="ml-4 px-3 py-2 border rounded-lg text-white border-gray-500"
          onClick={pauseAudio}
        >
          Pause
        </button>
      </div>

      <audio ref={audioEl} controls className="w-full mt-2" />
      {loading && <div className="text-sm text-gray-400 mt-2">Loading audio…</div>}
    </div>
  );
}
