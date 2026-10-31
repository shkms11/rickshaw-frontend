import ComplaintForm from "@/features/complaints/components/ComplaintForm";

/** Configures the shared complaint form for an owner's fleet-management issues. */
export default function OwnerIssueReport() {
  return (
    <ComplaintForm
      title="Report a fleet problem"
      description="Send an issue about your fleet to the admin team."
    />
  );
}
