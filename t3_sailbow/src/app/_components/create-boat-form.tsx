"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  type CreateBoat,
  createBoatSchema,
  type BoatBanner,
} from "@/lib/schemas/boat";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/toast";
import { Image, ImageIcon, Loader2 } from "lucide-react";
import BannerModal from "./banner-modal";
import { useState } from "react";
import ImageWithLoader from "./image-with-loader";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api as convexApi } from "@convex/_generated/api";

export function CreateBoatForm() {
  const router = useRouter();
  const createBoat = useMutation(convexApi.trips.mutations.createTrip);
  const [banner, setBanner] = useState<BoatBanner | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const form = useForm<CreateBoat>({
    resolver: zodResolver(createBoatSchema),
    defaultValues: {
      banner: null,
      name: "",
      description: "",
      // crewInvites: [],
    },
  });

  async function onSubmit(values: CreateBoat) {
    setIsCreating(true);
    try {
      const result = await createBoat(values);
      router.push(`/dock/${result.tripId}`);
      toast.success("Success!");
    } catch {
      toast.error("Something went wrong, please try again later");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <Form {...form}>
      <Card className="mt-4">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="font-medium">Create a boat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-current">
                      Name
                      <span className="ml-2">
                        <FormMessage />
                      </span>
                    </FormLabel>
                    <FormControl>
                      <FormInput {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="self-start">
                <BannerModal
                  variant={!!banner ? "edit" : "add"}
                  onBannerChange={(b) => {
                    setBanner(b);
                    form.setValue("banner", b);
                  }}
                />
              </div>

              <div className="md relative h-40 w-full rounded-md border bg-background">
                {banner ? (
                  <ImageWithLoader src={banner.regular} alt={banner.alt} />
                ) : (
                  <ImageIcon
                    className="size-full stroke-muted-foreground"
                    strokeWidth={0.75}
                  />
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="space-x-4">
            <Button type="submit" size="lg" disabled={isCreating}>
              Create
            </Button>
            <Button
              type="button"
              size="lg"
              variant="secondary"
              disabled={isCreating}
              asChild
            >
              <Link href="/dock">Cancel</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Form>
  );
}
