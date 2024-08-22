import type Stripe from "stripe";

export type SearchParams = Record<string, string | string[] | undefined>;

export type EventChangeAction = {
  type: "date" | "start" | "end" | "allDay" | "description";
  from: string | Date | boolean | null;
  to: string | Date | boolean | null;
};

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

type DeepKeys<T> = T extends object
  ? { [K in keyof T]: K | DeepKeys<T[K]> }[keyof T]
  : never;

export interface DataTableFilterField<TData> {
  label: string;
  value: keyof TData | DeepKeys<TData> | "search";
  placeholder?: string;
  options?: Option[];
}

export interface DataTableFilterOption<TData> {
  id: string;
  label: string;
  value: keyof TData | DeepKeys<TData> | "search";
  options: Option[];
  filterValues?: string[];
  filterOperator?: string;
  isMulti?: boolean;
}

export type StripePlan = Stripe.Plan & {
  product: Stripe.Product & {
    metadata: Record<string, string>;
    default_price: Stripe.Price;
  };
};
