import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";

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
import { useUserContext } from "@/context/userContext";

const FormSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function Signin() {
  const navigate = useNavigate();
  const { signIn } = useUserContext();

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onBlur",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      setIsSubmitting(true);
      const { email, password } = data;
      await signIn(email, password);
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error?.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mx-10 grid min-w-[300px] max-w-[400px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="text-balance text-muted-foreground">
            Enter your credentials below
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
      </div>
      {/* <div className="mt-4 text-center text-sm">
        Forgot Passwordt?{" "}
        <Link to="/password-reset" className="underline">
          Reset Password
        </Link>
      </div> */}
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/auth/signup" className="underline">
          Sign up
        </Link>
      </div>
    </>
  );
}
