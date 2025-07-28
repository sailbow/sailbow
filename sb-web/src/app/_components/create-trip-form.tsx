"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { ImageIcon } from "lucide-react";
import BannerModal from "./banner-modal";
import { useState } from "react";
import ImageWithLoader from "./image-with-loader";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { z } from "zod";
import { useCreateTrip } from "@/lib/trip-mutations";
import LoadingButton from "@/components/loading-button";

const createTripSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
  description: z.string().default(""),
  banner: z
    .object({
      thumbnail: z.string().url(),
      small: z.string().url(),
      regular: z.string().url(),
      full: z.string().url(),
      alt: z.string(),
    })
    .nullable(),
});

type CreateTrip = z.infer<typeof createTripSchema>;
type Banner = Exclude<CreateTrip["banner"], null>;
export function CreateTripForm() {
  const router = useRouter();
  const [tripCreated, setTripCreated] = useState(false);
  const { mutate: createTrip, isPending: isLoading } = useCreateTrip({
    onSuccess: ({ tripId }) => {
      setTripCreated(true);
      toast.success("Success!");
      router.push(`/trips/${tripId}`);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Something went wrong, please try again later");
    },
  });
  const [banner, setBanner] = useState<Banner | null>(null);

  const form = useForm<CreateTrip>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      banner: null,
      name: "",
      description: "",
    },
  });

  function onSubmit(values: CreateTrip) {
    createTrip(values);
  }

  return (
    <Form {...form}>
      <Card className="mt-4">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="font-medium">Create a trip</CardTitle>
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
                    className="size-full stroke-gray-300"
                    strokeWidth={0.75}
                  />
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="space-x-4">
            <LoadingButton
              isLoading={isLoading || tripCreated}
              type="submit"
              size="lg"
            >
              Create
            </LoadingButton>
            <Button
              type="button"
              size="lg"
              variant="outline"
              disabled={isLoading || tripCreated}
              asChild
            >
              <Link href="/trips">Cancel</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Form>
  );
}
