/**
 * @file CrimesByDistrictChart.js
 * @description Componente de gráfico de barras horizontales animado para visualizar delitos por distrito.
 * Utiliza D3.js para la lógica de escalado y animaciones de física (efecto empuje y crecimiento).
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import * as d3 from 'd3';
import Card from '../../components/ui/Card';
import { theme } from '../../theme';

const systemFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

// Configuración de físicas y transiciones
const TRANSITION_MS = 380;
const EASE = d3.easeCubicInOut;
const PUSH_PX = 14;
const GROW_PX = 14;

/**
 * Componente CrimesByDistrictChart
 * @param {Array} data - Lista de objetos { name: string, value: number, color: string }
 */
export const CrimesByDistrictChart = ({ data }) => {
    const [hoveredId, setHoveredId] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Estado para medir el ancho responsivo del contenedor
    const [dimensions, setDimensions] = useState({ width: 0, height: 320 });
    const svgRef = useRef(null);

    // Preparación de datos ordenados por valor descendente
    const chartData = useMemo(() => {
        return [...data]
            .sort((a, b) => b.value - a.value)
            .map(d => ({ ...d, id: d.name }));
    }, [data]);

    // Definición de márgenes y escalas D3
    const margin = { top: 20, right: 60, bottom: 20, left: 160 };
    const innerWidth = Math.max(0, dimensions.width - margin.left - margin.right);
    const innerHeight = Math.max(0, dimensions.height - margin.top - margin.bottom);

    const xScale = useMemo(() => {
        const maxVal = d3.max(chartData, d => d.value) || 1;
        return d3.scaleLinear().domain([0, maxVal]).range([0, innerWidth]);
    }, [chartData, innerWidth]);

    const yScale = useMemo(() => {
        return d3.scaleBand()
            .domain(chartData.map(d => d.id))
            .range([0, innerHeight])
            .padding(0.3);
    }, [chartData, innerHeight]);

    // Efecto de animación controlado por D3 cuando cambia el hover o los datos
    useEffect(() => {
        if (!svgRef.current || dimensions.width === 0) return;

        const svg = d3.select(svgRef.current);
        const hoveredIndex = chartData.findIndex(d => d.id === hoveredId);
        const isAny = hoveredId !== null;

        svg.selectAll('.bar-group').each(function (d, i) {
            const g = d3.select(this);
            const isHovered = i === hoveredIndex;

            // --- A. Traslación del grupo completo (Efecto empuje) ---
            let translateY = 0;
            if (isAny && !isHovered) {
                translateY = i < hoveredIndex ? -PUSH_PX : PUSH_PX;
            }

            g.transition()
                .duration(TRANSITION_MS)
                .ease(EASE)
                .attr('transform', `translate(${margin.left}, ${margin.top + translateY})`);

            // --- B. Animación de la barra (Crecimiento y opacidad) ---
            const rect = g.select('.bar-rect');
            const origY = +rect.attr('data-orig-y');
            const origH = +rect.attr('data-orig-h');

            rect.transition()
                .duration(TRANSITION_MS)
                .ease(EASE)
                .attr('y', isHovered ? origY - GROW_PX / 2 : origY)
                .attr('height', isHovered ? origH + GROW_PX : origH)
                .attr('opacity', isAny && !isHovered ? 0.25 : 1)
                .style('filter', isHovered ? 'brightness(1.15)' : 'none');

            // --- C. Animación de las etiquetas y valores ---
            g.select('.bar-label').transition()
                .duration(TRANSITION_MS)
                .ease(EASE)
                .attr('font-size', isHovered ? 14 : 12)
                .attr('font-weight', isHovered ? 700 : 400)
                .attr('fill', isHovered ? '#FFFFFF' : (isAny ? '#444' : '#888'))
                .attr('opacity', isAny && !isHovered ? 0.3 : 1);

            g.select('.bar-value').transition()
                .duration(TRANSITION_MS)
                .ease(EASE)
                .attr('font-size', isHovered ? 18 : 14)
                .attr('font-weight', isHovered ? 700 : 500)
                .attr('fill', isHovered ? '#FFFFFF' : (isAny ? '#444' : '#888'))
                .attr('opacity', isAny && !isHovered ? 0.4 : 1);
        });
    }, [hoveredId, chartData, dimensions]);

    return (
        <Card title="Número de delitos por distrito">
            <View
                style={styles.chartContainer}
                onLayout={(e) => setDimensions({ width: e.nativeEvent.layout.width, height: 320 })}
            >
                {
                    dimensions.width > 0 && (
                        <svg
                            ref={svgRef}
                            width="100%"
                            height="100%"
                            onPointerMove={(e) => {
                                const bounds = e.currentTarget.getBoundingClientRect();
                                setMousePos({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
                            }}
                        >
                            {chartData.map((d, i) => {
                                const y = yScale(d.id);
                                const w = xScale(d.value);
                                const h = yScale.bandwidth();
                                const midY = y + h / 2;

                                return (
                                    <g
                                        key={d.id}
                                        className="bar-group"
                                        transform={`translate(${margin.left}, ${margin.top})`}
                                    >
                                        {/* Etiqueta del distrito */}
                                        <text
                                            className="bar-label"
                                            x={-30}
                                            y={midY}
                                            textAnchor="end"
                                            dominantBaseline="central"
                                            style={{ fontFamily: systemFont, pointerEvents: 'none' }}
                                            fontSize={12}
                                            fill="#888"
                                        >
                                            {d.id}
                                        </text>

                                        {/* Rectángulo de la barra */}
                                        <rect
                                            className="bar-rect"
                                            x={0}
                                            y={y}
                                            width={w}
                                            height={h}
                                            data-orig-y={y}
                                            data-orig-h={h}
                                            fill={d.color}
                                            rx={theme.radii.xs}
                                            style={{ cursor: 'pointer' }}
                                        />

                                        {/* Valor cuantitativo */}
                                        <text
                                            className="bar-value"
                                            x={w + 15}
                                            y={midY}
                                            textAnchor="start"
                                            dominantBaseline="central"
                                            style={{ fontFamily: systemFont, pointerEvents: 'none' }}
                                            fontSize={14}
                                            fontWeight={500}
                                            fill="#888"
                                        >
                                            {d.value}
                                        </text>

                                        {/* Área de captura de eventos invisible */}
                                        <rect
                                            x={-100}
                                            y={y - 10}
                                            width={w + 150}
                                            height={h + 20}
                                            fill="transparent"
                                            onMouseEnter={() => setHoveredId(d.id)}
                                            onMouseLeave={() => setHoveredId(null)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </g>
                                );
                            })}
                        </svg>
                    )
                }
            </View >
        </Card >
    );
};

const styles = StyleSheet.create({
    chartContainer: {
        height: 320,
        width: '100%',
        marginTop: theme.spacing.xs,
        position: 'relative'
    },
});