import FormWizard from "@/components/form/FormWizard";

// This page is a simple server component that renders the client-side wizard.
// All the interactive logic lives inside FormWizard ("use client").
export default function GerarPage() {
  return <FormWizard />;
}
