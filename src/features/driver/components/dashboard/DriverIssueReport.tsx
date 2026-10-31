import ComplaintForm from "@/features/complaints/components/ComplaintForm";

/** Configures the shared complaint form for driver vehicle, account, or safety reports. */
export default function DriverIssueReport() {
  return (
    <ComplaintForm
      title="Report a problem"
      description="Send a vehicle, account, or safety issue to the admin team."
    />
  );
}
