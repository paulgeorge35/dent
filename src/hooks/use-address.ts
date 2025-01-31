import { api } from "@/trpc/react";
import { useStateful } from "react-hanger";

const useAddress = () => {
  const county = useStateful<string | undefined>(undefined);
  const city = useStateful<string | undefined>(undefined);

  const { data: counties } = api.utils.getCounties.useQuery(undefined, {
  });

  const { data: cities } = api.utils.getCities.useQuery(county.value, {
  });

  return {
    county: {
      value: county.value,
      setValue: (value: string) => {
        county.setValue(value);
        city.setValue(undefined);
      },
      list: counties,
    },
    city: {
      value: city.value,
      setValue: (value: string) => {
        city.setValue(value);
      },
      list: cities,
    },
  };
};

export default useAddress;
