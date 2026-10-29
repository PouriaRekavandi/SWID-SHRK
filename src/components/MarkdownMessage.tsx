import React from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { TabKey } from '../types';

interface MarkdownMessageProps {
  content: string;
  onSelectTab?: (tab: TabKey) => void;
}

export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content, onSelectTab }) => {
  // Split lines to parse headings, list items, and paragraphs
  const lines = content.split('\n');

  const renderFormattedInline = (text: string) => {
    // Regex for markdown links: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push(renderBoldAndCode(text.substring(lastIndex, matchIndex), `text-${lastIndex}`));
      }

      const linkText = match[1];
      const linkUrl = match[2];

      if (linkUrl.startsWith('#') && onSelectTab) {
        const tabKey = linkUrl.substring(1) as TabKey;
        parts.push(
          <button
            key={`btn-tab-${matchIndex}`}
            onClick={(e) => {
              e.preventDefault();
              onSelectTab(tabKey);
            }}
            className="inline-flex items-center gap-1 font-bold text-[#00b8ff] hover:text-[#00ff41] underline underline-offset-2 transition-colors cursor-pointer mx-1"
          >
            <span>{linkText}</span>
            <ArrowRight className="w-3 h-3 inline" />
          </button>
        );
      } else {
        parts.push(
          <a
            key={`link-${matchIndex}`}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-[#00b8ff] hover:text-[#00ff41] dark:text-[#00b8ff] dark:hover:text-[#00ff41] underline underline-offset-2 transition-colors break-words mx-1"
          >
            <span>{linkText}</span>
            <ExternalLink className="w-3 h-3 inline flex-none" />
          </a>
        );
      }

      lastIndex = matchIndex + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(renderBoldAndCode(text.substring(lastIndex), `text-${lastIndex}`));
    }

    return parts.length > 0 ? parts : text;
  };

  const renderBoldAndCode = (text: string, baseKey: string) => {
    // Support **bold** and `code`
    const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
    const segments: React.ReactNode[] = [];
    let curIdx = 0;
    let m;

    while ((m = regex.exec(text)) !== null) {
      if (m.index > curIdx) {
        segments.push(text.substring(curIdx, m.index));
      }
      const raw = m[0];
      if (raw.startsWith('**') && raw.endsWith('**')) {
        segments.push(
          <strong key={`${baseKey}-b-${m.index}`} className="font-bold dark:text-white text-slate-900">
            {raw.slice(2, -2)}
          </strong>
        );
      } else if (raw.startsWith('`') && raw.endsWith('`')) {
        segments.push(
          <code
            key={`${baseKey}-c-${m.index}`}
            className="px-1.5 py-0.5 rounded text-[11px] font-mono dark:bg-zinc-800 bg-slate-200 dark:text-[#00ff41] text-emerald-700 border dark:border-zinc-700 border-slate-300"
          >
            {raw.slice(1, -1)}
          </code>
        );
      }
      curIdx = m.index + raw.length;
    }

    if (curIdx < text.length) {
      segments.push(text.substring(curIdx));
    }

    return <React.Fragment key={baseKey}>{segments}</React.Fragment>;
  };

  return (
    <div className="space-y-2 text-xs sm:text-sm font-mono leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Heading 3
        if (line.startsWith('### ')) {
          return (
            <h3
              key={idx}
              className="text-sm sm:text-base font-bold dark:text-[#00ff41] text-emerald-700 tracking-wide pt-2 pb-1 border-b dark:border-zinc-800/80 border-slate-200"
            >
              {renderFormattedInline(line.substring(4))}
            </h3>
          );
        }

        // Heading 4
        if (line.startsWith('#### ')) {
          return (
            <h4
              key={idx}
              className="text-xs sm:text-sm font-bold dark:text-[#00b8ff] text-sky-700 tracking-wider pt-1.5"
            >
              {renderFormattedInline(line.substring(5))}
            </h4>
          );
        }

        // Bullet point
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
          const indentLevel = line.search(/\S/);
          const bulletContent = trimmed.substring(2);
          return (
            <div
              key={idx}
              className="flex items-start gap-2 text-xs sm:text-sm"
              style={{ paddingLeft: `${Math.max(0, indentLevel) * 0.5}rem` }}
            >
              <span className="text-[#00ff41] flex-none select-none font-bold">›</span>
              <div className="flex-1 leading-relaxed">{renderFormattedInline(bulletContent)}</div>
            </div>
          );
        }

        // Numbered list item
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm pl-1">
              <span className="text-[#00b8ff] flex-none font-bold select-none">{numMatch[1]}.</span>
              <div className="flex-1 leading-relaxed">{renderFormattedInline(numMatch[2])}</div>
            </div>
          );
        }

        // Standard paragraph
        return (
          <p key={idx} className="leading-relaxed">
            {renderFormattedInline(line)}
          </p>
        );
      })}
    </div>
  );
};
