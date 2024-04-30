import Link from "next/link";

export default function Page() {
  return (
    <div className="mt-12 w-full space-y-6 overflow-y-auto">
      <div className="prose container mx-auto grid gap-5 px-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tighter">
            Privacy Policy
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Last updated: January 1, 2023
          </p>
        </div>
        <div className="space-y-2">
          <p>
            Your privacy is important to us. It is our policy to respect your
            privacy regarding any information we may collect from you across our
            website,{" "}
            <Link className="underline underline-offset-2" href="#">
              sailbow.com
            </Link>
            , and other sites we own and operate.
          </p>
          <p>
            We only ask for personal information when we truly need it to
            provide a service to you. We collect it by fair and lawful means,
            with your knowledge and consent. We also let you know why we&apos;re
            collecting it and how it will be used.
          </p>
        </div>
        <div>
          <h2 className="text-2xl tracking-tighter">Information Collected</h2>
          <p>
            We collect information by fair and lawful means, with your knowledge
            and consent. We also let you know why we&apos;re collecting it and
            how it will be used.
          </p>
        </div>
        <div>
          <h2 className="text-2xl tracking-tighter">How Information is Used</h2>
          <p>
            We use the information we collect in various ways, including to:
          </p>
          <ul className="list-inside list-disc">
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl tracking-tighter">Data Security</h2>
          <p>
            We value your trust in providing us your personal information, thus
            we are striving to use commercially acceptable means of protecting
            it. But remember that no method of transmission over the internet,
            or method of electronic storage is 100% secure and reliable, and we
            cannot guarantee its absolute security.
          </p>
        </div>
        <div>
          <h2 className="text-2xl tracking-tighter">
            Cookies and Tracking Technologies
          </h2>
          <p>
            We use cookies and similar tracking technologies to track the
            activity on our website and we hold certain information.
          </p>
        </div>
        <div>
          <h2 className="text-2xl tracking-tighter">Third Party Disclosure</h2>
          <p>
            We do not sell, trade, or otherwise transfer to outside parties your
            personally identifiable information.
          </p>
        </div>
        <div>
          <h2 className="text-2xl tracking-tighter">Contact Information</h2>
          <p>
            If you have any questions about our Privacy Policy, please contact
            us:
          </p>
          <address className="not-italic">
            Email: example@example.com
            <br />
            Website: example.com
          </address>
        </div>
      </div>
    </div>
  );
}
