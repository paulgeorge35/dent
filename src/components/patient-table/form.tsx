import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api } from "@/trpc/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { CitySelect } from "../address-input/city-input";
import { CountySelect } from "../address-input/county-input";
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
  city: z
    .string({
      required_error: "City is required",
    })
    .min(1, "City is required"),
  county: z
    .string({
      required_error: "County is required",
    })
    .min(1, "County is required"),
});

export type FormValues = z.infer<typeof patientSchema>;

type PatientFormProps = {
  form: UseFormReturn<FormValues>;
};

export default function PatientForm({ form }: PatientFormProps) {
  const t = useTranslations("page.patients.fields");
  const [county, setCounty] = useState<string | undefined>(undefined);

  const { data: counties, isFetching: isFetchingCounties } =
    api.utils.getCounties.useQuery();
  const { data: cities, isFetching: isFetchingCities } =
    api.utils.getCities.useQuery(county);

  return (
    <Form {...form}>
      <form className="grid grid-cols-2 gap-4">
        <FormField
          name="firstName"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-1 w-full">
              <FormLabel htmlFor={field.name}>{t("firstName.label")}</FormLabel>
              <Input id={field.name} {...field} placeholder="John" />
            </FormItem>
          )}
        />
        <FormField
          name="lastName"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-1 w-full">
              <FormLabel htmlFor={field.name}>{t("lastName.label")}</FormLabel>
              <Input id={field.name} {...field} placeholder="Doe" />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel htmlFor={field.name}>{t("email.label")}</FormLabel>
              <Input
                id={field.name}
                {...field}
                placeholder="john@example.com"
              />
            </FormItem>
          )}
        />
        <FormField
          name="phone"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel htmlFor={field.name}>{t("phone.label")}</FormLabel>
              <FormControl>
                <PhoneInput
                  id={field.name}
                  autoComplete="tel"
                  value={field.value}
                  onChange={field.onChange}
                  required={true}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="dob"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel htmlFor={field.name}>{t("dob.label")}</FormLabel>
              <FormControl>
                <DateTimePicker
                  granularity="day"
                  jsDate={field.value}
                  onJsDateChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="col-span-2 space-y-3">
              <FormLabel>{t("gender.label")}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="M" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {t("gender.options.M")}
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="F" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {t("gender.options.F")}
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="county"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-1 w-full">
              <FormLabel htmlFor={field.name}>{t("county.label")}</FormLabel>
              <FormControl>
                <CountySelect
                  name={field.value}
                  value={field.value}
                  onSelect={(value) => {
                    field.onChange(value);
                    setCounty(value);
                    form.setValue("city", "");
                  }}
                  counties={counties ?? []}
                  loading={isFetchingCounties}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="city"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-1 w-full">
              <FormLabel htmlFor={field.name}>
                {form.getValues("county") === "București"
                  ? t("sector.label")
                  : t("city.label")}
              </FormLabel>
              <FormControl>
                <CitySelect
                  disabled={!form.getValues("county")}
                  name={field.value}
                  onSelect={(value) => {
                    field.onChange(value);
                  }}
                  value={field.value}
                  cities={cities ?? []}
                  loading={isFetchingCities}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
