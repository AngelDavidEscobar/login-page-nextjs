
"use client";

import { Download } from "lucide-react";
import { Persona } from "../../../types/api";

export default function ExcelDownloader({ personas }: { personas: Persona}) {
    
    const handleDownload = async () => {
        try {
            const response = await fetch("/api/generar-excel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: personas }),
            });

            if (!response.ok) {
                console.error("Error generando Excel");
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "personas.xlsx";
            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (error) {
            console.error("Error descargando Excel:", error);
        }
    };

    return (
        <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            <Download className="w-4 h-4" />
            <span>Descargar Excel </span>
        </button>
    );
}
