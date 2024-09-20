// pages/terms.tsx
import Navbar from '@/app/(dashboard)/_components/navbar';
import { NextPage } from 'next';

const TermsAndConditions: NextPage = () => {
  return (
    <div>

    <Navbar/>
    <div className="min-h-screen p-6 bg-gray-100 text-gray-800">

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-900">
          Conditions Générales d&apos;Utilisation
        </h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-base">
            Bienvenue sur notre plateforme d&apos;apprentissage en ligne. En utilisant ce site, vous acceptez les conditions générales décrites ci-dessous. Veuillez les lire attentivement avant de continuer à utiliser notre service.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">2. Accès à la plateforme</h2>
          <p className="text-base">
            L&apos;accès à notre plateforme est réservé aux utilisateurs enregistrés. Vous devez fournir des informations exactes et complètes lors de votre inscription.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">3. Propriété intellectuelle</h2>
          <p className="text-base">
            Tous les contenus présents sur cette plateforme (cours, vidéos, textes, images) sont protégés par des droits d&apos;auteur. Vous ne pouvez pas reproduire, distribuer ou modifier ces contenus sans l&apos;autorisation explicite de leur propriétaire.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">4. Utilisation acceptable</h2>
          <p className="text-base">
            Vous acceptez de ne pas utiliser la plateforme pour des activités illégales ou nuisibles. Tout comportement inapproprié peut entraîner la suspension ou la résiliation de votre compte.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">5. Modifications des conditions</h2>
          <p className="text-base">
            Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prendront effet dès leur publication sur cette page. Il est de votre responsabilité de vérifier régulièrement les mises à jour.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">6. Contact</h2>
          <p className="text-base">
            Pour toute question ou préoccupation concernant ces conditions, veuillez nous contacter à l&apos;adresse email suivante : contact@tamayaz.com.
          </p>
        </section>

        
      </div>
    </div>
    </div>
  );
}

export default TermsAndConditions;
