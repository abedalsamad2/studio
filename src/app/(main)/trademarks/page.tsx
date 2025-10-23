import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copyright } from "lucide-react";

export default function TrademarksPage() {
  return (
    <section>
        <div className="flex flex-col items-start gap-2">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] font-headline">
            Trademark Check
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            Check for potential trademark conflicts.
            </p>
        </div>
        <Card className="mt-8">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <Copyright className="h-6 w-6 text-primary" />
            Coming Soon
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
            A tool to help you check for trademark conflicts is on its way. Please consult a legal professional for advice.
            </p>
        </CardContent>
        </Card>
    </section>
  );
}
