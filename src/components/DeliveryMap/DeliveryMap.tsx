'use client';

import type { GeoJSONSource, MapOptions } from 'maplibre-gl';
import clsx from 'clsx';
import { LngLatBounds, Map as MapLibreMap, Marker, setWorkerUrl } from 'maplibre-gl';
// MapLibre builds its worker URL at runtime, which bundlers cannot follow; the app's Vite serves it as an asset.
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import { useEffect, useRef, useState } from 'react';

import { useStrings } from '../strings';
import styles from './DeliveryMap.module.scss';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface MapPoint {
    latitude: number;
    longitude: number;
}

export interface DeliveryMapProps {
    /** Accessible name of the map region. */
    label: string;
    /** The restaurant. */
    pickup?: MapPoint;
    /** Where nothing is delivered to. */
    dropOff?: MapPoint | null;
    /** Where the courier is now; moves smoothly between updates. */
    courier?: MapPoint | null;
    /** The courier's ride to the restaurant and then to the customer. */
    approachRoute?: MapPoint[];
    deliveryRoute?: MapPoint[];
    /** Makes the map a picker: a click sets the drop-off. */
    onPick?: (point: MapPoint) => void;
    /** A style URL or object; OpenFreeMap's free OSM tiles by default (no key). */
    mapStyle?: MapOptions['style'];
    className?: string;
}

setWorkerUrl(workerUrl);

const OPENFREEMAP = 'https://tiles.openfreemap.org/styles/liberty';
const HAMBURG: [number, number] = [9.9937, 53.5511];

const lngLat = (point: MapPoint): [number, number] => [point.longitude, point.latitude];

/** Positions arrive every two seconds; gliding between them looks like riding, not teleporting. */
const GLIDE_MS = 1900;

function glide(marker: Marker, to: MapPoint) {
    const from = marker.getLngLat();
    const start = performance.now();
    const step = (now: number) => {
        const t = Math.min(1, (now - start) / GLIDE_MS);
        marker.setLngLat([from.lng + (to.longitude - from.lng) * t, from.lat + (to.latitude - from.lat) * t]);
        if (t < 1)
            requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

function markerElement(kind: 'pickup' | 'dropOff' | 'courier', label: string) {
    const element = document.createElement('div');
    element.className = clsx(styles.marker, styles[kind]);
    element.setAttribute('role', 'img');
    element.setAttribute('aria-label', label);
    element.textContent = kind === 'pickup'
        ? '🍽️'
        : kind === 'dropOff'
            ? '🏠'
            : '🛵';
    return element;
}

/**
 * A MapLibre map with the restaurant, the drop-off, the courier and their routes. Presentational:
 * the app passes positions (from the tracking API and the live stream) and gets picks back.
 * The map only follows the points once (fit to bounds); after that the customer may pan freely.
 */
function DeliveryMap({ label, pickup, dropOff, courier, approachRoute, deliveryRoute, onPick, mapStyle = OPENFREEMAP, className }: DeliveryMapProps) {
    const strings = useStrings();
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MapLibreMap | null>(null);
    const markersRef = useRef<Partial<Record<'pickup' | 'dropOff' | 'courier', Marker>>>({});
    const fittedRef = useRef(false);
    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);
    const pickRef = useRef(onPick);
    pickRef.current = onPick;
    // Where the map starts; later pickups (none in practice) do not move it.
    const startRef = useRef(pickup);

    useEffect(() => {
        if (!containerRef.current)
            return;
        let instance: MapLibreMap;
        try {
            instance = new MapLibreMap({
                container: containerRef.current,
                style: mapStyle,
                center: startRef.current
                    ? lngLat(startRef.current)
                    : HAMBURG,
                zoom: 13,
                attributionControl: { compact: true },
            });
        }
        catch {
            // No WebGL2 (old browser, locked-down device): the page works without the map.
            setFailed(true);
            return;
        }
        instance.on('click', (event) => {
            pickRef.current?.({ latitude: event.lngLat.lat, longitude: event.lngLat.lng });
        });
        instance.on('load', () => {
            for (const id of ['approach', 'delivery']) {
                instance.addSource(id, {
                    type: 'geojson',
                    data: { type: 'FeatureCollection', features: [] },
                });
                instance.addLayer({
                    id,
                    type: 'line',
                    source: id,
                    layout: { 'line-cap': 'round', 'line-join': 'round' },
                    paint: {
                        'line-color': id === 'approach'
                            ? '#a8a29e'
                            : '#ea580c',
                        'line-width': 4,
                        'line-dasharray': id === 'approach'
                            ? [1, 2]
                            : [1, 0],
                    },
                });
            }
            setLoaded(true);
        });
        mapRef.current = instance;
        return () => {
            instance.remove();
            mapRef.current = null;
            markersRef.current = {};
            fittedRef.current = false;
            setLoaded(false);
        };
    }, [mapStyle]);

    // Markers: created on first sight, moved after that (the courier glides between positions).
    useEffect(() => {
        const instance = mapRef.current;
        if (!instance)
            return;
        const points = { pickup, dropOff, courier };
        for (const kind of ['pickup', 'dropOff', 'courier'] as const) {
            const point = points[kind];
            const existing = markersRef.current[kind];
            if (!point) {
                existing?.remove();
                delete markersRef.current[kind];
                continue;
            }
            if (existing && kind === 'courier') {
                glide(existing, point);
            }
            else if (existing) {
                existing.setLngLat(lngLat(point));
            }
            else {
                markersRef.current[kind] = new Marker({
                    element: markerElement(kind, strings.format(`map.${kind}`)),
                })
                    .setLngLat(lngLat(point))
                    .addTo(instance);
            }
        }
        const all = [pickup, dropOff, courier].filter((point): point is MapPoint => Boolean(point));
        if (!fittedRef.current && all.length >= 2) {
            const bounds = new LngLatBounds();
            all.forEach(point => bounds.extend(lngLat(point)));
            instance.fitBounds(bounds, { padding: 56, maxZoom: 15, duration: 0 });
            fittedRef.current = true;
        }
    }, [pickup, dropOff, courier, strings]);

    // Routes go into the sources once the style has loaded.
    useEffect(() => {
        const instance = mapRef.current;
        if (!instance || !loaded)
            return;
        const routes = { approach: approachRoute, delivery: deliveryRoute };
        for (const [id, points] of Object.entries(routes)) {
            const source = instance.getSource<GeoJSONSource>(id);
            source?.setData({
                type: 'FeatureCollection',
                features: points && points.length > 1
                    ? [
                            {
                                type: 'Feature',
                                properties: {},
                                geometry: {
                                    type: 'LineString',
                                    coordinates: points.map(lngLat),
                                },
                            },
                        ]
                    : [],
            });
        }
    }, [approachRoute, deliveryRoute, loaded]);

    if (failed)
        return <p role="note" className={clsx(styles.unavailable, className)}>{strings.format('map.unavailable')}</p>;

    return (
        <div
            ref={containerRef}
            role="region"
            aria-label={label}
            className={clsx(styles.map, onPick && styles.picker, className)}
            data-testid="delivery-map"
        />
    );
}
DeliveryMap.displayName = 'DeliveryMap';

export { DeliveryMap };
