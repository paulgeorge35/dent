import { useTranslations } from "next-intl";
import { useBoolean } from "react-hanger";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const colors = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  red: "bg-red-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  orange: "bg-orange-500",
  gray: "bg-gray-500",
};

const getColor = (color: string) => {
  if (Object.keys(colors).includes(color)) {
    return colors[color as keyof typeof colors]!;
  }
  return colors.gray;
};

export default function ColorPicker({
  id,
  value,
  onChange,
}: {
  id: string;
  value?: string;
  onChange: (value: string) => void;
}) {
  const t = useTranslations("fields.color");
  const open = useBoolean(false);

  const handleChange = (
    e: React.MouseEvent<HTMLButtonElement>,
    color: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(color);
    open.setFalse();
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    open.setTrue();
  };

  return (
    <Popover open={open.value} onOpenChange={open.toggle} modal>
      <PopoverTrigger asChild>
        {value ? (
          <Button
            id={id}
            variant="outline"
            onClick={handleClick}
            className="horizontal center gap-2 !h-9"
            type="button"
          >
            <Circle color={value} className="!size-3" />
          </Button>
        ) : (
          <Button id={id} variant="outline" onClick={handleClick} type="button">
            <span>{t("placeholder")}</span>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="z-50">
        <div className="grid grid-cols-4 gap-2">
          {Object.keys(colors).map((color) => (
            <Button
              key={color}
              size="icon"
              variant="outline"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handleChange(e, color)
              }
            >
              <Circle color={color} className="size-5" />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function Circle({
  color,
  className,
}: { color: string; className?: string }) {
  return (
    <div className={`size-4 rounded-full ${getColor(color)} ${className}`} />
  );
}
