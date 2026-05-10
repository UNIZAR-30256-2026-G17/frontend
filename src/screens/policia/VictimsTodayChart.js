import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as d3 from 'd3';
import Card from '../../components/ui/Card';

const systemFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

// Configuración de físicas: Mucho más suave, sin rebotes extraños
const TRANSITION_MS = 350;
const EASE = d3.easeCubicOut; 

export const VictimsTodayChart = ({ data }) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 200 });
    const [hoveredId, setHoveredId] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const svgRef = useRef(null);

    // 1. Cálculos de D3 para la tarta
    const margin = 12; // Margen para la expansión del hover
    const radius = Math.max(0, Math.min(dimensions.width, dimensions.height) / 2 - margin);
    
    const pieData = useMemo(() => {
        const pieGenerator = d3.pie()
            .value(d => d.value)
            .sort(null)
            // Un padAngle menor hace que los trozos estén más juntos, viéndose más circular
            .padAngle(0.015); 
        return pieGenerator(data);
    }, [data]);

    const arcGenerator = useMemo(() => {
        return d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
            .cornerRadius(3); // Bordes redondeados sutiles para no deformar el círculo
    }, [radius]);

    const arcHover = useMemo(() => {
        return d3.arc()
            .innerRadius(0)
            .outerRadius(radius + 8) // Expansión limpia
            .cornerRadius(3);
    }, [radius]);

    // 2. Efecto de animación D3
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
        <Card title="Número de víctimas de ayer">
            <View 
                style={styles.pieContainer}
                onLayout={(e) => setDimensions({ width: e.nativeEvent.layout.width, height: 200 })}
            >
                {hoveredId && (
                    <div style={{
                        position: 'absolute',
                        top: mousePos.y - 50,
                        left: mousePos.x,
                        transform: 'translateX(-50%)',
                        background: '#2a2a2a',
                        color: '#eee',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontFamily: systemFont,
                        border: '1px solid #444',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.4)',
                        pointerEvents: 'none',
                        zIndex: 100,
                        transition: 'opacity 0.15s ease-out'
                    }}>
                        <strong>{hoveredId}</strong>
                        <div style={{ color: '#aaa', marginTop: 3 }}>
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
                                        stroke="#1e1e1e" 
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
    pieContainer: { marginTop: 10, position: 'relative', minHeight: 280 },
    legendContainer: { marginTop: 16, paddingHorizontal: 10 },
    legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    legendColor: { width: 12, height: 12, marginRight: 8, borderRadius: 2 },
    legendText: { color: '#CCCCCC', fontSize: 12, fontFamily: systemFont },
});