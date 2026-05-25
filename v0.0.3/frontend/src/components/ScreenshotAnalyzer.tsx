import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { analyzeScreenshot } from "../api/client";
import ResultBox from "./ResultBox";
import { useLang } from "../context/LangContext";

export default function ScreenshotAnalyzer() {
  const { t } = useLang();
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
      setError(err instanceof Error ? err.message : t("error_generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="card">
        <h2>{t("analyze_title")}</h2>

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
                <strong>{t("analyze_click_drag")}</strong> {t("analyze_upload_hint")}
              </p>
              <p style={{ fontSize: "0.8rem", marginTop: 6 }}>PNG, JPG, WEBP · max 20 MB</p>
            </>
          )}
        </div>

        <div className="form-group" style={{ marginTop: 16 }}>
          <label>{t("analyze_question_label")}</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t("analyze_question_placeholder")}
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
              {t("analyze_loading")}
            </>
          ) : (
            t("analyze_btn")
          )}
        </button>

        {error && <div className="error-box">⚠️ {error}</div>}
      </div>

      {result && <ResultBox title={t("analyze_result_title")} content={result} />}
    </div>
  );
}
