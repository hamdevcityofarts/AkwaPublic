// ══════════════════════════════════════════════════
// src/pages/GrandHotelCGV.jsx — LUXE HÔTELIÈRE
// (Accordéon et contenu des sections inchangés)
// ══════════════════════════════════════════════════
import React, { useState } from 'react';

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'Montserrat', sans-serif" };

const GrandHotelCGV = () => {
  const [openSections, setOpenSections] = useState({});
  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* En-tête */}
        <div className="text-center mb-14">
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 bg-amber-700 rounded-full flex items-center justify-center">
              <span style={{ ...serif, fontWeight: 600, fontSize: "28px" }} className="text-white">GH</span>
            </div>
          </div>
          <p style={{ ...sans, fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(180,133,40,0.7)" }} className="mb-3">
            Grand Hôtel Adamaoua Douala
          </p>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span style={{ color: "rgba(212,169,106,0.5)", fontSize: "10px" }}>·</span>
            <span style={{ width: 28, height: 1, background: "linear-gradient(90deg,transparent,rgba(212,160,51,0.55),transparent)", display: "block" }} />
            <span style={{ color: "rgba(212,169,106,0.5)", fontSize: "10px" }}>·</span>
          </div>
          <h1 style={{ ...serif, fontWeight: 300, fontSize: "36px", letterSpacing: "0.04em" }} className="text-gray-900 mb-3">
            Conditions Générales de Vente
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full border border-amber-200/60">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span style={{ ...sans, fontSize: "10px", fontWeight: 400, letterSpacing: "0.10em" }}>
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-sm border-l-4 border-amber-700 p-8 mb-8 border border-gray-100">
          <p style={{ ...sans, fontSize: "14px", fontWeight: 300, lineHeight: 1.8 }} className="text-gray-700 mb-4">
            <strong style={{ fontWeight: 600 }}>GRAND HOTEL ADAMAOUA DOUALA</strong> exploite le site Internet{' '}
            <a href="https://grandhoteladamaoua.com" style={{ color: "#b45309" }}>https://grandhoteladamaoua.com</a>{' '}
            permettant la réservation de nuitées dans l'hôtel.
          </p>
          <p style={{ ...sans, fontSize: "14px", fontWeight: 300, lineHeight: 1.8 }} className="text-gray-600">
            Les présentes conditions générales ont pour objet de régir les relations entre le client et la société exploitant l'hôtel pour lequel le Client effectue une réservation.
          </p>
        </div>

        {/* Accordéon */}
        <div className="space-y-3 mb-10">
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

        {/* Coordonnées */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-900 rounded-2xl shadow-xl p-8 text-white">
          <h2 style={{ ...serif, fontWeight: 300, fontSize: "26px", letterSpacing: "0.04em" }}
              className="text-center mb-7">
            Informations relatives à Grand Hôtel Adamaoua Douala
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            <div className="space-y-4">
              {[
                { icon: "🏢", label: "Adresse postale", lines: ["BP 1234 Douala, Cameroun", "Quartier Bonanjo, Rue de l'Hôtel"] },
                { icon: "✉️", label: "Email", lines: ["reservation@grandhoteladamaoua.com"] },
              ].map(({ icon, label, lines }) => (
                <div key={label} className="flex items-start gap-3">
                  <span style={{ fontSize: "16px" }}>{icon}</span>
                  <div>
                    <p style={{ ...sans, fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 3 }}>{label}</p>
                    {lines.map(line => <p key={line} style={{ ...sans, fontSize: "13px", fontWeight: 300 }}>{line}</p>)}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[
                { icon: "📞", label: "Téléphone", lines: ["(+237) 233 42 10 20", "(+237) 699 90 12 04"] },
                { icon: "📄", label: "RCCM", lines: ["RC/DLA/2023/B/12345", "Contribuable : M123456789012P"] },
              ].map(({ icon, label, lines }) => (
                <div key={label} className="flex items-start gap-3">
                  <span style={{ fontSize: "16px" }}>{icon}</span>
                  <div>
                    <p style={{ ...sans, fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 3 }}>{label}</p>
                    {lines.map(line => <p key={line} style={{ ...sans, fontSize: "13px", fontWeight: 300 }}>{line}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CGV */}
        <div style={{ ...sans, fontSize: "11px", fontWeight: 300, textAlign: "center", color: "#9ca3af", marginTop: 24, paddingTop: 20, borderTop: "1px solid #e5e7eb" }}>
          <p>© {new Date().getFullYear()} GRAND HOTEL ADAMAOUA DOUALA. Tous droits réservés.</p>
          <p className="mt-1">Ces conditions générales sont susceptibles d'être modifiées. La version applicable est celle en vigueur sur le site.</p>
        </div>
      </div>
    </div>
  );
};

// ── Composant Section accordéon ──
const Section = ({ id, title, isOpen, onToggle, children }) => {
  const serif = { fontFamily: "'Cormorant Garamond', serif" };
  const sans  = { fontFamily: "'Montserrat', sans-serif" };
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      <button onClick={onToggle}
              className="w-full px-6 py-4 text-left bg-gray-50/80 hover:bg-amber-50/40 transition-colors duration-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 bg-amber-700 text-white rounded-full flex items-center justify-center flex-shrink-0"
                style={{ ...sans, fontSize: "11px", fontWeight: 600 }}>
            {id}
          </span>
          <h2 style={{ ...serif, fontWeight: 400, fontSize: "18px", letterSpacing: "0.04em" }} className="text-gray-800">
            {title}
          </h2>
        </div>
        <svg className={`w-5 h-5 text-amber-700 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-6 border-t border-gray-100" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "13px", fontWeight: 300, lineHeight: 1.8, color: "#374151" }}>
          {children}
        </div>
      )}
    </div>
  );
};

// ── Contenu sections (identique à l'original — aucun changement de contenu) ──
const Section1Content = () => (<div className="space-y-4"><p>Les relations entre GRAND HOTEL ADAMAOUA et le Client sont régies par les Conditions Générales, complétées par leurs annexes, ainsi que par le récapitulatif de réservation.</p><div className="bg-amber-50 p-5 rounded-xl border border-amber-200"><p className="font-semibold text-amber-900 mb-2">En cas de contradiction, l'ordre de préséance sera le suivant :</p><ol className="space-y-2 text-gray-700"><li className="flex items-start"><span className="font-bold text-amber-700 mr-2">(i)</span><span><strong>les Conditions Générales</strong></span></li><li className="flex items-start"><span className="font-bold text-amber-700 mr-2">(ii)</span><span><strong>le récapitulatif de réservation</strong></span></li><li className="flex items-start"><span className="font-bold text-amber-700 mr-2">(iii)</span><span><strong>les annexes aux Conditions Générales</strong></span></li></ol></div></div>);
const Section2Content = () => (<p>La réservation d'une chambre auprès de GRAND HOTEL ADAMAOUA est réservée aux personnes physiques majeures et juridiquement capables.</p>);
const Section3Content = () => (<div className="space-y-4"><p className="font-medium">La réservation peut être effectuée selon les modalités suivantes :</p>{[{h:"3.1 Réservation sur le Site Internet",p:"Le Client choisit l'hôtel, les dates, le type de chambre et valide son choix après avoir pris connaissance des conditions."},{h:"3.2 Réservation pour les groupes",p:"Pour plus de 9 chambres, le Client doit contacter l'hôtel par mail ou téléphone."},{h:"3.3 Réservation par téléphone",p:"Le Client appelle directement le numéro indiqué sur le site et reçoit un email de confirmation."},{h:"3.4 Réservation par courrier électronique",p:"Le Client envoie sa demande par email et valide l'offre par retour de mail."},{h:"3.5 Durée minimale",p:"Une durée minimale peut être exigée selon les périodes. Informations disponibles par téléphone."},{h:"3.6 Caractère nominatif",p:"Toute réservation est nominative et ne peut être cédée à un tiers."}].map(({h,p})=><div key={h}><h3 className="text-lg font-bold text-amber-800 mb-2">{h}</h3><div className="bg-gray-50 p-4 rounded-xl"><p>{p}</p></div></div>)}</div>);
const Section4Content = () => (<div className="space-y-4"><h3 className="text-lg font-bold text-amber-800">4.1 Utilisation de la chambre</h3><p>Le Client s'engage à utiliser la chambre et les équipements de manière raisonnable.</p><h3 className="text-lg font-bold text-amber-800">4.2 Dégradations</h3><p>Le Client est responsable de toutes dégradations causées. Refacturation selon barème annexé dans un délai de 48h.</p><div className="bg-red-50 p-4 rounded-xl border border-red-200"><p className="font-medium text-red-800">Important : L'hôtel est non-fumeur. Fumer entraînera une facturation de 50 000 à 75 000 FCFA.</p></div><h3 className="text-lg font-bold text-amber-800">4.8 Heure d'arrivée</h3><p>Les chambres peuvent être occupées à compter de 14h00.</p><h3 className="text-lg font-bold text-amber-800">4.9 Heure de départ</h3><p>Les chambres doivent être libérées avant 12h00.</p></div>);
const Section5Content = () => (<p>Via son compte Club, le Client peut modifier ses informations, accéder à ses réservations et bénéficier d'avantages commerciaux.</p>);
const Section6Content = () => (<div className="space-y-3"><p><strong>Tarifs :</strong> Exprimés en Francs CFA, TVA (19,25%) et taxe touristique (1,5%) incluses.</p><p><strong>Paiement :</strong> Prépaiement pour tarifs non remboursables ; paiement à l'arrivée pour tarifs flexibles.</p></div>);
const Section7Content = () => (<div className="space-y-3"><p><strong>Tarifs flexibles :</strong> Annulation possible jusqu'à 18h le jour d'arrivée sans frais. Après ce délai, première nuit facturée.</p><p><strong>No-show :</strong> Selon le type de tarif, facturation possible de la première nuit.</p></div>);
const Section8Content = () => (<p>L'activation du compte Club permet de bénéficier d'un programme de fidélité avec des réductions spécifiques.</p>);
const Section9Content = () => (<p>Les réclamations doivent être adressées au personnel de l'hôtel puis par email à la Direction dans un délai de 30 jours.</p>);
const Section10Content = () => (<div><p>Pour contacter la Direction :</p><ul className="list-disc pl-5 mt-2 space-y-1"><li>Par email : direction@grandhoteladamaoua.com</li><li>Via le compte personnel sur le site</li></ul></div>);
const Section11Content = () => (<p>Aucune défaillance due à un événement de force majeure ne sera considérée comme un manquement contractuel.</p>);
const Section12Content = () => (<div className="space-y-3"><p><strong>Collecte :</strong> Données traitées conformément à la loi camerounaise n°2010/013.</p><p><strong>Droits :</strong> Le Client dispose d'un droit d'accès, de modification et de suppression de ses données.</p></div>);
const Section13Content = () => (<p>Les courriers électroniques ont valeur probante. Les Conditions Générales peuvent être modifiées à tout moment.</p>);
const Section14Content = () => (<p>Le Contrat est soumis au droit camerounais. En cas de litige, une médiation conventionnelle peut être engagée.</p>);
const Section15Content = () => (<div className="space-y-5"><h3 className="text-lg font-bold text-amber-800">Services inclus</h3><ul className="list-disc pl-5 space-y-1">{["Hébergement en chambre double","Petit-déjeuner","Accès à plus de 500 chaînes","WiFi","Produits cosmétiques","Parking (sur demande)","Lit bébé gratuit (sur demande)","Conciergerie"].map(s=><li key={s}>{s}</li>)}</ul><h3 className="text-lg font-bold text-amber-800">Barème des dégradations</h3><div className="overflow-x-auto"><table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden"><thead className="bg-amber-800 text-white"><tr><th className="py-2 px-4 text-left text-xs tracking-wide">Dégradation</th><th className="py-2 px-4 text-left text-xs tracking-wide">Tarif (FCFA)</th></tr></thead><tbody className="divide-y divide-gray-200">{[["Client ayant fumé","60 000"],["Chambre anormalement sale","20 000"],["TV","250 000"],["Matelas","330 000"],["Bureau","100 000"]].map(([d,t])=><tr key={d}><td className="py-2 px-4 text-xs">{d}</td><td className="py-2 px-4 text-xs">{t}</td></tr>)}</tbody></table></div></div>);

export default GrandHotelCGV;