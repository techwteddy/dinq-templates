"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";

import { saveDonateSiteContentAction } from "@/app/admin/(dashboard)/content/actions";
import {
  DONATE_FORM_FIELDS,
  type DonateContentField,
} from "@/lib/constants/donate-page-content-keys";
import type { DonatePageContent } from "@/lib/data/site-content";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputClass = cn(
  "flex min-h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm",
  "outline-none ring-offset-background focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
);

type FormState = { error?: string; ok?: boolean };

const initialFormState: FormState = {};

export function DonateContentForm({
  content,
}: {
  content: DonatePageContent;
}) {
  const router = useRouter();
  const [state, formAction] = useFormState(
    saveDonateSiteContentAction,
    initialFormState
  );
  const lastOk = useRef(false);

  useEffect(() => {
    if (state.ok && !lastOk.current) {
      lastOk.current = true;
      router.refresh();
    }
    if (!state.ok) lastOk.current = false;
  }, [state.ok, router]);

  return (
    <form action={formAction} className="space-y-8">
      {state.error ? (
        <p
          className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="text-sm text-primary" role="status">
          저장되었습니다. 후원 페이지에 반영되었습니다.
        </p>
      ) : null}

      <div className="space-y-6">
        {DONATE_FORM_FIELDS.map((spec) => (
          <div key={spec.field} className="space-y-2">
            <label
              htmlFor={spec.field}
              className="text-sm font-medium text-foreground"
            >
              {spec.label}
            </label>
            {spec.helper ? (
              <p className="text-xs text-muted-foreground">{spec.helper}</p>
            ) : null}
            {spec.multiline ? (
              <textarea
                id={spec.field}
                name={spec.field}
                rows={spec.field === "bankInfo" ? 5 : 4}
                defaultValue={content[spec.field as DonateContentField]}
                className={cn(inputClass, "min-h-24 resize-y")}
              />
            ) : (
              <input
                id={spec.field}
                name={spec.field}
                type={spec.inputType ?? "text"}
                defaultValue={content[spec.field as DonateContentField]}
                className={inputClass}
                autoComplete={spec.inputType === "email" ? "email" : undefined}
              />
            )}
          </div>
        ))}
      </div>

      <Button type="submit">저장</Button>
    </form>
  );
}
