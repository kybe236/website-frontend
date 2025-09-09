import "./MCDimensions.css";
import { useState } from "react";

type Dimension = "overworld" | "nether";
type Coords = { x: number; z: number };

function MCDimensions() {
    const [x, setX] = useState<string>("0");
    const [z, setZ] = useState<string>("0")
    const [dimension, setDimension] = useState<Dimension>("overworld");

    const dimensions: Dimension[] = ["overworld", "nether"];

    const parseCoord = (value: string): number => (value === "" ? 0 : Number(value));

    const convertCoords = (target: Dimension): Coords => {
        const numX = parseCoord(x);
        const numZ = parseCoord(z);

        if (dimension === target) return { x: numX, z: numZ };

        return dimension === "overworld"
            ? { x: numX / 8, z: numZ / 8 }
            : { x: numX * 8, z: numZ * 8 };
    };

    const getDistance = ({ x, z }: Coords): string =>
        Math.sqrt(x ** 2 + z ** 2).toFixed(2);

    const formatCoord = (num: number) => Number(num.toFixed(2));

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    const copyToClipboard = (coords: Coords) => {
        const text = `X: ${formatCoord(coords.x)}, Z: ${formatCoord(coords.z)}`;
        navigator.clipboard.writeText(text)
            .then(() => alert(`Copied: ${text}`))
            .catch(err => console.error("Failed to copy: ", err));
    };

    return (
        <div className="main-container">
            <h1>MCDimensions</h1>

            <div className="coordinates-container">
                <div className="coordinates-input">
                    <p>X:</p>
                    <input
                        type="number"
                        value={x}
                        onChange={(e) => setX(e.target.value)}
                        placeholder="X"
                    />
                </div>

                <div className="coordinates-input">
                    <p>Z:</p>
                    <input
                        type="number"
                        value={z}
                        onChange={(e) => setZ(e.target.value)}
                        placeholder="Z"
                    />
                </div>

                <div className="dimension-container">
                    <p>Dimension:</p>
                    <select
                        value={dimension}
                        onChange={(e) => setDimension(e.target.value as Dimension)}
                    >
                        <option value="overworld">Overworld</option>
                        <option value="nether">Nether</option>
                    </select>
                </div>
            </div>

            <hr className="separator" />

            <div className="results">
                <h2>Coordinates & Distance:</h2>
                <div className="results-grid">
                    {dimensions.map((dim) => {
                        const coords = convertCoords(dim);
                        return (
                            <div
                                key={dim}
                                className="result-card"
                                onClick={() => copyToClipboard(coords)}
                                style={{ cursor: "pointer" }}
                                title="Click to copy coordinates"
                            >
                                <strong>{capitalize(dim)}</strong>
                                <p>X: {formatCoord(coords.x)}</p>
                                <p>Z: {formatCoord(coords.z)}</p>
                                <p>Distance: {getDistance(coords)}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default MCDimensions;