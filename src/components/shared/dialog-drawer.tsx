import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";

type DialogDrawerProps = {
  title: React.ReactNode | string;
  description?: React.ReactNode | string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
  close?: React.ReactNode;
};

export default function DialogDrawer({
  title,
  description,
  children,
  footer,
  trigger,
  open,
  onOpenChange,
  close,
}: DialogDrawerProps) {
  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      {trigger && <CredenzaTrigger>{trigger}</CredenzaTrigger>}
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{title}</CredenzaTitle>
          <CredenzaDescription>{description}</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>{children}</CredenzaBody>
        <CredenzaFooter>
          {close && <CredenzaClose>{close}</CredenzaClose>}
          {footer}
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
