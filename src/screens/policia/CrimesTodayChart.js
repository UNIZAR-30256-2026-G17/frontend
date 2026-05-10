import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import * as d3 from 'd3';
import Card from '../../components/ui/Card';
import { theme } from '../../theme';

const systemFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export const CrimesTodayChart = ({ data }) => {
    // Estado para responsividad y tooltips interactivos
    const [dimensions, setDimensions] = useState({ width: 0, height: 250 });
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // 1. Escalas matemáticas de D3
    const margin = { top: 20, right: 20, bottom: 50, left: 30 };
    const innerWidth = Math.max(0, dimensions.width - margin.left - margin.right);
    const innerHeight = Math.max(0, dimensions.height - margin.top - margin.bottom);

    const xScale = useMemo(() => {
        return d3.scalePoint()
            .domain(data.map(d => d.time))
            .range([0, innerWidth])
            .padding(0.5); // Da un poco de respiro a los bordes
    }, [data, innerWidth]);

    const yScale = useMemo(() => {
        const maxVal = d3.max(data, d => d.value) || 10;
        return d3.scaleLinear()
            .domain([0, maxVal])
            .range([innerHeight, 0])
            .nice(5); // Redondea los ejes a números agradables
    }, [data, innerHeight]);

    // 2. Generador de la curva (equivalente al curve="monotoneX" de Nivo)
    const lineGenerator = useMemo(() => {
        return d3.line()
            .x(d => xScale(d.time))
            .y(d => yScale(d.value))
            .curve(d3.curveMonotoneX);
    }, [xScale, yScale]);

    const yTicks = yScale.ticks(5);

    // 3. Lógica para encontrar el punto más cercano al ratón (Magnetismo)
    const handlePointerMove = (e) => {
        const bounds = e.currentTarget.getBoundingClientRect();
        // Coordenada X relativa al área de dibujo interno
        const pointerX = e.clientX - bounds.left - margin.left;
        
        // Guardamos la posición exacta para el tooltip
        setMousePos({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });

        // Encontrar el punto de datos más cercano a la X del ratón
        let closest = data[0];
        let minDiff = Infinity;
        data.forEach(d => {
            const px = xScale(d.time);
            const diff = Math.abs(px - pointerX);
            if (diff < minDiff) {
                minDiff = diff;
                closest = d;
            }
        });
        setHoveredPoint(closest);
    };

    return (
        <Card title="Delitos de ayer">
            <View 
                style={styles.chartContainer}
                onLayout={(e) => setDimensions({ width: e.nativeEvent.layout.width, height: 250 })}
            >
                {/* TOOLTIP FLOTANTE */}
                {hoveredPoint && (
                    <div style={{
                        position: 'absolute',
                        top: mousePos.y - 60,
                        left: mousePos.x,
                        transform: 'translateX(-50%)',
                        background: theme.colors?.cardBackground || '#1a1a1a',
                        border: `1px solid ${theme.colors?.cardBorder || '#333'}`,
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontFamily: systemFont,
                        fontSize: '12px',
                        boxShadow: '0px 4px 10px rgba(0,0,0,0.5)',
                        pointerEvents: 'none',
                        zIndex: 10,
                        transition: 'top 0.1s ease-out, left 0.1s ease-out', // Suaviza el seguimiento
                    }}>
                        <div style={{ color: theme.colors?.cardTextSecondary || '#888', fontWeight: 'bold', marginBottom: 4 }}>
                            {hoveredPoint.time}
                        </div>
                        <div style={{ color: theme.colors?.cardText || '#fff' }}>
                            Delitos: <strong>{hoveredPoint.value}</strong>
                        </div>
                    </div>
                )}

                {dimensions.width > 0 && (
                    <svg 
                        width="100%" 
                        height="100%"
                        onPointerMove={handlePointerMove}
                        onPointerLeave={() => setHoveredPoint(null)}
                    >
                        <g transform={`translate(${margin.left}, ${margin.top})`}>
                            
                            {/* --- GRID Y --- */}
                            {yTicks.map(tick => (
                                <g key={`grid-${tick}`} transform={`translate(0, ${yScale(tick)})`}>
                                    <line 
                                        x1={0} 
                                        x2={innerWidth} 
                                        stroke={theme.colors?.tableBorder || '#333'} 
                                        strokeDasharray="3 3" 
                                    />
                                    <text
                                        x={-10}
                                        y={0}
                                        textAnchor="end"
                                        dominantBaseline="central"
                                        fontSize={10}
                                        fontFamily={systemFont}
                                        fill={theme.colors?.cardTextSecondary || '#888'}
                                    >
                                        {tick}
                                    </text>
                                </g>
                            ))}

                            {/* --- EJE X (Textos rotados -90deg) --- */}
                            {data.map((d, i) => (
                                <g key={`x-${i}`} transform={`translate(${xScale(d.time)}, ${innerHeight + 15})`}>
                                    <text
                                        transform="rotate(-90)"
                                        textAnchor="end"
                                        dominantBaseline="central"
                                        fontSize={10}
                                        fontFamily={systemFont}
                                        fill={theme.colors?.cardTextSecondary || '#888'}
                                    >
                                        {d.time}
                                    </text>
                                </g>
                            ))}

                            {/* --- LÍNEA PRINCIPAL --- */}
                            <path
                                d={lineGenerator(data)}
                                fill="none"
                                stroke={theme.colors?.warning || '#ffb74d'}
                                strokeWidth={3}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                // Sombra sutil en la propia línea
                                style={{ filter: 'drop-shadow(0px 2px 4px rgba(255, 183, 77, 0.3))' }} 
                            />

                            {/* --- INTERACCIÓN DE HOVER (Crosshair) --- */}
                            {hoveredPoint && (
                                <g>
                                    {/* Línea vertical guía */}
                                    <line
                                        x1={xScale(hoveredPoint.time)}
                                        x2={xScale(hoveredPoint.time)}
                                        y1={0}
                                        y2={innerHeight}
                                        stroke={theme.colors?.cardTextSecondary || '#888'}
                                        strokeWidth={1}
                                        strokeDasharray="4 4"
                                        opacity={0.5}
                                    />
                                    
                                    {/* Punto base oscuro */}
                                    <circle
                                        cx={xScale(hoveredPoint.time)}
                                        cy={yScale(hoveredPoint.value)}
                                        r={6}
                                        fill={theme.colors?.cardBackground || '#1a1a1a'}
                                        stroke={theme.colors?.warning || '#ffb74d'}
                                        strokeWidth={2}
                                    />
                                    
                                    {/* Punto luminoso interno */}
                                    <circle
                                        cx={xScale(hoveredPoint.time)}
                                        cy={yScale(hoveredPoint.value)}
                                        r={3}
                                        fill={theme.colors?.warning || '#ffb74d'}
                                    />
                                </g>
                            )}
                            
                            {/* Capa invisible para atrapar eventos de ratón fácilmente */}
                            <rect 
                                width={innerWidth} 
                                height={innerHeight} 
                                fill="transparent" 
                            />
                        </g>
                    </svg>
                )}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    chartContainer: { height: 250, marginTop: 8, position: 'relative' },
});