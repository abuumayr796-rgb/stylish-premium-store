import { useEffect, useMemo, useState } from "react";
import { shopRequest } from "@/lib/api";
import { toast } from "sonner";

export interface SiteText {
  key: string;
  value: string;
  label: string;
  section: string;
}

interface Props {
  texts: SiteText[];
  password: string;
  onSaved: () => void;
}

const TextsEditor = ({ texts, password, onSaved }: Props) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValues(Object.fromEntries(texts.map((t) => [t.key, t.value])));
  }, [texts]);

  const sections = useMemo(() => {
    const map: Record<string, SiteText[]> = {};
    texts.forEach((t) => (map[t.section] ||= []).push(t));
    return Object.entries(map);
  }, [texts]);

  const changed = texts.filter((t) => values[t.key] !== t.value);

  const save = async () => {
    setSaving(true);
    try {
      await shopRequest("save_texts", {
        body: { texts: Object.fromEntries(changed.map((t) => [t.key, values[t.key]])) },
        password,
      });
      toast.success("Надписи обновлены");
      onSaved();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-4 pb-24">
      {sections.map(([section, items]) => (
        <div key={section} className="rounded-[10px] bg-card p-5 md:p-8">
          <h3 className="mb-5 font-display text-2xl font-medium">{section}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((t) => {
              const long = t.value.length > 40 || t.value.includes("\n");
              return (
                <label key={t.key} className={long ? "md:col-span-2" : ""}>
                  <span className="mb-1.5 block font-display text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {t.label}
                  </span>
                  {long ? (
                    <textarea
                      value={values[t.key] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [t.key]: e.target.value }))}
                      rows={t.value.includes("\n") ? 3 : 2}
                      className="w-full rounded-[10px] bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  ) : (
                    <input
                      value={values[t.key] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [t.key]: e.target.value }))}
                      className="h-11 w-full rounded-[10px] bg-background px-4 outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  )}
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <div className="fixed inset-x-0 bottom-0 z-30 px-3 pb-3 md:px-4 md:pb-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-[10px] bg-primary px-5 py-3 text-primary-foreground">
          <span className="text-sm">{changed.length ? `Изменено: ${changed.length}` : "Изменений нет"}</span>
          <button
            onClick={save}
            disabled={!changed.length || saving}
            className="h-11 rounded-full bg-primary-foreground px-7 font-display font-medium text-primary disabled:opacity-50"
          >
            {saving ? "Сохраняю…" : "Сохранить надписи"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextsEditor;
