import { useLang } from "../context/LangContext";

interface ResultBoxProps {
  title?: string;
  content: string;
}

function formatContent(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/^#{1,3}\s+(.+)$/gm, "<strong>$1</strong>")
    .replace(/^[-•]\s+/gm, "  • ");
}

export default function ResultBox({ title, content }: ResultBoxProps) {
  const { t } = useLang();
  return (
    <div className="result-box">
      <h3>{title ?? t("result_default_title")}</h3>
      <div
        className="result-content"
        dangerouslySetInnerHTML={{ __html: formatContent(content) }}
      />
    </div>
  );
}
