import {
  Form,
  FormControl,
  FormFieldCompact,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { useTranslations } from "next-intl";
import { Controller, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { DateTimePicker } from "../datetime-input/datetime";
import { PhoneInput } from "../phone-input";

export const patientSchema = z.object({
  firstName: z.string({
    required_error: "First name is required",
  }),
  lastName: z.string({
    required_error: "Last name is required",
  }),
  email: z.string().email(),
  phone: z.string({
    required_error: "Phone number is required",
  }),
  dob: z.date({
    required_error: "Date of birth is required",
    invalid_type_error: "Date of birth is required",
  }),
  gender: z.string({
    required_error: "Gender is required",
  }),
  city: z.string().optional(),
  county: z.string().optional(),
});

export type FormValues = z.infer<typeof patientSchema>;

type PatientFormProps = {
  form: UseFormReturn<FormValues>;
};

export default function PatientForm({ form }: PatientFormProps) {
  const t = useTranslations("page.patients.fields");

  const { data: counties } = api.utils.getCounties.useQuery();
  const { data: cities } = api.utils.getCities.useQuery(form.watch("county"), {
    enabled: !!form.watch("county"),
  });

  const handleCountyChange = (value: string) => {
    form.setValue("county", value);
    form.setValue("city", undefined);
  };

  const handleCityChange = (value: string) => {
    form.setValue("city", value);
  };

  return (
    <Form {...form}>
      <form className="grid grid-cols-4 gap-4 py-4">
        <FormFieldCompact
          className="col-span-2"
          control={form.control}
          name="firstName"
          label={t("firstName.label")}
          render={({ field }) => <Input {...field} placeholder="First Name" />}
        />
        <FormFieldCompact
          className="col-span-2"
          control={form.control}
          name="lastName"
          label={t("lastName.label")}
          render={({ field }) => <Input {...field} placeholder="Last Name" />}
        />
        <Controller
          name="dob"
          control={form.control}
          render={({ field }) => (
            <FormFieldCompact
              className="col-span-2"
              control={form.control}
              name="dob"
              label={t("dob.label")}
              render={() => (
                <DateTimePicker
                  granularity="day"
                  jsDate={field.value}
                  onJsDateChange={field.onChange}
                />
              )}
            />
          )}
        />
        <FormFieldCompact
          className="col-span-2"
          control={form.control}
          name="gender"
          label={t("gender.label")}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value)}
                  className="col-span-2 grid grid-cols-2 gap-4"
                  value={field.value}
                  name={field.name}
                >
                  <FormItem className="col-span-1 w-full">
                    <FormLabel className="group w-full">
                      <FormControl>
                        <RadioGroupItem value="M" className="sr-only" />
                      </FormControl>
                      <div className="relative flex h-10 w-full cursor-pointer items-center justify-center gap-4 rounded-lg border border-border p-4 group-has-[:checked]:border-primary">
                        {t("gender.options.M")}
                      </div>
                    </FormLabel>
                  </FormItem>
                  <FormItem className="col-span-1 w-full">
                    <FormLabel className="group w-full">
                      <FormControl>
                        <RadioGroupItem value="F" className="sr-only" />
                      </FormControl>
                      <div className="relative flex h-10 w-full cursor-pointer items-center justify-center gap-4 rounded-lg border border-border p-4 group-has-[:checked]:border-primary">
                        {t("gender.options.F")}
                      </div>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <FormFieldCompact
          className="col-span-4"
          control={form.control}
          name="email"
          label={t("email.label")}
          render={({ field }) => (
            <Input {...field} placeholder="email@example.com" />
          )}
        />
        <Controller
          name="phone"
          control={form.control}
          render={({ field }) => (
            <FormFieldCompact
              className="col-span-4"
              control={form.control}
              name="phone"
              label={t("phone.label")}
              render={() => (
                <PhoneInput
                  id={field.name}
                  autoComplete="tel"
                  {...field}
                  required={false}
                />
              )}
            />
          )}
        />
        <FormFieldCompact
          className="col-span-2"
          control={form.control}
          name="county"
          label={t("county.label")}
          render={({ field }) => (
            <Select onValueChange={handleCountyChange}>
              <SelectTrigger disabled={counties?.length === 0}>
                <SelectValue {...field} placeholder={t("county.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {counties?.map((county, index) => (
                  <SelectItem key={index} value={county.name}>
                    {county.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FormFieldCompact
          className="col-span-2"
          control={form.control}
          name="city"
          label={
            form.getValues("county") === "București"
              ? t("sector.label")
              : t("city.label")
          }
          render={({ field }) => (
            <Select onValueChange={handleCityChange}>
              <SelectTrigger
                disabled={!form.watch("county") || cities?.length === 0}
              >
                <SelectValue
                  {...field}
                  placeholder={
                    form.getValues("county") === "București"
                      ? t("sector.placeholder")
                      : t("city.placeholder")
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {cities?.map((city, index) => (
                  <SelectItem key={index} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </form>
    </Form>
  );
}
