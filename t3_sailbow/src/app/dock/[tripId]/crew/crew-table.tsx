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
import { Preloaded, usePreloadedQuery, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { type Doc, type Id } from "@convex/_generated/dataModel";
import { useEffect, useState } from "react";
import CenteredSpinner from "@/app/_components/centered-spinner";

const columns: ColumnDef<Doc<"crews">>[] = [
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
export function CrewTable({
  preloadedCrew,
}: {
  preloadedCrew: Preloaded<typeof api.trips.queries.getTripCrew>;
}) {
  const crew = usePreloadedQuery(preloadedCrew);
  const table = useReactTable({
    data: crew,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return <DataTable table={table} />;
}
