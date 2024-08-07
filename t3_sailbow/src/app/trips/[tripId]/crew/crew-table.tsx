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
import { useCrew } from "@/lib/trip-queries";
import { Skeleton } from "@/components/ui/skeleton";

export function CrewTable() {
  const { data: crew, isLoading } = useCrew();
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
              <TableCell key={i}>
                <Skeleton key={i} className="h-10 bg-slate-200"></Skeleton>
              </TableCell>
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
