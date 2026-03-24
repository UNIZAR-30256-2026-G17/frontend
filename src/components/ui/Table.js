import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';

export default function Table({ columns = [], data = [] }) {
    return (
        <View style={styles.table}>

            {/* HEADER */}
            <View style={styles.headerRow}>
                {columns.map((col, index) => (
                    <Text key={index} style={styles.headerCell}>
                        {col.header}
                    </Text>
                ))}
            </View>

            {/* ROWS */}
            {data.map((row, rowIndex) => (
                <View
                    key={rowIndex}
                    style={[
                        styles.row,
                        rowIndex % 2 === 0
                            ? styles.rowEven
                            : styles.rowOdd,
                    ]}
                >
                    {columns.map((col, colIndex) => (
                        <Text key={colIndex} style={styles.cell}>
                            {row[col.accessor]}
                        </Text>
                    ))}
                </View>
            ))}

        </View>
    );
}

const styles = StyleSheet.create({
    table: {
        borderWidth: 1,
        borderColor: theme.colors.tableBorder,
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 10,
    },

    headerRow: {
        flexDirection: 'row',
        backgroundColor: theme.colors.tableHeaderBackground,
        paddingVertical: 10,
    },

    headerCell: {
        flex: 1,
        color: theme.colors.tableHeaderText,
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    },

    row: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: theme.colors.tableBorder,
        paddingVertical: 10,
    },

    rowEven: {
        backgroundColor: theme.colors.tableRowEven,
    },

    rowOdd: {
        backgroundColor: theme.colors.tableRowOdd,
    },

    cell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 14,
        color: theme.colors.tableText,
    },
});
