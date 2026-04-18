import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import * as d3 from 'd3';
import Card from '../../components/ui/Card';
import Dropdown from '../../components/ui/Dropdown';

const systemFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

// Configuración de físicas
const TRANSITION_MS = 380;
const EASE = d3.easeCubicInOut;
const PUSH_PX = 14; 
const GROW_PX = 14; 

export const CrimesByDistrictChart = ({ data }) => {
    const [selectedMonth, setSelectedMonth] = useState({ label: 'Último mes', value: '1m' });
    const [hoveredId, setHoveredId] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    
    // Usamos el estado para medir el ancho responsivo del contenedor
    const [dimensions, setDimensions] = useState({ width: 0, height: 320 });
    const svgRef = useRef(null);

    // 1. Datos preparados y ordenados (Bethesda arriba)
    const chartData = useMemo(() => {
        return [...data]
            .sort((a, b) => b.value - a.value)
            .map(d => ({ ...d, id: d.name }));
    }, [data]);

    // 2. Escalas matemáticas de D3
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
            .padding(0.3); // Mantiene las barras gruesas
    }, [chartData, innerHeight]);

    // 3. Físicas y animaciones controladas 100% por D3
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

            // --- B. Animación de la barra (Crecimiento centralizado) ---
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

            // --- C. Animación de la etiqueta izquierda ---
            g.select('.bar-label').transition()
                .duration(TRANSITION_MS)
                .ease(EASE)
                .attr('font-size', isHovered ? 14 : 12)
                .attr('font-weight', isHovered ? 700 : 400)
                .attr('fill', isHovered ? '#FFFFFF' : (isAny ? '#444' : '#888'))
                .attr('opacity', isAny && !isHovered ? 0.3 : 1);

            // --- D. Animación del valor derecho ---
            g.select('.bar-value').transition()
                .duration(TRANSITION_MS)
                .ease(EASE)
                .attr('font-size', isHovered ? 18 : 14)
                .attr('font-weight', isHovered ? 700 : 500)
                .attr('fill', isHovered ? '#FFFFFF' : (isAny ? '#444' : '#888'))
                .attr('opacity', isAny && !isHovered ? 0.4 : 1);
        });
    }, [hoveredId, chartData, dimensions, margin.top, margin.left]);

    return (
        <Card
            title="Número de delitos por distrito"
            right={
                <View style={{ width: 140 }}>
                    <Dropdown
                        options={[{ label: 'Último mes', value: '1m' }, { label: 'Último año', value: '1y' }]}
                        selected={selectedMonth}
                        onSelect={setSelectedMonth}
                    />
                </View>
            }
        >
            <View 
                style={styles.chartContainer}
                // Capturamos el ancho real del contenedor para hacer el SVG responsivo
                onLayout={(e) => setDimensions({ width: e.nativeEvent.layout.width, height: 320 })}
            >
                

                {dimensions.width > 0 && (
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
                                    // Estado inicial del transform
                                    transform={`translate(${margin.left}, ${margin.top})`}
                                >
                                    {/* Etiqueta */}
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

                                    {/* Barra Base */}
                                    <rect
                                        className="bar-rect"
                                        x={0}
                                        y={y}
                                        width={w}
                                        height={h}
                                        // Guardamos los valores originales para que D3 sepa desde dónde interpolar
                                        data-orig-y={y}
                                        data-orig-h={h}
                                        fill={d.color}
                                        rx={4}
                                        style={{ cursor: 'pointer' }}
                                    />

                                    {/* Valor Numérico */}
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

                                    {/* Área de Hover invisible (más gruesa que la barra) para evitar "parpadeos" */}
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
                )}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    chartContainer: { height: 320, width: '100%', marginTop: 5, position: 'relative' },
});