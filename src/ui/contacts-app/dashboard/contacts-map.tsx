"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useMemo, useState } from "react";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl";
import Pin from "./pin";
import { Contact } from "@/src/types";

export type ContactsMapProps = {
  mapToken: string;
  contacts: Contact[];
};

export const ContactsMap = ({ mapToken, contacts }: ContactsMapProps) => {
  const [popupInfo, setPopupInfo] = useState<Contact | null>(null);

  const pins = useMemo(
    () =>
      contacts.map((contact, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={contact.longitude}
          latitude={contact.latitude}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setPopupInfo(contact);
          }}
        >
          <Pin name={contact.name} />
        </Marker>
      )),
    [contacts]
  );

  return (
    <>
      <Map
        initialViewState={{
          latitude: 40,
          longitude: -100,
          zoom: 3.5,
          bearing: 0,
          pitch: 0,
        }}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={mapToken}
      >
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />

        {pins}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={Number(popupInfo.longitude)}
            latitude={Number(popupInfo.latitude)}
            onClose={() => setPopupInfo(null)}
          >
            <div>{popupInfo.name}</div>
          </Popup>
        )}
      </Map>
    </>
  );
};
