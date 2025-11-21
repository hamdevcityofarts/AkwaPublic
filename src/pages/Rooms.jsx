import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import RoomCard from '../components/RoomCard'
import { fetchRooms } from '../store/slices/roomsSlice'

export default function Rooms() {
  const dispatch = useDispatch()
  const { rooms, isLoading, error } = useSelector((state) => state.rooms)
  const [roomsWithPromos, setRoomsWithPromos] = useState([])
  const [loadingPromos, setLoadingPromos] = useState(false)

  useEffect(() => {
    dispatch(fetchRooms())
  }, [dispatch])

  // ✅ CHARGER LES PROMOS POUR CHAQUE CHAMBRE
  useEffect(() => {
    if (rooms.length > 0) {
      loadPromosForAllRooms()
    }
  }, [rooms])

  const loadPromosForAllRooms = async () => {
    setLoadingPromos(true)
    try {
      console.group('🏨 CHARGEMENT DES PROMOS - ANALYSE COMPLÈTE')
      console.log('📊 Nombre total de chambres:', rooms.length)
      console.table(rooms.map(room => ({
        ID: room._id,
        Nom: room.name,
        Numéro: room.number,
        Type: room.type,
        Prix: `${room.price?.toLocaleString()} FCFA`,
        Statut: room.status
      })))

      const roomsWithPromosData = await Promise.all(
        rooms.map(async (room) => {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/codepromo/room/${room._id}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            )

            if (!response.ok) {
              return { ...room, activePromos: [], bestPromo: null }
            }

            const result = await response.json()

            if (result.success && result.availablePromos && result.availablePromos.length > 0) {
              // ✅ Trier par meilleure réduction
              const sortedPromos = result.availablePromos.sort((a, b) => {
                const savingsA = a.economie || 0
                const savingsB = b.economie || 0
                return savingsB - savingsA
              })

              return {
                ...room,
                activePromos: sortedPromos,
                bestPromo: sortedPromos[0]
              }
            }
          } catch (error) {
            console.error(`🚨 Erreur pour ${room.name}:`, error)
          }
          return { ...room, activePromos: [], bestPromo: null }
        })
      )

      // ✅ ANALYSE FINALE DÉTAILLÉE
      const roomsWithActivePromos = roomsWithPromosData.filter(
        room => room.activePromos && room.activePromos.length > 0
      )

      console.log('\n📈 RÉSULTATS FINAUX:')
      console.log(`🏨 Total chambres: ${roomsWithPromosData.length}`)
      console.log(`🔥 Chambres avec promos: ${roomsWithActivePromos.length}`)
      console.log(`⚪ Chambres sans promo: ${roomsWithPromosData.length - roomsWithActivePromos.length}`)

      if (roomsWithActivePromos.length > 0) {
        console.log('\n📋 DÉTAIL DES CHAMBRES AVEC PROMOS:')
        roomsWithActivePromos.forEach((room, index) => {
          const bestPromo = room.bestPromo
          const reduction = bestPromo.type === 'percentage' 
            ? `${bestPromo.value}%` 
            : `${bestPromo.value.toLocaleString()} FCFA`
          
          console.log(
            `${index + 1}. ${room.name} (#${room.number}) - ${room.activePromos.length} promo(s)`
          )
          console.log(`   💰 Prix: ${room.price?.toLocaleString()} → ${bestPromo.prixReduit?.toLocaleString()} FCFA`)
          console.log(`   🎯 Meilleure: ${bestPromo.code} (${reduction}) - Économie: ${bestPromo.economie?.toLocaleString()} FCFA`)
          
          if (room.activePromos.length > 1) {
            console.log(`   📦 Autres promos: ${room.activePromos.slice(1).map(p => p.code).join(', ')}`)
          }
        })

        // ✅ STATISTIQUES DES RÉDUCTIONS
        console.log('\n📊 STATISTIQUES DES RÉDUCTIONS:')
        const reductions = roomsWithActivePromos.map(room => {
          const promo = room.bestPromo
          return promo.type === 'percentage' ? promo.value : Math.round((promo.economie / room.price) * 100)
        })
        
        console.log(`📈 Réduction max: ${Math.max(...reductions)}%`)
        console.log(`📉 Réduction min: ${Math.min(...reductions)}%`)
        console.log(`📊 Réduction moyenne: ${Math.round(reductions.reduce((a, b) => a + b, 0) / reductions.length)}%`)
      } else {
        console.log('\nℹ️ Aucune chambre avec des promos actives trouvée')
        console.log('💡 Vérifiez que:')
        console.log('   - Les codes promo sont "actifs"')
        console.log('   - Les dates de validité sont correctes')
        console.log('   - Les chambres sont bien associées aux promos')
        console.log('   - L\'URL de l\'API est accessible')
      }

      console.groupEnd()

      setRoomsWithPromos(roomsWithPromosData)
    } catch (error) {
      console.error('🚨 Erreur générale chargement promos:', error)
      setRoomsWithPromos(rooms.map(room => ({ ...room, activePromos: [], bestPromo: null })))
    } finally {
      setLoadingPromos(false)
    }
  }

  // ✅ TEST RAPIDE BACKEND
  const testBackendConnection = async () => {
    console.group('🧪 TEST CONNEXION BACKEND')
    
    try {
      console.log('🔗 Test de connexion à l\'API...')
      const testResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/codepromo/active`)
      console.log(`📡 Status: ${testResponse.status}`)
      
      if (testResponse.ok) {
        const data = await testResponse.json()
        console.log('✅ API accessible - Promos actives:', data.promos?.length || 0)
        
        if (data.promos && data.promos.length > 0) {
          console.log('📦 Promos disponibles côté backend:')
          data.promos.forEach(promo => {
            console.log(`   - ${promo.code}: ${promo.description}`)
            console.log(`     Applicable à: ${promo.applicableToAll ? 'Toutes les chambres' : promo.chambres?.length + ' chambre(s)'}`)
          })
        }
      } else {
        console.error('❌ API inaccessible')
      }
    } catch (error) {
      console.error('🚨 Erreur connexion backend:', error)
    }
    
    console.groupEnd()
  }

  // ✅ VÉRIFIER UNE CHAMBRE SPÉCIFIQUE
  const testSpecificRoom = async (roomId = null) => {
    const roomToTest = roomId || (rooms.length > 0 ? rooms[0]._id : null)
    if (!roomToTest) return

    console.group(`🔍 TEST DÉTAILLÉ CHAMBRE ${roomToTest}`)
    
    try {
      const room = rooms.find(r => r._id === roomToTest)
      console.log('🏨 Chambre:', room?.name || 'Non trouvée')
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/codepromo/room/${roomToTest}`
      )
      
      console.log(`📡 Réponse: ${response.status}`)
      
      if (response.ok) {
        const result = await response.json()
        console.log('📦 Données reçues:', result)
        
        if (result.success && result.availablePromos) {
          console.log(`🎯 ${result.availablePromos.length} promo(s) trouvée(s)`)
          result.availablePromos.forEach(promo => {
            console.log(`   💎 ${promo.code}: ${promo.type} ${promo.value}`)
            console.log(`      → Économie: ${promo.economie?.toLocaleString()} FCFA`)
            console.log(`      → Prix réduit: ${promo.prixReduit?.toLocaleString()} FCFA`)
          })
        } else {
          console.log('❌ Aucune promo disponible')
        }
      }
    } catch (error) {
      console.error('🚨 Erreur test:', error)
    }
    
    console.groupEnd()
  }

  if (isLoading || loadingPromos) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {loadingPromos ? 'Chargement des promotions...' : 'Chargement des chambres...'}
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Erreur</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  // ✅ COMPTER LES CHAMBRES AVEC PROMOS
  const roomsWithActivePromos = roomsWithPromos.filter(
    room => room.activePromos && room.activePromos.length > 0
  ).length

  return (
    <div className="container mx-auto px-4 py-12">
      {/* ✅ PANEL DE DEBUG OPTIMISÉ */}
      

      <div className="my-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Nos Chambres</h1>
        <p className="text-gray-600">Découvrez notre sélection de chambres et suites</p>

        {/* ✅ BANNIÈRE PROMOTIONS ACTIVES */}
        {roomsWithActivePromos > 0 && (
          <div className="mt-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-orange-100 p-2 rounded-lg mr-3">
                  <span className="text-orange-600 text-lg">🔥</span>
                </div>
                <div>
                  <h3 className="font-semibold text-orange-900">Promotions en cours !</h3>
                  <p className="text-orange-700 text-sm">
                    {roomsWithActivePromos} chambre(s) avec des réductions exceptionnelles
                  </p>
                </div>
              </div>
              <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                - Jusqu'à{' '}
                {Math.max(
                  ...roomsWithPromos
                    .filter(room => room.activePromos && room.activePromos.length > 0)
                    .map(room => {
                      const bestPromo = room.activePromos[0]
                      return bestPromo?.type === 'percentage'
                        ? bestPromo.value
                        : Math.round((bestPromo?.economie / room.price) * 100) || 0
                    })
                )}
                %
              </div>
            </div>
          </div>
        )}
      </div>

      {roomsWithPromos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucune chambre disponible pour le moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roomsWithPromos.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      )}
    </div>
  )
}