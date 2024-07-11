"use client";

import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { useBoat } from "@/hooks/use-boat";
import type { CrewMember } from "@/lib/common-types";
import { roleValueToDisplay } from "../invite";
import { DataTable } from "@/components/data-table";
import { CrewMemberActions } from "./crew-member-actions";

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
  const { crew } = useBoat();
  const table = useReactTable({
    data: crew,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return <DataTable table={table} />;
}
