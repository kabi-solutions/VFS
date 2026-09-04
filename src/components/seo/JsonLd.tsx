type JsonLdValue = Record<string, unknown> | Record<string, unknown>[];

/** Renders a JSON-LD script tag for search / LLM structured data. */
export function JsonLd({ data }: { data: JsonLdValue }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
