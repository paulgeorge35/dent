import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaBody,
  CredenzaFooter,
} from "@/components/ui/credenza";
import { type UseFormReturn } from "react-hook-form";
import { type AppointmentSchema } from "./calendar";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DateTimePicker } from "@/components/datetime-input/datetime-picker";
import { DatePicker } from "@/components/datetime-input/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (_value: boolean) => void;
  form: UseFormReturn<AppointmentSchema>;
}

export default function AppointmentDialog({
  open,
  onOpenChange,
  form,
}: AppointmentDialogProps) {
  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };

  const isNew = !form.getValues("id");

  const onSubmit = form.handleSubmit(async (values: AppointmentSchema) => {
    console.log(values);
    onOpenChange(false);
    form.reset();
  });

  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CredenzaContent className="event-form">
            <CredenzaHeader>
              <CredenzaTitle>
                {isNew ? "New appointment" : "Edit appointment"}
              </CredenzaTitle>
            </CredenzaHeader>
            <CredenzaBody>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  rules={{
                    required: "First name is required",
                    minLength: {
                      value: 2,
                      message: "First name must be at least 2 characters",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem className="col-span-1 w-full">
                      <FormLabel htmlFor={field.name}>First name</FormLabel>
                      <Input id={field.name} {...field} placeholder="John" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  rules={{
                    required: "Last name is required",
                    minLength: {
                      value: 2,
                      message: "Last name must be at least 2 characters",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem className="col-span-1 w-full">
                      <FormLabel htmlFor={field.name}>Last name</FormLabel>
                      <Input id={field.name} {...field} placeholder="Doe" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="col-span-1 w-full">
                      <FormLabel htmlFor={field.name}>Email</FormLabel>
                      <Input
                        id={field.name}
                        type="email"
                        {...field}
                        placeholder="john@example.com"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator className="col-span-2" />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2 w-full">
                      <Textarea
                        id={field.name}
                        {...field}
                        value={field.value ?? undefined}
                        className="max-h-32"
                        placeholder="Description"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="allDay"
                  render={({ field }) => (
                    <FormItem className="horizontal center-v col-span-2 space-x-4 space-y-0 rounded-md border border-dashed border-border bg-accent/50 p-4 py-3">
                      <Checkbox
                        className="m-0"
                        id={field.name}
                        checked={field.value}
                        onClick={() => field.onChange(!field.value)}
                      />
                      <span className="vertical">
                        <FormLabel
                          className="horizontal center-v"
                          htmlFor={field.name}
                        >
                          All day
                        </FormLabel>
                        <FormDescription
                          onClick={() => field.onChange(!field.value)}
                        >
                          Check this box if the event lasts all day
                        </FormDescription>
                        <FormMessage />
                      </span>
                    </FormItem>
                  )}
                />
                {form.getValues("allDay") ? (
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="col-span-2 w-full">
                        <DatePicker
                          id={field.name}
                          date={field.value}
                          setDate={field.onChange}
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <span className="horizontal col-span-2 justify-between gap-4">
                    <FormField
                      control={form.control}
                      name="start"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <DateTimePicker
                            id={field.name}
                            date={field.value ?? undefined}
                            setDate={field.onChange}
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="end"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <DateTimePicker
                            id={field.name}
                            date={field.value ?? undefined}
                            setDate={field.onChange}
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </span>
                )}
              </div>
            </CredenzaBody>
            <CredenzaFooter className="gap-4">
              <Button onClick={handleCancel} variant="ghost">
                Cancel
              </Button>
              <Button onClick={onSubmit} type="submit">
                Submit
              </Button>
            </CredenzaFooter>
          </CredenzaContent>
        </form>
      </Form>
    </Credenza>
  );
}
