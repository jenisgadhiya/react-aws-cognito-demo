import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { toast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import userpool from "@/lib/userpool";

const FormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .refine((s) => !s.includes(" "), "No Spaces!"),
  email: z.string().email().min(1),
  password: z.string().min(1),
});

export default function Signup() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true);

    try {
      const attributeList = [];
      attributeList.push(
        new CognitoUserAttribute({
          Name: "email",
          Value: data?.email,
        })
      );
      attributeList.push(
        new CognitoUserAttribute({
          Name: "name",
          Value: data?.name,
        })
      );
      userpool.signUp(
        data.email,
        data.password,
        attributeList,
        [],
        (err, result) => {
          if (err) {
            toast({
              title: "Sign Up Failed",
              description: err?.message,
              variant: "destructive",
            });
            return;
          } else {
            toast({
              title: "Success",
              variant: "success",
            });
            navigate(`/auth/verify/${result?.user?.getUsername()}`);
          }
        }
      );
    } catch (error: any) {
      error?.message &&
        toast({
          title: "Sign Up Failed",
          description: error?.message,
          variant: "destructive",
        });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-10 grid max-w-[400px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-balance text-muted-foreground">
          Enter your details below to register your account
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
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
              "Signup"
            )}
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/auth/signin" className="underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
