import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import RootFormError from "@/components/ui/root-form-error";
import { api } from "@/trpc/react";
import type { StaffSchema } from "@/types/schema";
import type { UseFormReturn } from "react-hook-form";

type PersonalInfoFormProps = {
  form: UseFormReturn<StaffSchema>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
};

export default function PersonalInfoForm({
  form,
  onSubmit,
}: PersonalInfoFormProps) {
  const { data: userAlreadyExists } = api.tenant.userAlreadyExists.useQuery(
    form.getValues("email"),
  );

  return (
    <Form {...form}>
      {JSON.stringify(userAlreadyExists)}
      <form className="grid gap-4" onSubmit={onSubmit}>
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel htmlFor={field.name}>Email</FormLabel>
              <Input
                id={field.name}
                type="email"
                {...field}
                placeholder="john.doe@example.com"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <RootFormError error={form.formState.errors?.root?.message} />
      </form>
    </Form>
  );
}
