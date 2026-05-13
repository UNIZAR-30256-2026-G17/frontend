import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';

export default function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        {[...Array(cols)].map((_, i) => (
          <Skeleton key={`h-${i}`} width="20%" height={20} style={{ flex: 1, marginHorizontal: 8 }} />
        ))}
      </View>

      {/* Rows Skeleton */}
      {[...Array(rows)].map((_, i) => (
        <View key={`r-${i}`} style={styles.row}>
          {[...Array(cols)].map((_, j) => (
            <Skeleton key={`c-${j}`} width="15%" height={16} style={{ flex: 1, marginHorizontal: 8 }} />
          ))}
          <Skeleton width={80} height={32} borderRadius={20} style={{ marginLeft: 16 }} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
});
