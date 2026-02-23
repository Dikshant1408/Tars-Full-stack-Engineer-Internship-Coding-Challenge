import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { APP_NAME } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Real-time one-on-one chat application",
};

const REQUIRED_ENV_VARS = [
  "NEXT_PUBLIC_CONVEX_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
] as const;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const missing = REQUIRED_ENV_VARS.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    return (
      <html lang="en">
        <body>
          <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
            <h2 className="text-2xl font-semibold">Configuration Error</h2>
            <p className="text-sm text-gray-500">
              Missing required environment variable
              {missing.length > 1 ? "s" : ""}: <code>{missing.join(", ")}</code>
              . Copy <code>.env.local.example</code> to{" "}
              <code>.env.local</code>, fill in your Convex and Clerk
              credentials, then restart the server. See the{" "}
              <code>README.md</code> for detailed setup instructions.
            </p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="font-sans">
        <ClerkProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
