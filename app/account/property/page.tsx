import Properties from "@/dashboard/components/properties/Properties";

interface PropertiesPageProps {
    variant?: string
}

export default function AdminProperties(variant: PropertiesPageProps) {
    return <Properties variant="dashboard"/>
}