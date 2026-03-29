/**
 * PulseMap — ArcGIS Maps SDK 5 component for PulsePath
 *
 * Renders an interactive Seattle map with neighborhood markers
 * colored by computed resilience score.
 *
 * PROTOTYPE: Uses mock neighborhood data only.
 */
import { useEffect, useRef, useCallback } from "react";
import "@arcgis/core/assets/esri/themes/dark/main.css";
import esriConfig from "@arcgis/core/config";
import ArcGISMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import TextSymbol from "@arcgis/core/symbols/TextSymbol";
import { Neighborhood } from "@/types";

// Use local assets copied by vite-plugin-static-copy during dev/build
esriConfig.assetsPath = "/arcgis/assets";

interface PulseMapProps {
  neighborhoods: (Neighborhood & { resilienceScore: number })[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  favorites: string[];
}

function scoreToColor(score: number): [number, number, number] {
  if (score >= 70) return [34, 197, 94];   // green-500
  if (score >= 45) return [234, 179, 8];   // yellow-500
  return [239, 68, 68];                     // red-500
}

function scoreToOutline(score: number, selected: boolean, favorited: boolean): [number, number, number] {
  if (selected) return [99, 102, 241];  // indigo-500
  if (favorited) return [236, 72, 153]; // pink-500
  if (score >= 70) return [21, 128, 61];
  if (score >= 45) return [161, 98, 7];
  return [185, 28, 28];
}

export default function PulseMap({ neighborhoods, selectedId, onSelect, favorites }: PulseMapProps) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<MapView | null>(null);
  const layerRef = useRef<GraphicsLayer | null>(null);

  // Build graphics for each neighborhood
  const buildGraphics = useCallback(
    (hoods: (Neighborhood & { resilienceScore: number })[], selId: string | null, favs: string[]) => {
      return hoods.flatMap((n) => {
        if (!n.lat || !n.lng) return [];

        const isSelected = n.id === selId;
        const isFav = favs.includes(n.id);
        const [r, g, b] = scoreToColor(n.resilienceScore);
        const [or, og, ob] = scoreToOutline(n.resilienceScore, isSelected, isFav);

        const point = new Point({ longitude: n.lng, latitude: n.lat, spatialReference: { wkid: 4326 } });

        const markerGraphic = new Graphic({
          geometry: point,
          symbol: new SimpleMarkerSymbol({
            style: "circle",
            color: [r, g, b, isSelected ? 1 : 0.82],
            size: isSelected ? 20 : 14,
            outline: {
              color: [or, og, ob],
              width: isSelected ? 3 : 1.5,
            },
          }),
          attributes: { id: n.id, name: n.name, score: n.resilienceScore },
          popupTemplate: {
            title: "{name}",
            content: `<b>Resilience Score:</b> {score}/100`,
          },
        });

        const labelGraphic = new Graphic({
          geometry: new Point({ longitude: n.lng, latitude: n.lat + 0.006, spatialReference: { wkid: 4326 } }),
          symbol: new TextSymbol({
            text: `${n.name}\n${n.resilienceScore}`,
            color: [240, 240, 255],
            haloColor: [20, 20, 40, 0.8],
            haloSize: 2,
            font: { size: isSelected ? 12 : 10, weight: isSelected ? "bold" : "normal" },
          }),
          attributes: { id: n.id, type: "label" },
        });

        return [markerGraphic, labelGraphic];
      });
    },
    []
  );

  // Initialize the map once
  useEffect(() => {
    if (!mapDivRef.current || viewRef.current) return;

    const graphicsLayer = new GraphicsLayer({ id: "pulse-neighborhoods" });
    layerRef.current = graphicsLayer;

    const map = new ArcGISMap({
      basemap: "streets-navigation-vector",
      layers: [graphicsLayer],
    });

    const view = new MapView({
      container: mapDivRef.current,
      map,
      center: [-122.335, 47.63],
      zoom: 11.5,
      ui: { components: ["zoom", "compass"] },
      popup: {
        defaultPopupTemplateEnabled: false,
        dockEnabled: false,
      },
    });

    viewRef.current = view;

    // Add click handler
    view.on("click", (event) => {
      view.hitTest(event).then((result) => {
        const hit = result.results.find(
          (r) => r.type === "graphic" && r.graphic?.attributes?.id && r.graphic?.attributes?.type !== "label"
        );
        if (hit && hit.type === "graphic") {
          onSelect(hit.graphic.attributes.id);
        }
      });
    });

    // Change cursor on hover
    view.on("pointer-move", (event) => {
      view.hitTest(event).then((result) => {
        const hit = result.results.find(
          (r) => r.type === "graphic" && r.graphic?.attributes?.id && r.graphic?.attributes?.type !== "label"
        );
        (view.container as HTMLElement).style.cursor = hit ? "pointer" : "default";
      });
    });

    return () => {
      view.destroy();
      viewRef.current = null;
      layerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync graphics whenever neighborhoods or selection changes
  useEffect(() => {
    if (!layerRef.current) return;
    layerRef.current.removeAll();
    layerRef.current.addMany(buildGraphics(neighborhoods, selectedId, favorites));
  }, [neighborhoods, selectedId, favorites, buildGraphics]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-border shadow-lg" style={{ height: 480 }}>
      <div ref={mapDivRef} style={{ width: "100%", height: "100%" }} />
      <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-white/80 pointer-events-none">
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" /> 70+
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-500 ml-1" /> 45–69
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 ml-1" /> &lt;45
        <span className="ml-2 text-white/40">| Score</span>
      </div>
    </div>
  );
}
