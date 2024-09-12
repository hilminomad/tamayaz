// pages/faq.tsx
import Navbar from '@/app/(dashboard)/_components/navbar';
import { NextPage } from 'next';
import { useState } from 'react';

const faqs = [
  {
    question: "Comment puis-je m'inscrire à un cours ?",
    answer:
      "Pour vous inscrire à un cours, vous devez d'abord créer un compte sur notre plateforme. Une fois connecté, vous pouvez parcourir les cours disponibles et cliquer sur le bouton 'S'inscrire' pour rejoindre un cours.",
  },
  {
    question: "Quels sont les modes de paiement acceptés ?",
    answer:
      "Nous acceptons les paiements par carte de crédit, carte de débit et PayPal. Toutes les transactions sont sécurisées.",
  },
  {
    question: "Puis-je obtenir un remboursement si je ne suis pas satisfait du cours ?",
    answer:
      "Oui, vous avez 14 jours pour demander un remboursement si vous n'êtes pas satisfait du cours, à condition que vous n'ayez pas complété plus de 25% du contenu.",
  },
  {
    question: "Comment accéder aux certificats de réussite ?",
    answer:
      "Après avoir terminé un cours, vous pouvez télécharger votre certificat de réussite depuis votre tableau de bord. Vous devez avoir complété tous les modules du cours pour obtenir le certificat.",
  },
  {
    question: "Est-ce que les cours sont disponibles à vie ?",
    answer:
      "Une fois que vous avez acheté un cours, vous y aurez accès à vie, sauf indication contraire pour certains contenus spécifiques.",
  },
];

const FAQPage: NextPage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
      <Navbar/>
    <div className="min-h-screen p-6 bg-gray-100 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-900">
          Foire Aux Questions (FAQ)
        </h1>

        {faqs.map((faq, index) => (
          <div key={index} className="mb-4">
            <button
              className="w-full text-left bg-gray-200 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
              onClick={() => toggleFAQ(index)}
            >
              <h2 className="text-xl font-medium text-gray-800">
                {faq.question}
              </h2>
            </button>
            {activeIndex === index && (
              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default FAQPage;
