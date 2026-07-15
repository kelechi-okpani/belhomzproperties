import PropertyDetails from "@/dashboard/components/properties/PropertiesDetails";

export default function AdminPropertyView({ params }: { params: Promise<{ id: string }> }) {
  return <PropertyDetails params={params} variant="dashboard" />;
}