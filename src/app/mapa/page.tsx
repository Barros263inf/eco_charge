'use client'
import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';
import apiHandller from 'utils/apiHandller';

const Mapa = () => {
    // Instancia das variuaveis de ambiente
    const MAP_BOX_TOKEN= process.env.NEXT_PUBLIC_MAP_BOX_TOKEN;
    const MAP_BOX_STYLE = process.env.NEXT_PUBLIC_MAP_BOX_STYLE;

    // Estado para armazenar os dados dos marcadores
    const [userLocation, setUserLocation] = useState<Coords>();
    const [markersData, setMarkersData] = useState<MarkerData[]>([]);

    useEffect(() => {
        // Função para carregar os dados dos marcadores
        const fetchMarkers = async () => {

            const response = await apiHandller("/estabelecimentos", "GET");
            setMarkersData(response);
                
        };
        // Função para obter a localização atual
        const getUserLocation = async () => {

            if (await navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setUserLocation({ latitude, longitude });
                    },
                    (error) => {
                        console.error('Erro ao obter localização:', error);
                    }
                );
            } else {
                console.error('Geolocalização não é suportada pelo navegador.');
            }
        };
        getUserLocation();
        fetchMarkers();
    }, [navigator])

    // Use o hook useEffect para criar o mapa apenas quando a localização do usuário estiver disponível
    useEffect(() => {
        if (userLocation && markersData.length > 0 || userLocation) {

            mapboxgl.accessToken = MAP_BOX_TOKEN;
            
            const { latitude, longitude } = userLocation;

            // Calcular deslocamento para 20 km em graus
            const kmToDegrees = 20 / 111;
            const north = latitude + kmToDegrees;
            const south = latitude - kmToDegrees;
            const east = longitude + kmToDegrees / Math.cos((latitude * Math.PI) / 180);
            const west = longitude - kmToDegrees / Math.cos((latitude * Math.PI) / 180);

            const bounds: [number, number, number, number] = [west, south, east, north];

            // Criar o mapa
            const map = new mapboxgl.Map({
                container: 'map',
                style: MAP_BOX_STYLE,
                center: [userLocation.longitude, userLocation.latitude],
                zoom: 12,
            });

            // Definir limites do mapa
            map.setMaxBounds(bounds);

            // Adicionar o marcador do usuário
            new mapboxgl.Marker()
                .setLngLat([userLocation.longitude, userLocation.latitude])
                .addTo(map)

            // Adicionar marcadores quando os dados forem carregados
            if (markersData.length > 0) {
                markersData.forEach(({ latitude, longitude, logradouro, nome }) => {
                    // Criar elemento para o marcador
                    const el = document.createElement('div');
                    el.className = 'marker';
                    el.style.backgroundImage = `url(/icons/painel-solar.png)`;
                    el.style.width = '50px';
                    el.style.height = '50px';
                    el.style.backgroundSize = '100%';
                    el.style.backgroundRepeat = 'no-repeat';
                    el.style.backgroundPosition = 'center';
                    el.style.cursor = 'pointer';

                    // Adicionar marcador ao mapa
                    new mapboxgl.Marker(el)
                        .setLngLat([longitude, latitude])
                        .setPopup(new mapboxgl.Popup().setHTML(
                            `<p class="popup">
                                ${nome}<br/>
                                ${logradouro}<br/>
                                <a href="https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}" target="_blank">Ver no Google Maps</a>
                            </p>`
                        )) // Popup ao clicar
                        .addTo(map);
                });
            }

            return () => map.remove();
        }
    }, [userLocation, markersData, MAP_BOX_STYLE, MAP_BOX_TOKEN]);

    return (
        <section id="map-page">
            <div id="container-info">
                <h2>A bateria acabou?</h2>
                <p>
                    Encontre um estabelecimento próximo para recarregar. <br />

                    É facil é rápido
                </p>
                <img src="/banner-info.jpg" alt="ilustração de uma estação de carregamento" />
                <button className='button'>
                    <Link href="/dashboard">
                        Solicite sua recarga
                    </Link>
                </button>
            </div>

            <div id='container-map'>
                {userLocation ? (
                    <div style={{ height: '100vh', width: '100%' }} id="map"></div>
                ) : (
                    <p>Obtendo localização...</p>
                )}
            </div>
        </section>
    );
};

export default Mapa;
