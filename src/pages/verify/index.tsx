import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import userpool from "@/lib/userpool";
import { CognitoUser } from "amazon-cognito-identity-js";

const FormSchema = z.object({
  code: z.string().min(6),
});

export default function Verify() {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true);

    try {
      const user = new CognitoUser({
        Username: username as string,
        Pool: userpool,
      });

      user.confirmRegistration(data.code, true, (err) => {
        if (err) {
          toast({
            title: "Verification Failed",
            description: err?.message,
            variant: "destructive",
          });
          return;
        } else {
          toast({
            title: "Success",
            variant: "success",
          });
          navigate("/auth/signin");
        }
      });
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error?.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-10 grid min-w-[300px] max-w-[400px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Verify OTP</h1>
        <p className="text-balance text-muted-foreground">
          Enter verification code below
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            name="code"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input className="w-full" placeholder="code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !form.formState.isValid}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "verify"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
