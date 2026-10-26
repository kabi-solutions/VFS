import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="mx-auto max-w-[980px] px-6 py-28 text-center lg:px-8">
      <p className="text-sm font-medium text-green">In progress</p>
      <h1 className="headline-lg mx-auto mt-4 max-w-[18ch] text-balance">{title}</h1>
      <p className="body-lg mx-auto mt-5 max-w-[32rem]">{description}</p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button href="/">Back to home</Button>
        <Button href="/apply" shine>
          Apply Now
        </Button>
      </div>
      <p className="mt-8 text-[0.9375rem] text-steel">
        Need something else?{" "}
        <Link href="/contact" className="font-medium text-green hover:text-green-hover">
          Contact Vault
        </Link>
      </p>
    </section>
  );
}
