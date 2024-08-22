import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import type { Specialization } from "@prisma/client";
import ConfirmSpecializationDelete from "./confirm-delete";
import EditSpecializationDialog from "./edit-dialog";

type SpecializationsTableProps = {
  specializations: (Specialization & {
    _count: {
      users: number;
    };
  })[];
};

export default function SpecializationsTable({
  specializations,
}: SpecializationsTableProps) {
  return (
    <Table>
      <TableCaption>
        Total Specializations: {specializations.length}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Users</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {specializations.map((specialization) => (
          <TableRow
            key={specialization.id}
            className="text-muted-foreground hover:bg-transparent"
          >
            <TableCell>{specialization.name}</TableCell>
            <TableCell>{specialization.description ?? "-"}</TableCell>
            <TableCell>{specialization._count.users}</TableCell>
            <TableCell className="flex justify-end gap-2">
              <EditSpecializationDialog specialization={specialization} />
              <ConfirmSpecializationDelete
                id={specialization.id}
                disabled={specialization._count.users > 0}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
