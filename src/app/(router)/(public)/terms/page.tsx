/**
 * v0 by Vercel.
 * @see https://v0.dev/t/uKeyfnqoJLa
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon } from "lucide-react";

export default function Component() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Acord de Utilizare
          </h1>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-400">
            Acest acord de utilizare (&quot;Acordul&quot;) stabilește termenii
            și condițiile pentru utilizarea aplicației web a cabinetului nostru
            stomatologic (&quot;Aplicația&quot;). Prin crearea unui cont și
            utilizarea Aplicației, sunteți de acord cu următoarele:
          </p>
        </div>
        <div className="space-y-4">
          <Section
            index={1}
            title="Colectarea și Utilizarea Informațiilor Personale"
            content={[
              "Colectăm și stocăm informațiile dvs. personale, inclusiv, dar fără a se limita la, numele, adresa de email, numărul de telefon și istoricul programărilor stomatologice.",
              "Informațiile colectate sunt utilizate pentru a gestiona programările dvs. la cabinetul nostru și pentru a vă notifica despre programările viitoare prin SMS, email sau apel telefonic.",
            ]}
          />
          <Section
            index={2}
            title="Protecția Datelor"
            content={[
              "Ne angajăm să protejăm confidențialitatea și securitatea informațiilor dvs. personale.",
              "Informațiile dvs. personale nu vor fi partajate cu terți fără consimțământul dvs., cu excepția cazurilor prevăzute de lege.",
            ]}
          />
          <Section
            index={3}
            title="Notificări pentru Programări"
            content={[
              "Sunteți de acord să primiți notificări privind programările viitoare la numărul de telefon furnizat.",
              "Notificările pot include mementouri pentru programări, modificări ale programărilor sau alte informații relevante privind serviciile stomatologice.",
            ]}
          />
          <Section
            index={4}
            title="Drepturile Utilizatorilor"
            content={[
              "Aveți dreptul de a accesa, corecta sau șterge informațiile personale stocate în Aplicație.",
              "Pentru a exercita aceste drepturi, vă rugăm să ne contactați la adresa de email: contact@mydent.ro",
            ]}
          />
          <Section
            index={5}
            title="Contact"
            content={[
              "Pentru orice întrebări sau nelămuriri privind acest Acord, vă rugăm să ne contactați la adresa de email: contact@mydent.ro",
            ]}
          />
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-400">
            Prin crearea unui cont și utilizarea Aplicației, confirmați că ați
            citit, înțeles și sunteți de acord cu termenii și condițiile acestui
            Acord.
          </p>
        </div>
      </div>
    </div>
  );
}

interface SectionProps {
  index: number;
  title: string;
  content: string[];
}

function Section({ index, title, content }: SectionProps) {
  return (
    <Collapsible>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-gray-100 px-4 py-3 text-lg font-medium text-gray-900 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700">
        <span>
          {index}. {title}
        </span>
        <ChevronDownIcon className="h-5 w-5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 py-3 text-gray-700 dark:text-gray-400">
        {content.map((item, i) => (
          <p key={`${index}${i}`} className="mt-2">
            {item}
          </p>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
