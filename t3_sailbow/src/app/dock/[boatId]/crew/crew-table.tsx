"use client";

import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { useActiveBoat } from "@/hooks/use-boat";
import type { CrewMember } from "@/lib/common-types";
import { roleValueToDisplay } from "../invite";
import { DataTable } from "@/components/data-table";
import { CrewMemberActions } from "./crew-member-actions";
import { Table, TableHeader } from "@/components/ui/table";
import { DataTablePagination } from "@/components/data-table-pagination";

const columns: ColumnDef<CrewMember>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => roleValueToDisplay(row.getValue("role")),
  },
  {
    id: "action",
    cell: ({ row }) => <CrewMemberActions row={row} />,
  },
];
export function CrewTable() {
  const { activeBoat } = useActiveBoat();
  const table = useReactTable({
    data: activeBoat?.crew ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
  });
  if (!activeBoat) return null;
  return (
    <div className="flex size-full flex-col gap-2">
      <DataTable table={table} />
      <div className="justify-self-end">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
