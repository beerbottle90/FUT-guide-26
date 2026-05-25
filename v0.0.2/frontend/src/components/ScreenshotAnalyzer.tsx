import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { analyzeScreenshot } from "../api/client";
import ResultBox from "./ResultBox";

export default function ScreenshotAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult("");
    setError("");
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  }

  async function handleSubmit() {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const analysis = await analyzeScreenshot(file, question);
      setResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="card">
        <h2>📸 Ekran Görüntüsü Analizi</h2>

        <div
          className={`upload-area ${dragOver ? "drag-over" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} />
          {preview ? (
            <img src={preview} alt="Preview" className="preview-img" />
          ) : (
            <>
              <div className="upload-icon">🖼️</div>
              <p>
                <strong>Tıkla veya sürükle</strong> — FUT ekran görüntünü buraya yükle
              </p>
              <p style={{ fontSize: "0.8rem", marginTop: 6 }}>PNG, JPG, WEBP · max 20 MB</p>
            </>
          )}
        </div>

        <div className="form-group" style={{ marginTop: 16 }}>
          <label>Soru (opsiyonel)</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Örn: Bu kadroyu nasıl geliştirebilirim? Kimyayı nasıl artırabilirim?"
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!file || loading}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Analiz ediliyor...
            </>
          ) : (
            "Analiz Et"
          )}
        </button>

        {error && <div className="error-box">⚠️ {error}</div>}
      </div>

      {result && <ResultBox title="AI Analizi" content={result} />}
    </div>
  );
}
