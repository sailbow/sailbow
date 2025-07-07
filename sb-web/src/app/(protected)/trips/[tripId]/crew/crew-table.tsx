"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { roleValueToDisplay } from "./invite-button";
import { CrewMemberActions } from "./crew-member-actions";
import { useCrew } from "@/lib/trip-queries";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Ellipsis, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CrewTable() {
  const { data: crew, isLoading } = useCrew();
  return (
    <div className="flex size-full flex-col overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <div className="inline-flex size-10 items-center justify-center">
                <User className="size-5" />
              </div>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>
              <Button disabled variant="ghost" className="flex size-8 p-0">
                <Ellipsis className="h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && !crew ? (
            <TableRow>
              {Array.from({ length: 4 }).map((_, i) => (
                <TableCell key={i}>
                  <Skeleton key={i} className="h-10" />
                </TableCell>
              ))}
            </TableRow>
          ) : (
            crew!.map((member) => (
              <TableRow key={member._id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage
                      src={member.imageUrl}
                      alt={`Profile image for ${member.firstName} ${member.lastName}`}
                    />
                    <AvatarFallback>
                      <Skeleton className="size-full rounded-full" />
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  {`${member.firstName} ${member.lastName}`}
                </TableCell>
                <TableCell>{roleValueToDisplay(member.role)}</TableCell>
                <TableCell>
                  <CrewMemberActions member={member} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
