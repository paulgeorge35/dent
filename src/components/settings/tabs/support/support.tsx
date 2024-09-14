import { TabsContent } from "@/components/ui/tabs";
import SupportForm from "./components/support-form";

export default function Support() {
  return (
    <TabsContent
      value="support"
      className="md:max-w-screen-md !mt-0 flex flex-col gap-4"
    >
      <SupportForm />
    </TabsContent>
  );
}
