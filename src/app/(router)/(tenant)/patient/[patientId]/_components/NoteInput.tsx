"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { NotepadText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useBoolean } from "react-hanger";
import { useForm } from "react-hook-form";
import { z } from "zod";

type NoteInputProps = {
    patientId: string;
    note?: string | null;
}

const noteSchema = z.object({
    note: z.string().max(250).optional()
});

type FormValues = z.infer<typeof noteSchema>;
export default function NoteInput({ patientId, note = "" }: NoteInputProps) {
    const t = useTranslations("page.patient.header.note");
    const router = useRouter();
    const isEditing = useBoolean(false);
    const { mutate: updatePatient, isPending } = api.patient.update.useMutation({
        onSettled: () => {
            isEditing.setFalse();
            router.refresh();
        }
    });

    const form = useForm<FormValues>({
        defaultValues: {
            note: note ?? ""
        }
    });

    const onSubmit = form.handleSubmit(async (data) => {
        updatePatient({ id: patientId, note: data.note });
    });

    const cancelEditing = () => {
        form.reset();
        isEditing.setFalse();
    }

    return (
        <Form {...form}>
            <form onSubmit={onSubmit}>
                <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) =>
                        <FormItem>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className={cn("border border-input rounded-md horizontal center-v px-2",
                                        {
                                            "bg-muted": !isEditing.value
                                        }
                                    )}>
                                        <NotepadText className={cn("size-5 shrink-0 text-muted-foreground")} />
                                        <Input
                                            id={field.name}
                                            readOnly={!isEditing.value}
                                            {...field}
                                            className={cn("bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 md:text-sm text-ellipsis md:w-[400px]",
                                                {
                                                    "text-muted-foreground bg-muted": !isEditing.value
                                                }
                                            )} placeholder="Add a note"
                                        />
                                        <Button
                                            variant='link'
                                            type="button"
                                            disabled={isPending}
                                            onClick={cancelEditing}
                                            className={cn("text-destructive !px-0",
                                                {
                                                    "hidden": !isEditing.value
                                                }
                                            )}
                                        >
                                            {t("cancel")}
                                        </Button>

                                        <Button
                                            variant="link"
                                            type="button"
                                            className="text-link hover:text-link-hover !px-0 ml-2"
                                            onClick={!isEditing.value ? isEditing.toggle : onSubmit}
                                            disabled={isEditing.value && (!form.formState.isDirty || isPending)}
                                            isLoading={isPending}
                                        >
                                            {isEditing.value ? t("save") : t("edit")}
                                        </Button>
                                    </span>
                                </TooltipTrigger>
                                {!isEditing.value && note && <TooltipContent>
                                    {note}
                                </TooltipContent>}
                            </Tooltip>
                        </FormItem>
                    } />
            </form>
        </Form>
    )
}
