'use client'
import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface coords {
    longitude: number;
    latitude: number;
}

interface MarkerData {
    latitude: number;
    longitude: number;
    description: string;
    address: string;
}

const Mapa = () => {

    // Estado para armazenar os dados dos marcadores
    const [userLocation, setUserLocation] = useState<coords>();
    const [markersData, setMarkersData] = useState<MarkerData[]>([]);

    // Função para obter a localização atual
    useEffect(() => {
        const getUserLocation = () => {
            if (navigator.geolocation) {
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
    }, []);

    // Função para carregar os dados dos marcadores
    useEffect(() => {
        // Carregar os dados do arquivo JSON
        const fetchMarkers = async () => {
            try {
                const response = await fetch('/markers.json');
                const data = await response.json();
                setMarkersData(data);
            } catch (error) {
                console.error('Erro ao carregar marcadores:', error);
            }
        };
        fetchMarkers();
    }, [])

    // Use o hook useEffect para criar o mapa apenas quando a localização do usuário estiver disponível
    useEffect(() => {
        if (userLocation && markersData.length > 0) {
            mapboxgl.accessToken = 'pk.eyJ1IjoiYmFycm9zMjYzIiwiYSI6ImNtM29jdXowejAyZjQya3EzNGcxYzV2YWkifQ.Djv_p2br6Rk2qIbVvPPlcQ';

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
                style: 'mapbox://styles/barros263/cm3ogyktv006l01rzgf8mg5qa',
                center: [userLocation.longitude, userLocation.latitude],
                zoom: 12,
            });

            // Definir limites do mapa
            map.setMaxBounds(bounds);

            // Adicionar o marcador do usuário
            new mapboxgl.Marker()
                .setLngLat([userLocation.longitude, userLocation.latitude])
                .addTo(map);

            // Adicionar marcadores quando os dados forem carregados
            if (markersData.length > 0) {
                markersData.forEach(({ latitude, longitude, description, address }) => {
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
                        .setPopup(new mapboxgl.Popup().setHTML(`<p>${description}<br/>${address}</p>`)) // Popup ao clicar
                        .addTo(map);
                });
            }

            return () => map.remove();
        }
    }, [userLocation, markersData]);

    return (
        <div id='container-mapa'>
            {userLocation ? (
                <div style={{ height: '100vh', width: '100%' }} id="map"></div>
            ) : (
                <p>Obtendo localização...</p>
            )}
        </div>
    );
};

export default Mapa;
