import React, { useState } from 'react';

const GrandHotelCGV = () => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const sections = [
    { id: 1, title: "Documents contractuels – Ordre de préséance" },
    { id: 2, title: "Conditions préalables" },
    { id: 3, title: "Procédures de réservation" },
    { id: 4, title: "Séjour à l'hôtel" },
    { id: 5, title: "Compte Club" },
    { id: 6, title: "Tarifs – Modalités de paiement" },
    { id: 7, title: "Modifications - Annulation" },
    { id: 8, title: "Programme de fidélité" },
    { id: 9, title: "Responsabilité – Réclamations" },
    { id: 10, title: "Service Clients" },
    { id: 11, title: "Force majeure" },
    { id: 12, title: "Données à caractère personnel et cookies" },
    { id: 13, title: "Divers" },
    { id: 14, title: "Loi applicable – règlement des litiges" },
    { id: 15, title: "Services inclus et barème des tarifs" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-amber-800 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-3xl">GH</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CONDITIONS GÉNÉRALES DE VENTE
          </h1>
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">
            GRAND HOTEL ADAMAOUA DOUALA
          </h2>
          <div className="inline-flex items-center justify-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-amber-800">
          <p className="text-lg text-gray-700 mb-4">
            <strong>GRAND HOTEL ADAMAOUA DOUALA</strong> exploite le site Internet <a href="https://grandhoteladamaoua.com" className="text-amber-700 hover:underline">https://grandhoteladamaoua.com</a> (ci-après « Site GRAND HOTEL ADAMAOUA ») permettant la réservation de nuitées dans l'hôtel.
          </p>
          <p className="text-lg text-gray-700">
            Les présentes conditions générales (ci-après « les Conditions Générales ») ont pour objet de régir les relations entre le client (ci-après « le Client ») et la société exploitant l'hôtel pour lequel le Client effectue une réservation (ci-après « GRAND HOTEL ADAMAOUA ») et dont le nom et les coordonnées figurent dans la liste jointe aux Conditions Générales et dans le récapitulatif de réservation.
          </p>
        </div>

        {/* Accordéon des sections */}
        <div className="space-y-4 mb-8">
          {sections.map((section) => (
            <Section 
              key={section.id}
              id={section.id}
              title={section.title}
              isOpen={openSections[section.id] || false}
              onToggle={() => toggleSection(section.id)}
            >
              {section.id === 1 && <Section1Content />}
              {section.id === 2 && <Section2Content />}
              {section.id === 3 && <Section3Content />}
              {section.id === 4 && <Section4Content />}
              {section.id === 5 && <Section5Content />}
              {section.id === 6 && <Section6Content />}
              {section.id === 7 && <Section7Content />}
              {section.id === 8 && <Section8Content />}
              {section.id === 9 && <Section9Content />}
              {section.id === 10 && <Section10Content />}
              {section.id === 11 && <Section11Content />}
              {section.id === 12 && <Section12Content />}
              {section.id === 13 && <Section13Content />}
              {section.id === 14 && <Section14Content />}
              {section.id === 15 && <Section15Content />}
            </Section>
          ))}
        </div>

        {/* Coordonnées de l'hôtel */}
        <div className="mt-12 bg-gradient-to-r from-amber-800 to-amber-900 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">INFORMATIONS RELATIVES À GRAND HOTEL ADAMAOUA DOUALA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div>
                  <p className="font-semibold">Adresse postale:</p>
                  <p>BP 1234 Douala, Cameroun</p>
                  <p>Quartier Bonanjo, Rue de l'Hôtel</p>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-semibold">Email:</p>
                  <p>reservation@grandhoteladamaoua.com</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="font-semibold">Téléphone:</p>
                  <p>(+237) 233 42 10 20</p>
                  <p>(+237) 699 90 12 04</p>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="font-semibold">RCCM:</p>
                  <p>RC/DLA/2023/B/12345</p>
                  <p className="font-semibold mt-2">Contribuable:</p>
                  <p>M123456789012P</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-300 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} GRAND HOTEL ADAMAOUA DOUALA. Tous droits réservés.</p>
          <p className="mt-2">Ces conditions générales sont susceptibles d'être modifiées. La version applicable est celle en vigueur sur le site internet.</p>
        </div>
      </div>
    </div>
  );
};

// Composant Section réutilisable
const Section = ({ id, title, isOpen, onToggle, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
      >
        <div className="flex items-center">
          <span className="flex-shrink-0 w-8 h-8 bg-amber-800 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
            {id}
          </span>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        <svg
          className={`w-6 h-6 transform transition-transform duration-200 text-amber-800 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="p-6 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

// Contenu des sections
const Section1Content = () => (
  <div className="space-y-4">
    <p className="text-gray-700">
      Les relations entre GRAND HOTEL ADAMAOUA et le Client sont régies par les Conditions Générales, complétées par leurs annexes (le descriptif des services - ci-après « le Descriptif des Services » et le barème des tarifs facturés au Client en cas de dégradation / détérioration ou encore si des objets et/ou du mobilier sont manquants dans les chambres), ainsi que par le récapitulatif de réservation sur lequel figurent notamment le tarif appliqué et les éventuelles conditions particulières liées au tarif choisi (les conditions de paiement, d'une part, et les conditions d'annulation et de modification - ci-après la « Politique d'annulation et de modification », d'autre part). L'ensemble de ces documents constitue l'intégralité du contrat (ci-après « le Contrat »).
    </p>
    
    <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
      <p className="font-semibold text-amber-900 mb-3">En cas de contradiction entre ces différents documents, l'ordre de préséance sera le suivant :</p>
      <ol className="space-y-3 text-gray-700">
        <li className="flex items-start">
          <span className="font-bold text-amber-700 mr-3">(i)</span>
          <span><strong>les Conditions Générales</strong></span>
        </li>
        <li className="flex items-start">
          <span className="font-bold text-amber-700 mr-3">(ii)</span>
          <span><strong>le récapitulatif de réservation</strong></span>
        </li>
        <li className="flex items-start">
          <span className="font-bold text-amber-700 mr-3">(iii)</span>
          <span><strong>les annexes aux Conditions Générales</strong></span>
        </li>
      </ol>
    </div>
  </div>
);

const Section2Content = () => (
  <div className="space-y-4">
    <p className="text-gray-700">
      La réservation d'une chambre auprès de GRAND HOTEL ADAMAOUA est réservée aux personnes physiques majeures et juridiquement capables. En procédant à la réservation d'une chambre auprès de GRAND HOTEL ADAMAOUA, le Client déclare expressément remplir ces conditions.
    </p>
  </div>
);

const Section3Content = () => (
  <div className="space-y-6">
    <p className="text-gray-700 font-medium">La réservation peut être effectuée selon les modalités suivantes, sous réserve de disponibilité des chambres :</p>

    <div className="space-y-4">
      <h3 className="text-lg font-bold text-amber-800">3.1 Réservation sur le Site Internet</h3>
      <div className="bg-gray-50 p-5 rounded-lg">
        <p className="mb-3">Le Client choisit l'hôtel, précise les dates de son séjour, choisit le type et le nombre de chambre qu'il souhaite réserver et choisit parmi les tarifs du jour proposés puis valide son choix après avoir pris connaissance du descriptif complet de la ou des chambre(s) correspondante(s), des tarifs, des services inclus dans ces tarifs, des conditions de paiement et de la Politique d'annulation et de modification.</p>
        <p className="font-semibold mt-4 mb-2">Il est alors invité :</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>A s'identifier s'il dispose déjà d'un compte Club ;</li>
          <li>S'il ne dispose pas d'un compte Club, à créer un compte en remplissant un formulaire avec ses coordonnées et à choisir un mot de passe pour accéder à son compte par la suite et bénéficier des avantages, notamment tarifaires, qui s'y rattachent. Le Client garantit la véracité et l'exactitude des informations données à cette occasion.</li>
        </ul>
      </div>

      <h3 className="text-lg font-bold text-amber-800">3.2 Réservation pour les groupes</h3>
      <div className="bg-gray-50 p-5 rounded-lg">
        <p>Pour toute demande de réservation de plus de 9 chambres sur les mêmes dates, le Client doit contacter l'hôtel concerné par mail ou téléphone. Des conditions particulières pour les réservations de groupe lui seront alors communiquées avant confirmation.</p>
      </div>

      <h3 className="text-lg font-bold text-amber-800">3.3 Réservation par téléphone</h3>
      <div className="bg-gray-50 p-5 rounded-lg">
        <p>Le Client appelle directement le numéro indiqué sur le site. Il indique le nombre de chambres, le type, les dates et choisit parmi les tarifs proposés. Il fournit ses coordonnées et une adresse électronique, ainsi que des informations de carte bancaire. Après validation, il reçoit un email de confirmation.</p>
      </div>

      <h3 className="text-lg font-bold text-amber-800">3.4 Réservation par courrier électronique</h3>
      <div className="bg-gray-50 p-5 rounded-lg">
        <p>Le Client envoie sa demande par email. GRAND HOTEL ADAMAOUA lui adresse une offre contenant les tarifs, les Conditions Générales et la Politique d'annulation. Le Client valide par retour de mail et reçoit une confirmation.</p>
      </div>

      <h3 className="text-lg font-bold text-amber-800">3.5 Durée minimale de réservation</h3>
      <div className="bg-gray-50 p-5 rounded-lg">
        <p>Selon les périodes de l'année, une durée minimale de réservation pourrait être exigée. Les informations sont communiquées sur simple demande par téléphone.</p>
      </div>

      <h3 className="text-lg font-bold text-amber-800">3.6 Caractère nominatif</h3>
      <div className="bg-amber-50 p-5 rounded-lg border border-amber-200">
        <p className="font-medium">Toute réservation est nominative et ne peut en aucun cas être cédée à un tiers, que ce soit à titre gratuit ou onéreux ou à titre commercial.</p>
      </div>
    </div>
  </div>
);

const Section4Content = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-amber-800">4.1 Utilisation de la chambre</h3>
    <p>Le Client s'engage à utiliser la chambre et tous les équipements de l'hôtel de manière raisonnable, dans le respect de la réglementation en vigueur, des bonnes mœurs et de l'ordre public.</p>

    <h3 className="text-lg font-bold text-amber-800">4.2 Dégradations</h3>
    <p>Le Client est responsable de toutes les éventuelles dégradations causées, ainsi que de tout objet ou mobilier manquant. En cas de dégradation, GRAND HOTEL ADAMAOUA procédera à une refacturation selon le barème annexé, dans un délai de 48 heures suivant le départ.</p>
    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
      <p className="font-medium text-red-800"><span className="font-bold">Important :</span> L'hôtel est non-fumeur. Le fait de fumer dans les parties communes et/ou les chambres est constitutif d'une dégradation et entraînera une facturation selon le barème applicable.</p>
    </div>

    <h3 className="text-lg font-bold text-amber-800">4.3 Comportement</h3>
    <p>En cas de comportement contraire aux bonnes mœurs ou à l'ordre public, GRAND HOTEL ADAMAOUA pourra exiger que le Client quitte l'hôtel immédiatement, sans remboursement.</p>

    <h3 className="text-lg font-bold text-amber-800">4.4 Mineurs</h3>
    <p>Si des mineurs occupent des chambres réservées par le Client, au moins une personne majeure doit être présente dans chaque chambre.</p>

    <h3 className="text-lg font-bold text-amber-800">4.5 Objets de valeur</h3>
    <p>Le Client s'engage à déposer dans le coffre-fort de l'hôtel les objets et sommes d'argent dont la valeur est supérieure à 200 000 Francs CFA (adaptation au contexte camerounais).</p>

    <h3 className="text-lg font-bold text-amber-800">4.6 Fiche de police</h3>
    <p>Le Client devra remplir une fiche de police lors de son arrivée et présenter une pièce d'identité en cours de validité, conformément à la réglementation camerounaise.</p>

    <h3 className="text-lg font-bold text-amber-800">4.7 Accès à l'hôtel</h3>
    <p>L'accès à l'hôtel est possible 24h/24. En cas de perte de la clé, un double peut être obtenu sur présentation d'une pièce d'identité.</p>

    <h3 className="text-lg font-bold text-amber-800">4.8 Heure d'arrivée</h3>
    <p>Les chambres peuvent être occupées à compter de 14h00.</p>

    <h3 className="text-lg font-bold text-amber-800">4.9 Heure de départ</h3>
    <p>Les chambres doivent être libérées avant 12h00, sous peine de facturation d'une nuit supplémentaire.</p>

    <h3 className="text-lg font-bold text-amber-800">4.10 Arrivée anticipée - Départ tardif</h3>
    <p>Sous réserve de disponibilité, ces services peuvent être souscrits sur place moyennant un supplément.</p>

    <h3 className="text-lg font-bold text-amber-800">4.11 Services inclus</h3>
    <p>Le détail des services figure en annexe des Conditions Générales.</p>

    <h3 className="text-lg font-bold text-amber-800">4.12 Accès Internet</h3>
    <p>Le Client s'engage à respecter les Conditions d'Utilisation de l'accès à Internet.</p>
  </div>
);

const Section5Content = () => (
  <div className="space-y-4">
    <p>Sur le Site GRAND HOTEL ADAMAOUA, le Client a la possibilité de créer un compte Club.</p>
    <p>Via son compte Club, le Client peut notamment :</p>
    <ul className="list-disc pl-6 space-y-2">
      <li>Modifier ses informations personnelles ;</li>
      <li>Accéder au récapitulatif de ses réservations en cours et de ses précédents séjours ;</li>
      <li>Entrer en relation et communiquer avec le Service Clients ;</li>
      <li>Bénéficier d'avantages commerciaux.</li>
    </ul>
  </div>
);

const Section6Content = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-amber-800">6.1 Tarifs</h3>
    <p>Les tarifs sont exprimés en Francs CFA. Ils comprennent la TVA (19,25% au Cameroun) et la taxe de développement touristique (1,5%). Toute modification des taxes sera répercutée sur le prix total.</p>

    <h3 className="text-lg font-bold text-amber-800">6.2 Occupation</h3>
    <p>Les tarifs s'entendent par chambre, pour une nuitée et dans la limite maximale de deux (2) occupants par chambre (hors enfants de moins de 24 mois, lit bébé gratuit sur demande).</p>

    <h3 className="text-lg font-bold text-amber-800">6.3 Types de tarifs</h3>
    <p>Différents types de tarifs peuvent être proposés : flexibles (annulables et modifiables) ou non remboursables.</p>

    <h3 className="text-lg font-bold text-amber-800">6.4 Modalités de paiement</h3>
    <ul className="list-disc pl-6">
      <li>Réservations non remboursables : prépaiement total au moment de la réservation.</li>
      <li>Réservations flexibles : paiement à l'arrivée à l'hôtel.</li>
    </ul>

    <h3 className="text-lg font-bold text-amber-800">6.5 Extras et dégradations</h3>
    <p>Les éventuels extras et indemnités seront prélevés sur la carte bancaire fournie. Les coordonnées bancaires sont conservées 7 jours après le séjour.</p>

    <h3 className="text-lg font-bold text-amber-800">6.6 Modification des tarifs</h3>
    <p>GRAND HOTEL ADAMAOUA peut modifier ses tarifs à tout moment, sans conséquence pour les réservations déjà confirmées.</p>
  </div>
);

const Section7Content = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-amber-800">7.1 Droit de rétractation</h3>
    <p>Conformément à la législation camerounaise, le Client est informé qu'il ne dispose pas du droit de rétractation pour les services d'hébergement.</p>

    <h3 className="text-lg font-bold text-amber-800">7.2 Modalités d'annulation</h3>
    <p>Les modalités sont détaillées dans la Politique d'annulation propre au tarif choisi.</p>

    <h3 className="text-lg font-bold text-amber-800">7.3 Tarifs non remboursables</h3>
    <p>L'annulation n'est pas permise. Toutefois, modification possible jusqu'à 24h avant l'arrivée pour un séjour dans les 12 mois, sous réserve de disponibilité et d'ajustement tarifaire.</p>

    <h3 className="text-lg font-bold text-amber-800">7.4 Tarifs flexibles</h3>
    <p>Annulation possible jusqu'à 18h le jour de l'arrivée sans frais. Après ce délai, la première nuit est facturée.</p>

    <h3 className="text-lg font-bold text-amber-800">7.5 No-show</h3>
    <p>En cas de non-présentation, selon le type de tarif, soit aucune indemnité, soit facturation de la première nuit.</p>

    <h3 className="text-lg font-bold text-amber-800">7.6 Indisponibilité de l'hôtel</h3>
    <p>En cas d'indisponibilité exceptionnelle, GRAND HOTEL ADAMAOUA proposera soit le remboursement, soit un relogement dans un établissement équivalent.</p>
  </div>
);

const Section8Content = () => (
  <div className="space-y-4">
    <p>L'activation du compte Club permet de bénéficier d'un programme de fidélité avec des réductions spécifiques. Le détail est consultable sur le site.</p>
  </div>
);

const Section9Content = () => (
  <div className="space-y-4">
    <p>Le Client est seul responsable du choix des services. Les réclamations doivent être adressées au personnel de l'hôtel, puis par email à la Direction dans un délai maximal de 30 jours après le séjour.</p>
  </div>
);

const Section10Content = () => (
  <div className="space-y-4">
    <p>Pour contacter la Direction :</p>
    <ul className="list-disc pl-6">
      <li>Par email : direction@grandhoteladamaoua.com</li>
      <li>Via le compte personnel sur le site</li>
    </ul>
  </div>
);

const Section11Content = () => (
  <div className="space-y-4">
    <p>Aucune défaillance due à un événement de force majeure ne sera considérée comme un manquement contractuel, conformément à la jurisprudence camerounaise.</p>
  </div>
);

const Section12Content = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-amber-800">12.1 Collecte et traitement</h3>
    <p>Les données personnelles sont traitées conformément à la loi camerounaise n°2010/013 du 21 décembre 2010 relative aux communications électroniques.</p>

    <h3 className="text-lg font-bold text-amber-800">12.2 Transmission à des tiers</h3>
    <p>Les données peuvent être communiquées à des tiers pour la réalisation de la prestation (plateforme de réservation, paiement sécurisé).</p>

    <h3 className="text-lg font-bold text-amber-800">12.3 Marketing</h3>
    <p>Les données peuvent être utilisées pour des opérations marketing, sauf opposition du Client. Conservation des données pendant 3 ans après la fin de la relation commerciale.</p>

    <h3 className="text-lg font-bold text-amber-800">12.4 Droits du Client</h3>
    <p>Le Client dispose d'un droit d'accès, de modification et de suppression de ses données.</p>

    <h3 className="text-lg font-bold text-amber-800">12.5 Sécurité</h3>
    <p>GRAND HOTEL ADAMAOUA prend toutes les mesures nécessaires pour assurer la protection des données.</p>
  </div>
);

const Section13Content = () => (
  <div className="space-y-4">
    <p>Les courriers électroniques et SMS échangés ont valeur probante. Les Conditions Générales peuvent être modifiées, la version applicable étant celle en ligne sur le site.</p>
  </div>
);

const Section14Content = () => (
  <div className="space-y-4">
    <p>Le Contrat est soumis au droit camerounais. En cas de litige, une procédure de médiation conventionnelle peut être engagée.</p>
  </div>
);

const Section15Content = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-bold text-amber-800">Services inclus dans le prix de la nuitée</h3>
    <ul className="list-disc pl-6 space-y-2">
      <li>Hébergement en chambre double</li>
      <li>Petit-déjeuner</li>
      <li>Accès à plus de 500 chaînes internationales</li>
      <li>Accès Internet Wi-Fi</li>
      <li>Produits cosmétiques</li>
      <li>Parking (sur demande, sous réserve de disponibilité)</li>
      <li>Lit bébé gratuit (sur demande, sous réserve de disponibilité)</li>
      <li>Service de conciergerie</li>
    </ul>

    <h3 className="text-lg font-bold text-amber-800">Services non inclus</h3>
    <ul className="list-disc pl-6">
      <li>Consommation de boissons</li>
      <li>Service en chambre</li>
      <li>Pressing</li>
    </ul>

    <h3 className="text-lg font-bold text-amber-800">Barème des dégradations (adapté au contexte camerounais)</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-amber-800 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Dégradation constatée</th>
            <th className="py-3 px-4 text-left">Tarif applicable (FCFA)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          <tr><td className="py-2 px-4">Client ayant fumé dans sa chambre</td><td className="py-2 px-4">60 000</td></tr>
          <tr><td className="py-2 px-4">Chambre anormalement sale</td><td className="py-2 px-4">20 000</td></tr>
          <tr><td className="py-2 px-4">TV</td><td className="py-2 px-4">250 000</td></tr>
          <tr><td className="py-2 px-4">Matelas</td><td className="py-2 px-4">330 000</td></tr>
          <tr><td className="py-2 px-4">Bureau</td><td className="py-2 px-4">100 000</td></tr>
          <tr><td className="py-2 px-4">Coffre-fort</td><td className="py-2 px-4">100 000</td></tr>
        </tbody>
      </table>
    </div>

    <h3 className="text-lg font-bold text-amber-800 mt-6">Barème des objets manquants</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-amber-800 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Objet manquant</th>
            <th className="py-3 px-4 text-left">Tarif applicable (FCFA)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          <tr><td className="py-2 px-4">Grande serviette</td><td className="py-2 px-4">15 000</td></tr>
          <tr><td className="py-2 px-4">Housse de couette</td><td className="py-2 px-4">100 000</td></tr>
          <tr><td className="py-2 px-4">Oreiller</td><td className="py-2 px-4">40 000</td></tr>
          <tr><td className="py-2 px-4">Télécommande TV</td><td className="py-2 px-4">6 000</td></tr>
          <tr><td className="py-2 px-4">Télécommande clim</td><td className="py-2 px-4">6 000</td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default GrandHotelCGV;