/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { ArrivalsScreen } from './components/ArrivalsScreen';
import { MapScreen } from './components/MapScreen';
import { FavoritesScreen } from './components/FavoritesScreen';
import { AlertsScreen } from './components/AlertsScreen';
import { RouteDetailsModal } from './components/RouteDetailsModal';
import { WalkingDirectionsModal } from './components/WalkingDirectionsModal';
import { ProfileModal } from './components/ProfileModal';
import { LocationPickerModal } from './components/LocationPickerModal';
import { INITIAL_BUS_STOPS, SERVICE_ALERTS } from './data/transitData';
import { BusStop, BusService } from './types/transit';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('arrivals');
  const [stops, setStops] = useState<BusStop[]>(INITIAL_BUS_STOPS);
  const [currentStopCode, setCurrentStopCode] = useState<string>('B09048');
  const [selectedBusNo, setSelectedBusNo] = useState<string>('65');
  const [currentLocationName, setCurrentLocationName] = useState<string>('Near Orchard Blvd');
  const [refreshInterval, setRefreshInterval] = useState<number>(20);

  // Favorites state persisted in localStorage
  const [favoriteServiceNos, setFavoriteServiceNos] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sbs_transit_favorites');
      return saved ? JSON.parse(saved) : ['65'];
    } catch {
      return ['65'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sbs_transit_favorites', JSON.stringify(favoriteServiceNos));
    } catch {
      // storage unavailable
    }
  }, [favoriteServiceNos]);

  // Modals state
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isWalkingModalOpen, setIsWalkingModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Current active stop
  const currentStop: BusStop =
    stops.find((s) => s.code === currentStopCode) || stops[0];

  // Currently selected bus service
  const selectedBus: BusService =
    currentStop.services.find((s) => s.serviceNo === selectedBusNo) ||
    currentStop.services[0];

  const handleSelectBus = (serviceNo: string) => {
    setSelectedBusNo(serviceNo);
  };

  const handleSelectStop = (stopCode: string) => {
    setCurrentStopCode(stopCode);
    const stop = stops.find((s) => s.code === stopCode);
    if (stop && stop.services.length > 0) {
      // Keep same bus if present, otherwise default to first
      const hasSameBus = stop.services.some((s) => s.serviceNo === selectedBusNo);
      if (!hasSameBus) {
        setSelectedBusNo(stop.services[0].serviceNo);
      }
    }
  };

  const handleToggleBookmark = (serviceNo: string) => {
    setFavoriteServiceNos((prev) =>
      prev.includes(serviceNo)
        ? prev.filter((no) => no !== serviceNo)
        : [...prev, serviceNo]
    );
  };

  const handleNearMe = () => {
    setCurrentStopCode('B09048');
    setSelectedBusNo('65');
    setCurrentLocationName('Near Orchard Blvd');
    setActiveTab('arrivals');
  };

  const handleUseCurrentGPS = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          handleNearMe();
        },
        () => {
          handleNearMe();
        }
      );
    } else {
      handleNearMe();
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col justify-between selection:bg-[#041453] selection:text-white">
      {/* Top Header */}
      <Header
        currentLocationName={currentLocationName}
        onLocationClick={() => setIsLocationModalOpen(true)}
        onSearchClick={() => {
          setActiveTab('arrivals');
          const input = document.getElementById('busSearchInput');
          if (input) input.focus();
        }}
        onProfileClick={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto pt-20 pb-20 flex flex-col">
        {activeTab === 'arrivals' && (
          <ArrivalsScreen
            currentStop={currentStop}
            selectedBus={selectedBus}
            onSelectBus={handleSelectBus}
            onSelectStop={handleSelectStop}
            onOpenWalkingGuide={() => setIsWalkingModalOpen(true)}
            onOpenRouteModal={() => setIsRouteModalOpen(true)}
            isBookmarked={favoriteServiceNos.includes(selectedBus.serviceNo)}
            onToggleBookmark={handleToggleBookmark}
            onNearMeClick={handleNearMe}
            refreshSecondsTotal={refreshInterval}
          />
        )}

        {activeTab === 'map' && (
          <MapScreen
            stops={stops}
            selectedStop={currentStop}
            selectedBus={selectedBus}
            onSelectStop={handleSelectStop}
            onSelectBus={handleSelectBus}
            onSwitchToArrivals={() => setActiveTab('arrivals')}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesScreen
            favoriteServiceNos={favoriteServiceNos}
            stops={stops}
            onSelectBus={handleSelectBus}
            onSelectStop={handleSelectStop}
            onToggleBookmark={handleToggleBookmark}
            onSwitchToArrivals={() => setActiveTab('arrivals')}
          />
        )}

        {activeTab === 'alerts' && <AlertsScreen />}
      </main>

      {/* Modals & Drawers */}
      {isRouteModalOpen && (
        <RouteDetailsModal
          bus={selectedBus}
          onClose={() => setIsRouteModalOpen(false)}
          onSelectStop={(code) => {
            handleSelectStop(code);
            setIsRouteModalOpen(false);
          }}
        />
      )}

      {isWalkingModalOpen && (
        <WalkingDirectionsModal
          stopName={currentStop.name}
          stopCode={currentStop.code}
          distanceMeters={currentStop.distanceMeters}
          onClose={() => setIsWalkingModalOpen(false)}
        />
      )}

      {isProfileModalOpen && (
        <ProfileModal
          refreshInterval={refreshInterval}
          onRefreshIntervalChange={(sec) => setRefreshInterval(sec)}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {isLocationModalOpen && (
        <LocationPickerModal
          currentLocationName={currentLocationName}
          onClose={() => setIsLocationModalOpen(false)}
          onSelectLocation={(name, code) => {
            setCurrentLocationName(name);
            handleSelectStop(code);
          }}
          onUseCurrentGPS={handleUseCurrentGPS}
        />
      )}

      {/* Bottom Tab Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        favoritesCount={favoriteServiceNos.length}
        alertsCount={SERVICE_ALERTS.length}
      />
    </div>
  );
}
