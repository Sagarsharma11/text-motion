"use client";

import React from "react";
import { feature } from "topojson-client";

interface Props {
    countries: string[];
    selectedCountry: string;
    onSelectCountry: (country: string) => void;
}

const CountrySelector: React.FC<Props> = ({
    countries,
    selectedCountry,
    onSelectCountry,
}) => {


    return (
        <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
            <select
                value={selectedCountry}
                onChange={(e) => onSelectCountry(e.target.value)}
                style={{ padding: "8px", fontSize: "16px" }}
            >
                <option value="">-- Select Country --</option>
                {countries.map((name) => (
                    <option key={name} value={name}>
                        {name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CountrySelector;
