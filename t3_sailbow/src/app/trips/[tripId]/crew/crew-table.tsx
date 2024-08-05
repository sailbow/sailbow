"use client";

import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { useTrip } from "@/lib/use-trip";
import type { CrewMember } from "@/lib/common-types";
import { roleValueToDisplay } from "../invite";
import { DataTable } from "@/components/data-table";
import { CrewMemberActions } from "./crew-member-actions";
import { Preloaded, usePreloadedQuery, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { type Doc, type Id } from "@convex/_generated/dataModel";
import { useEffect, useState } from "react";
import CenteredSpinner from "@/app/_components/centered-spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ellipsis } from "lucide-react";

// const columns: ColumnDef<Doc<"crews">>[] = [
//   {
//     accessorKey: "email",
//     header: "Email",
//   },
//   {
//     accessorKey: "role",
//     header: "Role",
//     cell: ({ row }) => roleValueToDisplay(row.getValue("role")),
//   },
//   {
//     id: "action",
//     cell: ({ row }) => <CrewMemberActions row={row} />,
//   },
// ];
export function CrewTable({
  preloadedCrew,
}: {
  preloadedCrew: Preloaded<typeof api.trips.queries.getTripCrew>;
}) {
  const crew = usePreloadedQuery(preloadedCrew);
  // const table = useReactTable({
  //   data: crew,
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  // });
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {crew.map((member) => (
          <TableRow key={member._id}>
            <TableCell>{member.email}</TableCell>
            <TableCell>{roleValueToDisplay(member.role)}</TableCell>
            <TableCell>
              <CrewMemberActions member={member} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
  // return <DataTable table={table} />;
}
