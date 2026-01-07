import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b mt-5 from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CONDITIONS GÉNÉRALES
          </h1>
          <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <p className="text-lg text-gray-700 mb-4">
            <strong>GRAND HOTEL</strong> exploite le site Internet ______ (ci-après le « Site GRAND HOTEL »), qui permet aux utilisateurs d'effectuer des réservations de nuitées au sein de son établissement.
          </p>
          <p className="text-lg text-gray-700">
            Les présentes Conditions Générales ont pour objet de régir les relations contractuelles entre le client (ci-après le Client) et la société exploitante de l'hôtel concerné (ci-après GRAND HOTEL), telle qu'identifiée dans le récapitulatif de réservation et dans la liste annexée aux présentes Conditions Générales.
          </p>
        </div>

        {/* Sections principales */}
        <div className="space-y-8">
          {/* Section 1 */}
          <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">
                1
              </div>
              <h2 className="text-2xl font-bold text-gray-800 pt-1">Documents contractuels - Ordre de préséance</h2>
            </div>
            
            <div className="pl-14 space-y-4">
              <p className="text-gray-700">
                Les relations entre GRAND HOTEL et le Client sont régies par les Conditions Générales, complétées par leurs annexes (le descriptif des services - ci-après « le Descriptif des Services » et le barème des tarifs facturés au Client en cas de dégradation / détérioration ou encore si des objets et/ou du mobilier sont manquants dans les chambres), ainsi que par le récapitulatif de réservation sur lequel figurent notamment le tarif appliqué et les éventuelles conditions particulières liées au tarif choisi (les conditions de paiement, d'une part, et les conditions d'annulation et de modification - ci-après la « Politique d'annulation et de modification », d'autre part).
              </p>
              
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <p className="font-semibold text-gray-800 mb-3">En cas de contradiction entre ces différents documents, l'ordre de préséance sera le suivant :</p>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="font-bold text-blue-600 mr-3">1.</span>
                    <span><strong>Les Conditions Générales ;</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-blue-600 mr-3">2.</span>
                    <span><strong>Le récapitulatif de réservation ;</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-blue-600 mr-3">3.</span>
                    <span><strong>Les annexes aux Conditions Générales.</strong></span>
                  </li>
                </ol>
              </div>
              
              <p className="text-gray-700 font-medium">
                L'ensemble de ces documents constitue l'intégralité du contrat (ci-après « le Contrat »).
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">
                2
              </div>
              <h2 className="text-2xl font-bold text-gray-800 pt-1">Conditions préalables</h2>
            </div>
            
            <div className="pl-14 space-y-4">
              <p className="text-gray-700">
                La réservation d'une chambre auprès de GRAND HOTEL est réservée aux personnes physiques majeures et juridiquement capables. En procédant à la réservation d'une chambre auprès de GRAND HOTEL, le Client déclare expressément remplir ces conditions.
              </p>
              
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                <p className="text-blue-800 font-medium">
                  Toutefois, les enfants mineurs accompagnés de leurs parents ou de leurs représentants légaux sont autorisés à séjourner à l'hôtel dans le cadre d'une réservation effectuée par ces derniers, sous leur entière responsabilité.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">
                3
              </div>
              <h2 className="text-2xl font-bold text-gray-800 pt-1">Procédure de réservation</h2>
            </div>
            
            <div className="pl-14 space-y-6">
              <p className="text-gray-700">
                Le Client peut effectuer une réservation auprès de GRAND HOTEL selon les modalités suivantes, sous réserve de disponibilité des chambres :
              </p>

              {/* 3.1 Réservation en présentiel */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-700 w-8 h-8 flex items-center justify-center rounded-full mr-3">3.1</span>
                  Réservation en présentiel
                </h3>
                <p className="text-gray-700">
                  Le Client peut réserver directement à la réception de l'hôtel, auprès des agents d'accueil.
                </p>
              </div>

              {/* 3.2 Réservation en ligne */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-700 w-8 h-8 flex items-center justify-center rounded-full mr-3">3.2</span>
                  Réservation en ligne (via le Site GRAND HOTEL) + Booking
                </h3>
                
                <p className="text-gray-700 mb-6">La procédure de réservation en ligne se déroule en plusieurs étapes :</p>
                
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-green-100 text-green-700 w-7 h-7 flex items-center justify-center rounded-full mr-3">I</span>
                      Étape I : Choix et identification
                    </h4>
                    <ul className="space-y-2 text-gray-700 ml-10">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                        <span>Sélection de l'hôtel, des dates de séjour, du type et du nombre de chambres ;</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                        <span>Choix du tarif du jour après consultation du descriptif des chambres, des services inclus, des conditions de paiement et de la politique d'annulation et de modification ;</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                        <span>Le Client est invité à s'identifier s'il possède un compte Club, ou à créer un compte en renseignant ses coordonnées et un mot de passe. Il garantit l'exactitude des informations fournies.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-green-100 text-green-700 w-7 h-7 flex items-center justify-center rounded-full mr-3">2</span>
                      Étape 2 : Réservation
                    </h4>
                    <ul className="space-y-2 text-gray-700 ml-10">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                        <span>Remplissage du formulaire de réservation ;</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                        <span>Pour toute demande portant sur plus de 10 chambres à la même date, le Client doit contacter l'hôtel par téléphone ou par mail. Des conditions particulières lui seront alors communiquées.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-green-100 text-green-700 w-7 h-7 flex items-center justify-center rounded-full mr-3">3</span>
                      Étape 3 : Validation
                    </h4>
                    <ul className="space-y-2 text-gray-700 ml-10">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                        <span>Sélection du tarif (flexible ou non remboursable) et des options complémentaires (avec tarification précisée) ;</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                        <span>Saisie des coordonnées et des informations de paiement ;</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                        <span>Affichage des conditions de paiement et de la politique d'annulation ;</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                        <span>Validation de la réservation après acceptation des Conditions Générales et du Descriptif des Services.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-green-100 text-green-700 w-7 h-7 flex items-center justify-center rounded-full mr-3">4</span>
                      Étape 4 : Confirmation
                    </h4>
                    <ul className="space-y-2 text-gray-700 ml-10">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                        <span>Une fois la réservation finalisée, un récapitulatif s'affiche à l'écran ;</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                        <span>Un e-mail de confirmation est envoyé à l'adresse fournie, contenant les Conditions Générales, le Descriptif des Services et la Politique d'annulation et de modification.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 3.3 Réservation par téléphone */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-700 w-8 h-8 flex items-center justify-center rounded-full mr-3">3.3</span>
                  Réservation par téléphone
                </h3>
                <p className="text-gray-700 mb-4">
                  Le Client peut réserver en appelant le numéro indiqué sur le site GRAND HOTEL.
                </p>
                
                <div className="bg-white p-5 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-800 mb-3">Il devra fournir les informations suivantes :</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Type et nombre de chambres, dates de séjour, choix du tarif ;</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Nom, coordonnées, adresse e-mail et données bancaires (valables au moment du séjour) ;</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Le personnel de GRAND HOTEL lui communiquera le descriptif des chambres, les services inclus, les tarifs, les conditions de paiement et la politique d'annulation ;</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Après validation, un e-mail de confirmation est envoyé avec l'ensemble des documents contractuels.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 3.4 Réservation par email */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-700 w-8 h-8 flex items-center justify-center rounded-full mr-3">3.4</span>
                  Réservation par courrier électronique
                </h3>
                <p className="text-gray-700 mb-4">
                  Le Client peut adresser sa demande de réservation par e-mail à GRAND HOTEL, en précisant :
                </p>
                
                <div className="bg-white p-5 rounded-lg border border-gray-200 mb-4">
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>L'hôtel souhaité, le type et le nombre de chambres, et les dates de séjour ;</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-800 mb-3">En retour, GRAND HOTEL lui envoie une offre détaillée incluant :</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                      <span>Les tarifs du jour, le Descriptif des Services, les Conditions Générales, les conditions de paiement et la Politique d'annulation.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-4 space-y-2 text-gray-700">
                  <p className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Le Client confirme sa réservation par retour de mail après avoir consulté tous les documents ;</span>
                  </p>
                  <p className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Un e-mail de confirmation est ensuite adressé à l'adresse fournie.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">Pour toute question</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="font-semibold">Email</p>
              <p>aeroport@mygrandhotel.com</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <p className="font-semibold">Téléphone</p>
              <p>(+237) 699 901 204</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-300 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} GRAND HOTEL. Tous droits réservés.</p>
          <p className="mt-2">Ces conditions générales sont susceptibles d'être mises à jour.</p>
          <p className="mt-1 text-xs text-gray-500">Version 1.0 - Document contractuel</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;