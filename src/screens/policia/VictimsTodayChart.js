/**
 * @file VictimsTodayChart.js
 * @description Componente de gráfico de tarta (pie chart) animado para visualizar víctimas por categoría.
 * Utiliza D3.js para el cálculo de arcos y transiciones de expansión al pasar el cursor.
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as d3 from 'd3';
import Card from '../../components/ui/Card';
import { theme } from '../../theme';

const systemFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

// Configuración de físicas para las transiciones de los arcos
const TRANSITION_MS = 350;
const EASE = d3.easeCubicOut;

/**
 * Componente VictimsTodayChart
 * @param {Array} data - Lista de objetos { name: string, value: number, color: string }
 * @param {React.ReactNode} right - Elemento opcional para mostrar en la parte derecha de la cabecera del Card
 */
export const VictimsTodayChart = ({ data, right }) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 200 });
    const [hoveredId, setHoveredId] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const svgRef = useRef(null);

    // Cálculos de radio y márgenes
    const margin = 12;
    const radius = Math.max(0, Math.min(dimensions.width, dimensions.height) / 2 - margin);

    // Generador de datos de tarta D3
    const pieData = useMemo(() => {
        const pieGenerator = d3.pie()
            .value(d => d.value)
            .sort(null)
            .padAngle(0.015);
        return pieGenerator(data);
    }, [data]);

    // Generadores de arcos (normal y expandido para hover)
    const arcGenerator = useMemo(() => {
        return d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
            .cornerRadius(3);
    }, [radius]);

    const arcHover = useMemo(() => {
        return d3.arc()
            .innerRadius(0)
            .outerRadius(radius + 8)
            .cornerRadius(3);
    }, [radius]);

    // Efecto de animación D3 para suavizar la expansión de los arcos
    useEffect(() => {
        if (!svgRef.current || dimensions.width === 0) return;

        const svg = d3.select(svgRef.current);

        svg.selectAll('.arc-path')
            .data(pieData)
            .transition()
            .duration(TRANSITION_MS)
            .ease(EASE)
            .attr('d', d => (hoveredId === d.data.name ? arcHover(d) : arcGenerator(d)))
            .attr('opacity', d => (hoveredId && hoveredId !== d.data.name ? 0.3 : 1));

    }, [hoveredId, pieData, arcGenerator, arcHover, dimensions.width]);

    return (
        <Card title="Número de víctimas" right={right}>
            <View
                style={styles.pieContainer}
                onLayout={(e) => setDimensions({ width: e.nativeEvent.layout.width, height: 200 })}
            >
                {/* Tooltip personalizado para la vista web */}
                {hoveredId && (
                    <div style={{
                        position: 'absolute',
                        top: mousePos.y - 50,
                        left: mousePos.x,
                        transform: 'translateX(-50%)',
                        background: theme.colors.cardBackground,
                        color: theme.colors.cardText,
                        padding: '8px 14px',
                        borderRadius: theme.radii.md,
                        fontSize: '13px',
                        fontFamily: systemFont,
                        border: `1px solid ${theme.colors.cardBorder}`,
                        boxShadow: '0 5px 15px rgba(0,0,0,0.4)',
                        pointerEvents: 'none',
                        zIndex: 100,
                        transition: 'opacity 0.15s ease-out'
                    }}>
                        <strong>{hoveredId}</strong>
                        <div style={{ color: theme.colors.cardTextSecondary, marginTop: 3 }}>
                            Víctimas: {data.find(d => d.name === hoveredId)?.value}
                        </div>
                    </div>
                )}

                <View style={{ height: 200, alignItems: 'center', justifyContent: 'center' }}>
                    {dimensions.width > 0 && (
                        <svg
                            ref={svgRef}
                            width={dimensions.width}
                            height={200}
                            style={{ overflow: 'visible' }}
                            onPointerMove={(e) => {
                                const bounds = e.currentTarget.getBoundingClientRect();
                                setMousePos({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
                            }}
                        >
                            <g transform={`translate(${dimensions.width / 2}, 100)`}>
                                {pieData.map((d) => (
                                    <path
                                        key={d.data.name}
                                        className="arc-path"
                                        d={arcGenerator(d)}
                                        fill={d.data.color}
                                        stroke={theme.colors.cardBackground}
                                        strokeWidth="1"
                                        style={{
                                            cursor: 'pointer',
                                            filter: hoveredId === d.data.name ? 'drop-shadow(0px 2px 6px rgba(0,0,0,0.5))' : 'none',
                                            transition: 'filter 0.3s ease'
                                        }}
                                        onMouseEnter={() => setHoveredId(d.data.name)}
                                        onMouseLeave={() => setHoveredId(null)}
                                    />
                                ))}
                            </g>
                        </svg>
                    )}
                </View>

                {/* Leyenda personalizada debajo del gráfico */}
                <View style={styles.legendContainer}>
                    {data.map((item, index) => (
                        <View key={index} style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                            <Text style={styles.legendText}>{item.name}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    pieContainer: {
        marginTop: theme.spacing.sm,
        position: 'relative',
        minHeight: 280
    },
    legendContainer: {
        marginTop: theme.spacing.lg,
        paddingHorizontal: theme.spacing.sm
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6
    },
    legendColor: {
        width: 12,
        height: 12,
        marginRight: 8,
        borderRadius: 2
    },
    legendText: {
        color: theme.colors.cardTextSecondary,
        fontSize: 12,
        fontFamily: systemFont
    },
});