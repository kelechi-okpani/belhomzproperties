import PropertyDetails from "@/dashboard/components/properties/PropertiesDetails";


export default function PublicPropertyView({ params }: { params: Promise<{ id: string }> }) {
  return(
      <div className='mt-28 lg:px-20'>
        <PropertyDetails params={params} variant="public" />
      </div>
  )
}
