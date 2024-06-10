"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PhoneInput } from "@/components/phone-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DateTimePicker } from "@/components/datetime-input/datetime";
import { cn } from "@/lib/utils";
import { CountySelect } from "@/components/address-input/county-input";
import { api } from "@/trpc/react";
import { CitySelect } from "@/components/address-input/city-input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { emailSchema } from "@/types/schema";

const PatientFormSchema = z.object({
  firstName: z.string({
    required_error: "First name is required",
  }),
  lastName: z.string({
    required_error: "Last name is required",
  }),
  email: emailSchema
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
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
  terms: z
    .boolean({
      required_error: "You must agree to the terms and conditions",
    })
    .refine((value) => value === true, {
      message: "You must agree to the terms and conditions",
    }),
});

export type PatientFormValues = z.infer<typeof PatientFormSchema>;

interface PatientFormProps {
  className?: string;
}

export default function PatientForm({ className }: PatientFormProps) {
  const [county, setCounty] = useState<string | undefined>(undefined);
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(PatientFormSchema),
    defaultValues: {
      county: "",
      city: "",
    },
  });

  const { data: counties, isFetching: isFetchingCounties } =
    api.utils.getCounties.useQuery();
  const { data: cities, isFetching: isFetchingCities } =
    api.utils.getCities.useQuery(county);

  return (
    <section className={cn(className)}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            console.log(values);
          })}
          className="grid grid-cols-2 gap-4"
        >
          <FormField
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-1 w-full">
                <FormLabel htmlFor={field.name}>First Name</FormLabel>
                <Input id={field.name} {...field} placeholder="John" />
              </FormItem>
            )}
          />
          <FormField
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-1 w-full">
                <FormLabel htmlFor={field.name}>Last Name</FormLabel>
                <Input id={field.name} {...field} placeholder="Doe" />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 w-full">
                <FormLabel htmlFor={field.name}>Email</FormLabel>
                <Input
                  id={field.name}
                  // type="email"
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
                <FormLabel htmlFor={field.name}>Phone</FormLabel>
                <FormControl>
                  <PhoneInput
                    id={field.name}
                    autoComplete="tel"
                    {...field}
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
                <FormLabel htmlFor={field.name}>Date of Birth</FormLabel>
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
                <FormLabel>Gender</FormLabel>
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
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="F" />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
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
                <FormLabel htmlFor={field.name}>County</FormLabel>
                <FormControl>
                  <CountySelect
                    name={field.value}
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
                  {county === "București" ? "Sector" : "City"}
                </FormLabel>
                <FormControl>
                  <CitySelect
                    disabled={!form.getValues("county")}
                    name={field.value}
                    onSelect={(value) => {
                      field.onChange(value);
                    }}
                    cities={cities ?? []}
                    loading={isFetchingCities}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator className="col-span-2" />
          <Button
            type="submit"
            className="col-span-2"
            variant="expandIcon"
            iconPlacement="left"
            Icon={Check}
          >
            Submit
          </Button>
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <span className="horizontal center-v col-span-2 space-x-4 space-y-0 rounded-md border border-dashed border-border bg-accent/50 p-4 py-3">
                  <Checkbox
                    className="m-0"
                    id={field.name}
                    checked={field.value}
                    onClick={() => field.onChange(!field.value)}
                  />
                  <span className="vertical">
                    <FormLabel
                      className="horizontal center-v font-normal text-foreground"
                      htmlFor={field.name}
                    >
                      I agree to the
                      <Link
                        target="_blank"
                        href="/terms"
                        className="ml-1 font-bold text-accent-foreground hover:underline"
                      >
                        Terms and Conditions
                      </Link>
                    </FormLabel>
                  </span>
                </span>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </section>
  );
}
