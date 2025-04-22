
import { RestroomRecommendations } from "@/components/RestroomRecommendations";
import { Header } from "@/components/Header";
import { getAllRestrooms } from "@/data/restrooms";
import { getUserRestrooms } from "@/data/userRestrooms";
import { useNavigate } from "react-router-dom";

export default function Recommendations() {
  const navigate = useNavigate();
  const allRestrooms = [...getAllRestrooms(), ...getUserRestrooms()];

  const handleSelectRestroom = (id: string) => {
    navigate(`/?restroomId=${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onSearch={() => {}} />
      <main className="container py-4">
        <RestroomRecommendations 
          restrooms={allRestrooms}
          onSelectRestroom={handleSelectRestroom}
        />
      </main>
    </div>
  );
}
