"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
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
import { Textarea, type TextareaProps } from "@/components/ui/textarea";
import { SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";
import BannerModal from "./banner-modal";
import { useState } from "react";
import ImageWithLoader from "./image-with-loader";

export function CreateBoatForm() {
  const router = useRouter();
  const { isLoading, mutate } = api.dock.createBoat.useMutation({
    onSuccess: (res) => {
      router.push(`/dock/${res.boatId}`);
    },
    onError: () => {
      toast.error("Oops!", {
        description: "Something went wrong, please try again later",
      });
    },
  });
  const [banner, setBanner] = useState<BoatBanner | null>(null);

  const form = useForm<CreateBoat>({
    resolver: zodResolver(createBoatSchema),
    defaultValues: {
      banner: null,
      name: "",
      description: "",
      crewInvites: [],
    },
  });

  function onSubmit(values: CreateBoat) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <SheetHeader>
        <SheetTitle>Create a boat</SheetTitle>
      </SheetHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <div className="relative mt-2 w-full">
          {!!banner ? (
            <div className="relative h-[200px] w-full">
              <ImageWithLoader src={banner.regular} alt="banner image" />
              <div className="absolute inset-x-2 bottom-2 z-10">
                <BannerModal
                  banner={banner}
                  onBannerChange={(b) => {
                    setBanner(b);
                    form.setValue("banner", b);
                  }}
                />
              </div>
            </div>
          ) : (
            <BannerModal
              banner={banner}
              onBannerChange={(b) => {
                setBanner(b);
                form.setValue("banner", b);
              }}
            />
          )}
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...(field as TextareaProps)}
                  placeholder="A description of your trip"
                  className="min-h-32"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SheetFooter>
          {isLoading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Save
            </Button>
          ) : (
            <Button type="submit">Save</Button>
          )}
        </SheetFooter>
      </form>
    </Form>
  );
}
