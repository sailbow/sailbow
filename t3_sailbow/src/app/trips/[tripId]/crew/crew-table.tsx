"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { roleValueToDisplay } from "../invite";
import { CrewMemberActions } from "./crew-member-actions";
import { useActiveTripId, useCrew } from "@/lib/trip-queries";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";

export function CrewTable() {
  const tripId = useActiveTripId();
  const { data: crew, isLoading } = useQuery({
    ...convexQuery(api.trips.queries.getTripCrew, { tripId }),
  });
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
        {isLoading && !crew ? (
          <TableRow>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="size-full bg-slate-200">
                <TableCell />
              </Skeleton>
            ))}
          </TableRow>
        ) : (
          crew!.map((member) => (
            <TableRow key={member._id}>
              <TableCell>{member.email}</TableCell>
              <TableCell>{roleValueToDisplay(member.role)}</TableCell>
              <TableCell>
                <CrewMemberActions member={member} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
