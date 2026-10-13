import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { Logo } from "@/components/Logo";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <Logo className="justify-center text-2xl" />
        <p className="mt-3 text-stone-600">
          Earn points on every order, redeem them for merchandise, and never miss an event or
          promo.
        </p>

        <Card className="mt-8 text-left">
          <h2 className="font-semibold text-stone-900">I&apos;m a customer</h2>
          <p className="mt-1 text-sm text-stone-500">Check your points, redeem rewards.</p>
          <div className="mt-4 flex gap-2">
            <Button as={Link} href="/customer/login" className="flex-1">
              Log in
            </Button>
            <Button as={Link} href="/customer/signup" variant="secondary" className="flex-1">
              Sign up
            </Button>
          </div>
        </Card>

        <Card className="mt-4 text-left">
          <h2 className="font-semibold text-stone-900">I&apos;m staff</h2>
          <p className="mt-1 text-sm text-stone-500">Manage customers, rewards, and promos.</p>
          <div className="mt-4">
            <Button as={Link} href="/merchant/login" variant="secondary" className="w-full">
              Staff login
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
