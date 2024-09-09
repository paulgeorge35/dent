import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import CurrentMembership from "./components/current-plan";

export default function Membership() {
  return (
    <TabsContent value="plan" className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Manage your subscription.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-4">
          <CurrentMembership />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
