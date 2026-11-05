"use client";

import { useEffect, useRef, useState } from "react";
import {
  Sparkles, Image as ImageIcon, Video, Clapperboard, Images, Settings,
  Sun, Moon, Monitor, Download, WandSparkles, Clock3, Menu, X, Upload,
  LoaderCircle, Play, Trash2, ChevronDown, ShieldCheck, Film
} from "lucide-react";

type Mode = "image" | "text-video" | "image-video";
type Creation = { id: string; mode: Mode; prompt: string; url: string; createdAt: string; status: string };

const demoImages = [
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&q=85",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=85",
  "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1200&q=85"
];

export default function Home() {
  const [mode, setMode] = useState<Mode>("image");
  const [prompt, setPrompt] = useState("");
  const [ratio, setRatio] = useState("16:9");
  const [quality, setQuality] = useState("HD");
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("Demo mode is on. Add API keys to enable real generation.");
  const [creations, setCreations] = useState<Creation[]>([]);
  const [resultUrl, setResultUrl] = useState("");
  const [uploaded, setUploaded] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("adi-creations");
      if (saved) setCreations(JSON.parse(saved));
      const savedTheme = localStorage.getItem("adi-theme") as "dark" | "light" | "system" | null;
      if (savedTheme) setTheme(savedTheme);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("adi-theme", theme); } catch {}
  }, [theme]);

  function saveCreation(item: Creation) {
    setCreations(prev => {
      const next = [item, ...prev].slice(0, 40);
      try { localStorage.setItem("adi-creations", JSON.stringify(next)); } catch {}
      return next;
    });
  }

  async function generate() {
    if (!prompt.trim()) { setNotice("Please enter a prompt first."); return; }
    if (mode === "image-video" && !uploaded) { setNotice("Upload an image first for Image to Video."); return; }
    setBusy(true); setNotice("Preparing your generation…"); setResultUrl("");
    try {
      const form = new FormData();
      form.append("prompt", prompt);
      form.append("ratio", ratio);
      form.append("quality", quality);
      form.append("mode", mode);
      if (uploaded) {
        const blob = await fetch(uploaded).then(r => r.blob());
        form.append("image", blob, "source-image.png");
      }
      const res = await fetch("/api/generate", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed.");
      const url = data.url as string;
      setResultUrl(url);
      setNotice(data.demo ? "Demo result created. Connect an API for real AI generation." : "Generation complete.");
      saveCreation({ id: crypto.randomUUID(), mode, prompt, url, createdAt: new Date().toISOString(), status: data.demo ? "Demo" : "Complete" });
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Something went wrong.");
    } finally { setBusy(false); }
  }

  function handleUpload(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setNotice("Please choose an image file."); return; }
    if (file.size > 10 * 1024 * 1024) { setNotice("Image must be smaller than 10 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => setUploaded(String(reader.result));
    reader.readAsDataURL(file);
  }

  const modeTitle = mode === "image" ? "Text to Image" : mode === "text-video" ? "Text to Video" : "Image to Video";

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "open" : ""}`}>
        <div className="brand"><div className="brand-mark"><Sparkles size={21}/></div><div><b>ADI AI STUDIO</b><span>PERSONAL CREATIVE LAB</span></div><button className="mobile-close icon-btn" onClick={() => setMobileMenu(false)}><X size={18}/></button></div>
        <div className="side-label">WORKSPACE</div>
        <button className={`nav-item ${mode === "image" ? "active" : ""}`} onClick={() => {setMode("image");setMobileMenu(false);}}><ImageIcon size={18}/> Image Generator</button>
        <button className={`nav-item ${mode === "text-video" ? "active" : ""}`} onClick={() => {setMode("text-video");setMobileMenu(false);}}><Video size={18}/> Text to Video</button>
        <button className={`nav-item ${mode === "image-video" ? "active" : ""}`} onClick={() => {setMode("image-video");setMobileMenu(false);}}><Clapperboard size={18}/> Image to Video</button>
        <div className="side-label space-top">LIBRARY</div>
        <a className="nav-item" href="#gallery"><Images size={18}/> My Creations <span className="nav-count">{creations.length}</span></a>
        <div className="sidebar-bottom">
          <div className="private-card"><ShieldCheck size={17}/><div><b>Private workspace</b><span>Your browser history stays on this device.</span></div></div>
          <div className="profile"><div className="avatar">A</div><div><b>My Studio</b><span>Personal account</span></div><Settings size={17}/></div>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={() => setMobileMenu(true)}><Menu size={20}/></button>
          <div className="crumb">Workspace <span>/</span> <b>{modeTitle}</b></div>
          <div className="top-actions">
            <div className="theme-switch" title="Theme">
              <button className={theme === "light" ? "selected" : ""} onClick={() => setTheme("light")} aria-label="Light theme"><Sun size={15}/></button>
              <button className={theme === "dark" ? "selected" : ""} onClick={() => setTheme("dark")} aria-label="Dark theme"><Moon size={15}/></button>
              <button className={theme === "system" ? "selected" : ""} onClick={() => setTheme("system")} aria-label="System theme"><Monitor size={15}/></button>
            </div>
            <div className="status-pill"><span/> Personal Studio</div>
          </div>
        </header>

        <div className="content">
          <div className="welcome-row"><div><div className="eyebrow"><Sparkles size={14}/> YOUR AI CREATIVE WORKSPACE</div><h1>Imagine it. <span>Create it.</span></h1><p>Turn your ideas into images and cinematic videos.</p></div><div className="welcome-chip"><WandSparkles size={17}/> Made for your imagination</div></div>

          <div className="mode-tabs">
            <button className={mode === "image" ? "chosen" : ""} onClick={() => setMode("image")}><ImageIcon size={17}/> Image</button>
            <button className={mode === "text-video" ? "chosen" : ""} onClick={() => setMode("text-video")}><Video size={17}/> Text to Video</button>
            <button className={mode === "image-video" ? "chosen" : ""} onClick={() => setMode("image-video")}><Film size={17}/> Image to Video</button>
          </div>

          <div className="studio-grid">
            <section className="panel create-panel">
              <div className="panel-heading"><div><h2>{modeTitle}</h2><p>{mode === "image" ? "Describe the image you want to create." : mode === "text-video" ? "Describe the video scene you want to bring to life." : "Upload a still image and describe its motion."}</p></div><span className="model-tag">AI STUDIO</span></div>
              {mode === "image-video" && <div className="upload-zone" onClick={() => fileRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => {e.preventDefault();handleUpload(e.dataTransfer.files?.[0]);}}>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => handleUpload(e.target.files?.[0])}/>
                {uploaded ? <img src={uploaded} alt="Uploaded source"/> : <><div className="upload-icon"><Upload size={20}/></div><b>Upload an image</b><span>PNG, JPG or WEBP · up to 10 MB</span></>}
                {uploaded && <button className="remove-upload" onClick={e => {e.stopPropagation();setUploaded("");}}><Trash2 size={14}/> Remove</button>}
              </div>}
              <label className="field-label" htmlFor="prompt">PROMPT</label>
              <textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={mode === "image" ? "A cinematic photograph of a quiet mountain village at golden hour, ultra realistic, detailed textures..." : mode === "text-video" ? "A slow cinematic camera push through a misty forest at sunrise, leaves moving gently in the wind..." : "The camera slowly moves closer, hair and clothes move naturally in a soft breeze..."} rows={5}/>
              <div className="prompt-foot"><span>Be descriptive for better results</span><span>{prompt.length}/1200</span></div>
              <div className="settings-row">
                <div className="setting"><label>ASPECT RATIO</label><div className="select-wrap"><select value={ratio} onChange={e => setRatio(e.target.value)}><option>16:9</option><option>9:16</option><option>1:1</option><option>4:5</option><option>3:2</option></select><ChevronDown size={14}/></div></div>
                <div className="setting"><label>QUALITY</label><div className="select-wrap"><select value={quality} onChange={e => setQuality(e.target.value)}><option>HD</option><option>4K</option></select><ChevronDown size={14}/></div></div>
              </div>
              <button className="generate-btn" onClick={generate} disabled={busy}>{busy ? <><LoaderCircle className="spin" size={18}/> Generating…</> : <><Sparkles size={17}/> Generate {mode === "image" ? "Image" : "Video"}</>}</button>
              <div className="notice"><span className="notice-dot"/> {notice}</div>
            </section>

            <section className="panel preview-panel">
              <div className="panel-heading"><div><h2>Preview</h2><p>Your generated result will appear here.</p></div><span className="preview-label">LIVE PREVIEW</span></div>
              <div className={`preview-stage ${resultUrl ? "has-result" : ""}`}>
                {busy ? <div className="loading-state"><div className="loader-orbit"><Sparkles size={24}/></div><b>Creating your {mode === "image" ? "image" : "video"}…</b><span>This may take a little while.</span></div> :
                 resultUrl ? (mode === "image" ? <img src={resultUrl} alt="Generated result"/> : <video src={resultUrl} controls playsInline />) :
                 <div className="empty-state"><div className="empty-art"><div className="art-sun"/><div className="art-mountain one"/><div className="art-mountain two"/><Sparkles className="art-star" size={22}/></div><b>Your canvas is waiting</b><span>Write a prompt and hit generate to get started.</span></div>}
              </div>
              {resultUrl && <a className="download-btn" href={resultUrl} download><Download size={16}/> Download result</a>}
              <div className="preview-meta"><span><Clock3 size={14}/> Results are saved in this browser</span><span>{ratio} · {quality}</span></div>
            </section>
          </div>

          <section className="gallery-section" id="gallery">
            <div className="gallery-heading"><div><h2>My Creations</h2><p>Your recent generations, saved locally in this browser.</p></div><span>{creations.length} items</span></div>
            {creations.length === 0 ? <div className="gallery-empty"><Images size={22}/><span>Your creations will show up here.</span></div> :
              <div className="gallery-grid">{creations.map(item => <article className="creation-card" key={item.id}><div className="creation-media">{item.mode === "image" ? <img src={item.url} alt={item.prompt}/> : <video src={item.url} controls/>}<span>{item.mode === "image" ? "IMAGE" : "VIDEO"}</span></div><div className="creation-info"><p>{item.prompt}</p><div><small>{new Date(item.createdAt).toLocaleString()}</small><a href={item.url} download><Download size={14}/></a></div></div></article>)}</div>}
          </section>
          <footer>ADI AI STUDIO <span>·</span> Personal creative workspace <span>·</span> Keep your API keys private</footer>
        </div>
      </section>
    </main>
  );
}
