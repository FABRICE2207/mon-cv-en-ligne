import { useState, useEffect, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Download, FileText } from "lucide-react";
import CountUp from "react-countup";
import { api } from "@/axios.config";

// Loader animé pour le suspense
const StatsLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {[1, 2, 3, 4].map((i) => (
      <Card key={i} className="flex items-center space-x-4 p-4 border-l-8 border-gray-300 animate-pulse">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <CardContent className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </CardContent>
      </Card>
    ))}
  </div>
);

interface Stats {
  total_montant: number;
  nb_cv_pending: number;
  nb_cv_telecharges: number;
  nb_cv_crees: number;
}

const DashboardStatsContent = ({ stats }: { stats: Stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {/* Montant en caisse */}
    <Card className="flex items-center space-x-4 p-4 border-l-8 border-green-500">
      <DollarSign className="w-8 h-8 text-green-500" />
      <CardContent className="text-gray-900">
        <h3 className="text-sm font-medium">Montant en caisse</h3>
        <p className="text-xl font-bold">
          <CountUp end={stats.total_montant} duration={2.5} separator=" " /> FCFA
        </p>
      </CardContent>
    </Card>

    {/* CV en attente de paiement */}
    <Card className="flex items-center space-x-4 p-4 border-l-8 border-yellow-500">
      <DollarSign className="w-8 h-8 text-yellow-500" />
      <CardContent className="text-gray-900">
        <h3 className="text-sm font-medium">CV en attente de paiement</h3>
        <p className="text-xl font-bold">
          <CountUp end={stats.nb_cv_pending} duration={2.5} />
        </p>
      </CardContent>
    </Card>

    {/* CV téléchargés */}
    <Card className="flex items-center space-x-4 p-4 border-l-8 border-blue-500">
      <Download className="w-8 h-8 text-blue-500" />
      <CardContent className="text-gray-900">
        <h3 className="text-sm font-medium">CV téléchargés</h3>
        <p className="text-xl font-bold">
          <CountUp end={stats.nb_cv_telecharges} duration={2.5} />
        </p>
      </CardContent>
    </Card>

    {/* CV créés */}
    <Card className="flex items-center space-x-4 p-4 border-l-8 border-purple-500">
      <FileText className="w-8 h-8 text-purple-500"/>
      <CardContent className="text-gray-900">
        <h3 className="text-sm font-medium">CV créés</h3>
        <p className="text-xl font-bold">
          <CountUp end={stats.nb_cv_crees} duration={2.5} />
        </p>
      </CardContent>
    </Card>
  </div>
);

const DashboardStats = () => {
  const [stats, setStats] = useState({
    total_montant: 0,
    nb_cv_pending: 0,
    nb_cv_telecharges: 0,
    nb_cv_crees: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const res = await api("/paiements/dashboard/statistic");
      const data = res.data;
      if (data.success) {
        // Ajouter un délai de 2 secondes avant d'afficher les données
        setTimeout(() => {
          setStats({
            total_montant: data.total_montant,
            nb_cv_pending: data.nb_cv_pending,
            nb_cv_telecharges: data.nb_cv_telecharges,
            nb_cv_crees: data.nb_cv_crees,
          });
          setLoading(false); // fin du chargement après le délai
        }, 1000);
      } else {
        console.error("Erreur stats:", data.message);
        setLoading(false);
      }
    } catch (err) {
      console.error("Erreur fetch stats:", err);
      setLoading(false);
    }
  };
  fetchStats();
}, []);


  return (
    <Suspense fallback={<StatsLoader />}>
      {loading ? <StatsLoader /> : <DashboardStatsContent stats={stats} />}
    </Suspense>
  );
};

export default DashboardStats;
