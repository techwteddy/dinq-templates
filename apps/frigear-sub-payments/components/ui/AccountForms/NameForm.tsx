"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { updateName } from "@/utils/auth-helpers/server";
import { handleRequest } from "@/utils/auth-helpers/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import { string } from "zod";

export default function NameForm({ userName }: { userName: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firstName = userName.split(" ")[0] as string;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // Check if the new name is the same as the old name
    if (e.currentTarget.fullName.value === userName) {
      e.preventDefault();
      setIsSubmitting(false);
      return;
    }
    handleRequest(e, updateName, router);
    setIsSubmitting(false);
  };

  return (
    <Card
      title={`Fuldt navn`}
      description={`Her er dit smækre navn ${firstName}. Du kan opdatere det hvis du vil, men vi bruger det kun til at finde dig i vrimlen og det vises ikke offenligt.`}
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0">Max 64 karakterer</p>
          <Button
            variant="slim"
            type="submit"
            form="nameForm"
            loading={isSubmitting}
          >
            Opdatér navn
          </Button>
        </div>
      }
    >
      <div className="mt-8 mb-4 text-xl font-semibold">
        <form id="nameForm" onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            name="fullName"
            className="sm:w-1/2 p-3 rounded-md bg-zinc-800 w-full"
            defaultValue={userName ?? ""}
            placeholder={`Dit skønne fulde navn...`}
            maxLength={64}
          />
        </form>
      </div>
    </Card>
  );
}
