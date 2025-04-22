
import { Header } from "@/components/Header";
import { getAllRestrooms } from "@/data/restrooms";
import { getUserRestrooms } from "@/data/userRestrooms";
import { RestroomCard } from "@/components/RestroomCard";
import { useNavigate } from "react-router-dom";

export default function Partnerships() {
  const navigate = useNavigate();
  const allRestrooms = [...getAllRestrooms(), ...getUserRestrooms()];
  
  const partnerRestrooms = allRestrooms.filter(
    restroom => restroom.businessInfo?.type && 
    ['cafe', 'restaurant', 'hotel', 'bakery'].includes(restroom.businessInfo.type) &&
    restroom.businessInfo.partnerStatus && 
    restroom.businessInfo.partnerStatus !== 'none'
  );

  const handleSelectRestroom = (id: string) => {
    navigate(`/?restroomId=${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onSearch={() => {}} />
      <main className="container py-4">
        <h1 className="text-2xl font-bold mb-4">Partner Locations</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partnerRestrooms.map(restroom => (
            <RestroomCard
              key={restroom.id}
              restroom={restroom}
              onClick={() => handleSelectRestroom(restroom.id)}
              isSelected={false}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
