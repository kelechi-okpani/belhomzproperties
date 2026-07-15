import NewProperty from "@/dashboard/components/properties/NewProperty";

export default function PublicPropertyView({ params }: { params: Promise<{ id: string }> }) {
  return (
      <div className=''>
         <NewProperty />
      </div>
  )
}

