'use client'
import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface coords {
    longitude: number;
    latitude: number;
}

const MapWithLocation = () => {

    const [markersData, setMarkersData] = useState([]);
    const [userLocation, setUserLocation] = useState<coords>();

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

    // Use o hook useEffect para criar o mapa apenas quando a localização do usuário estiver disponível
    useEffect(() => {
        if (userLocation) {
            mapboxgl.accessToken = 'pk.eyJ1IjoiYmFycm9zMjYzIiwiYSI6ImNtM29jdXowejAyZjQya3EzNGcxYzV2YWkifQ.Djv_p2br6Rk2qIbVvPPlcQ';

            const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/barros263/cm3ogyktv006l01rzgf8mg5qa',
                center: [userLocation.longitude, userLocation.latitude],
                zoom: 15,
            });

            new mapboxgl.Marker()
                .setLngLat([userLocation.longitude, userLocation.latitude])
                .addTo(map);

            // Adicionar marcadores quando os dados forem carregados
            if (markersData.length > 0) {
                markersData.forEach(({ latitude, longitude, description }) => {
                    // Criar elemento para o marcador
                    const el = document.createElement('div');
                    el.className = 'marker';
                    el.style.backgroundColor = 'red';
                    el.style.width = '15px';
                    el.style.height = '15px';
                    el.style.borderRadius = '50%';

                    // Adicionar marcador ao mapa
                    new mapboxgl.Marker()
                        .setLngLat([longitude, latitude])
                        .setPopup(new mapboxgl.Popup().setHTML(`<p>${description}</p>`)) // Popup ao clicar
                        .addTo(map);
                });
            }

            return () => map.remove();
        }

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
    }, [userLocation]);

    return (
        <div id='container-mapa'>
            {userLocation ? (
                <div style={{ height: '90vh', width: '60%' }} id="map"></div>
            ) : (
                <p>Obtendo localização...</p>
            )}
        </div>
    );
};

export default MapWithLocation;
