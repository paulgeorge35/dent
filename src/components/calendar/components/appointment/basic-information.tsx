import { DateTimePicker } from "@/components/datetime-input/datetime";
import { PhoneInput } from "@/components/phone-input";
import { AutoComplete } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import {
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
import type { Patient } from "@prisma/client";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useInput } from "react-hanger";
import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { AppointmentSchema } from "../calendar";
import PatientDetails from "./patient-details";

type BasicInformationProps = {
  form: UseFormReturn<AppointmentSchema>;
  resourceId: string;
};

export default function BasicInformation({ form }: BasicInformationProps) {
  const t = useTranslations("page.appointments.add.steps.basic-information.fields");
  const { data: patient, isLoading: patientLoading } = api.patient.get.useQuery(
    {
      id: form.watch("patient.id"),
    },
    {
      enabled: !!form.watch("patient.id"),
    },
  );
  const search = useInput(
    patient ? `${patient.firstName} ${patient.lastName}` : "",
  );
  const { data: patients } = api.patient.list.useQuery({
    search: search.value,
  });

  const { data: counties } = api.utils.getCounties.useQuery();
  const { data: cities } = api.utils.getCities.useQuery(
    form.watch("patient.county"),
    {
      enabled: !!form.watch("patient.county"),
    },
  );

  const handleCountyChange = (value: string) => {
    form.setValue("patient.county", value);
    form.setValue("patient.city", undefined);
  };

  const handleCityChange = (value: string) => {
    form.setValue("patient.city", value);
  };

  const handlePatientSelect = (id: string) => {
    form.setValue("patient", { id });
  };

  if (patient ?? patientLoading) {
    return (
      <div className="grid grid-cols-4 gap-4 p-4">
        <span className="horizontal col-span-4 items-center gap-3">
          <PatientSearch
            search={search.value}
            setSearch={(value) => search.setValue(value)}
            patients={patients?.content ?? []}
            isLoading={patients === undefined}
            onSelect={handlePatientSelect}
            className="grow"
          />
          <Button
            size="icon"
            variant="outline"
            className="shrink-0"
            onClick={() => {
              search.setValue("");
              form.setValue("patient", {
                id: undefined,
                firstName: "",
                lastName: "",
                status: "ACTIVE",
                dob: undefined,
                gender: undefined,
                email: "",
                phone: undefined,
                county: undefined,
                city: undefined,
              });
            }}
          >
            <X />
          </Button>
        </span>
        <PatientDetails patient={patient ?? undefined} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <PatientSearch
        search={search.value}
        setSearch={(value) => search.setValue(value)}
        patients={patients?.content ?? []}
        isLoading={patients === undefined}
        onSelect={handlePatientSelect}
        className="col-span-4"
      />
      <FormFieldCompact
        className="col-span-2"
        control={form.control}
        name="patient.firstName"
        label={t("firstName.label")}
        render={({ field }) => <Input {...field} placeholder="First Name" />}
      />
      <FormFieldCompact
        className="col-span-2"
        control={form.control}
        name="patient.lastName"
        label={t("lastName.label")}
        render={({ field }) => <Input {...field} placeholder="Last Name" />}
      />
      <Controller
        name="patient.dob"
        control={form.control}
        render={({ field }) => (
          <FormFieldCompact
            className="col-span-2"
            control={form.control}
            name="patient.dob"
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
        name="patient.gender"
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
                <FormItem className="col-span-1">
                  <FormLabel className="group">
                    <FormControl>
                      <RadioGroupItem value="M" className="sr-only" />
                    </FormControl>
                    <div className="relative flex h-10 w-full cursor-pointer items-center justify-center gap-4 rounded-lg border border-border p-4 group-has-[:checked]:border-primary">
                      {t("gender.options.M")}
                    </div>
                  </FormLabel>
                </FormItem>
                <FormItem className="col-span-1">
                  <FormLabel className="group">
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
        name="patient.email"
        label={t("email.label")}
        render={({ field }) => (
          <Input {...field} placeholder="email@example.com" />
        )}
      />
      <Controller
        name="patient.phone"
        control={form.control}
        render={({ field }) => (
          <FormFieldCompact
            className="col-span-4"
            control={form.control}
            name="patient.phone"
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
        name="patient.county"
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
        name="patient.city"
        label={t("city.label")}
        render={({ field }) => (
          <Select onValueChange={handleCityChange}>
            <SelectTrigger
              disabled={!form.watch("patient.county") || cities?.length === 0}
            >
              <SelectValue {...field} placeholder={t("city.placeholder")} />
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
    </div>
  );
}

type PatientSearchProps = {
  search: string;
  setSearch: (search: string) => void;
  isLoading: boolean;
  onSelect: (id: string) => void;
  patients: Patient[];
  className?: string;
};

const PatientSearch = ({
  search,
  setSearch,
  onSelect,
  isLoading,
  patients,
  className,
}: PatientSearchProps) => {
  const t = useTranslations("page.appointments.add.steps.basic-information.fields.patient");
  return (
    <AutoComplete<string>
      options={patients.map((patient) => ({
        value: patient.id,
        label: `${patient.firstName} ${patient.lastName}`,
      }))}
      emptyMessage={t("empty")}
      placeholder={t("placeholder")}
      isLoading={isLoading}
      onValueChange={(option) => onSelect(option.value)}
      disabled={isLoading}
      search={search}
      setSearch={setSearch}
      className={className}
    />
  );
};
