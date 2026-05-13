/**
 * @file CrimesTodayChart.js
 * @description Componente de gráfico de línea interactivo para visualizar la evolución horaria de los delitos.
 * Implementa "magnetismo" en el puntero y un tooltip flotante personalizado con D3.js.
 */

import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import * as d3 from 'd3';
import Card from '../../components/ui/Card';
import { theme } from '../../theme';

const systemFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

/**
 * Componente CrimesTodayChart
 * @param {Array} data - Lista de objetos { time: string, value: number }
 */
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
            .padding(0.5);
    }, [data, innerWidth]);

    const yScale = useMemo(() => {
        const maxVal = d3.max(data, d => d.value) || 10;
        return d3.scaleLinear()
            .domain([0, maxVal])
            .range([innerHeight, 0])
            .nice(5);
    }, [data, innerHeight]);

    // 2. Generador de la curva suave (monotoneX)
    const lineGenerator = useMemo(() => {
        return d3.line()
            .x(d => xScale(d.time))
            .y(d => yScale(d.value))
            .curve(d3.curveMonotoneX);
    }, [xScale, yScale]);

    const yTicks = yScale.ticks(5);

    /**
     * Lógica para encontrar el punto más cercano al ratón (Magnetismo)
     */
    const handlePointerMove = (e) => {
        const bounds = e.currentTarget.getBoundingClientRect();
        const pointerX = e.clientX - bounds.left - margin.left;
        
        setMousePos({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });

        // Buscamos el punto con la menor distancia en el eje X
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
                {/* TOOLTIP FLOTANTE (HTML inyectado en Web) */}
                {hoveredPoint && (
                    <div style={{
                        position: 'absolute',
                        top: mousePos.y - 60,
                        left: mousePos.x,
                        transform: 'translateX(-50%)',
                        background: theme.colors.cardBackground,
                        border: `1px solid ${theme.colors.cardBorder}`,
                        borderRadius: theme.radii.md,
                        padding: '8px 12px',
                        fontFamily: systemFont,
                        fontSize: '12px',
                        boxShadow: '0px 4px 10px rgba(0,0,0,0.5)',
                        pointerEvents: 'none',
                        zIndex: 10,
                        transition: 'top 0.1s ease-out, left 0.1s ease-out',
                    }}>
                        <div style={{ color: theme.colors.cardTextSecondary, fontWeight: 'bold', marginBottom: 4 }}>
                            {hoveredPoint.time}
                        </div>
                        <div style={{ color: theme.colors.cardText }}>
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
                                        stroke={theme.colors.tableBorder} 
                                        strokeDasharray="3 3" 
                                    />
                                    <text
                                        x={-10}
                                        y={0}
                                        textAnchor="end"
                                        dominantBaseline="central"
                                        fontSize={10}
                                        fontFamily={systemFont}
                                        fill={theme.colors.cardTextSecondary}
                                    >
                                        {tick}
                                    </text>
                                </g>
                            ))}

                            {/* --- EJE X --- */}
                            {data.map((d, i) => (
                                <g key={`x-${i}`} transform={`translate(${xScale(d.time)}, ${innerHeight + 15})`}>
                                    <text
                                        transform="rotate(-90)"
                                        textAnchor="end"
                                        dominantBaseline="central"
                                        fontSize={10}
                                        fontFamily={systemFont}
                                        fill={theme.colors.cardTextSecondary}
                                    >
                                        {d.time}
                                    </text>
                                </g>
                            ))}

                            {/* --- LÍNEA DE DATOS --- */}
                            <path
                                d={lineGenerator(data)}
                                fill="none"
                                stroke={theme.colors.warning}
                                strokeWidth={3}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ filter: 'drop-shadow(0px 2px 4px rgba(255, 183, 77, 0.3))' }} 
                            />

                            {/* --- INDICADOR DE HOVER --- */}
                            {hoveredPoint && (
                                <g>
                                    <line
                                        x1={xScale(hoveredPoint.time)}
                                        x2={xScale(hoveredPoint.time)}
                                        y1={0}
                                        y2={innerHeight}
                                        stroke={theme.colors.cardTextSecondary}
                                        strokeWidth={1}
                                        strokeDasharray="4 4"
                                        opacity={0.5}
                                    />
                                    <circle
                                        cx={xScale(hoveredPoint.time)}
                                        cy={yScale(hoveredPoint.value)}
                                        r={6}
                                        fill={theme.colors.cardBackground}
                                        stroke={theme.colors.warning}
                                        strokeWidth={2}
                                    />
                                </g>
                            )}
                            
                            {/* Rectángulo invisible para capturar eventos de puntero */}
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
    chartContainer: { 
        height: 250, 
        marginTop: theme.spacing.sm, 
        position: 'relative' 
    },
});